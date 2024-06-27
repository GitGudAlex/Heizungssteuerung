import cron from 'node-cron'
import { HeatingOrder } from './heating-order'
import { type CalendarComponent } from 'ical'
import { User } from '../../model/user'
import { FRITZ_SINGLETON } from '../fritz/fritz'
import { type IDeviceController } from '../devices/device.interface'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { CALENDAR_SINGLETON } from '../calendar/calendar'
import { CALENDAR_PARSING_REGEX } from './calendar-parsing-regex'
import { getAdminSettings } from '../../routes/admin-settings'
import { OFFSET_CALCULATOR_SINGLETON } from './offset-calculator'

// The calendar events include the building name and the user name in the summary.
// This is the building name we are interested in.

/**
 * Controlls the heating orders for the system.
 * Sets the heating orders in the FritzBox heaters.
 *
 * Implements the logic to:
 * - handle multiple heating orders at the same time.
 * - Prioritize manual heating orders over calendar heating orders.
 * - Set the heaters to default temperature if no heating order is active.
 *
 */
export class HeatingController {
  readonly deviceController: IDeviceController = DEVICE_CONTROLLER_SINGLETON

  readonly fritzController = FRITZ_SINGLETON
  readonly offsetCalculator = OFFSET_CALCULATOR_SINGLETON
  readonly _heatingOrders: HeatingOrder[] = []
  defaultTemp = 16
  buildingOfInterest = 'n5'

  // array of manually set heaters
  readonly manuallySetHeaters: Array<{ heaterId: string, dueDate: Date }> = []

  async startSync (): Promise<void> {
    const adminSettings = await getAdminSettings()
    this.defaultTemp = adminSettings.defaultTemp
    this.buildingOfInterest = adminSettings.buildingOfInterest
    console.info(
      `📦 Admin Settings received:\n${JSON.stringify(adminSettings)}`
    )

    cron.schedule('* * * * *', async () => {
      const { isSyncActive } = await getAdminSettings()
      if (isSyncActive) {
        await this.syncCalendarHeatingOrders()
        await this.setHeatersAccordingToHeatingOrders()
      } else {
        console.info('HeatingController: Sync is not active.')
      }
    })
  }

  get heatingOrders (): HeatingOrder[] {
    return this._heatingOrders
  }

  public addManuallySetHeater (heaterId: string): void {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)
    dueDate.setHours(0, 1, 0, 0)
    if (
      !this.manuallySetHeaters.some((heater) => heater.heaterId === heaterId)
    ) {
      this.manuallySetHeaters.push({ heaterId, dueDate })
      console.debug(
        `Heater ${heaterId} has been manually set, will be automated again on ${dueDate.toISOString()}`
      )
    }
  }

  /**
   * Returns true if the heater is manually set to a certain temperature.
   * This avoids that the heater is turned off by the heating controller.
   * It will check the due date and delete the heater from the list if the due date is reached.
   * @param heaterId
   * @returns
   */
  IsHeaterManuallySet (heaterId: string): boolean {
    const manuallySetHeater = this.manuallySetHeaters.find(
      (heater) => heater.heaterId === heaterId
    )

    if (manuallySetHeater) {
      if (new Date() < manuallySetHeater.dueDate) {
        console.debug(`Heater ${heaterId} has been manually set.`)
        return true
      } else {
        this.manuallySetHeaters.splice(
          this.manuallySetHeaters.indexOf(manuallySetHeater),
          1
        )
        console.debug(
          `Heater ${heaterId} has been automated again, due date has been reached (${manuallySetHeater.dueDate.toISOString()}).`
        )
      }
    }
    return false
  }

  /**
   * Adds a heating order to the list of heating orders.
   * Checks that the heating order is not already in the list based on its parameters.
   * @param heatingOrder - The heating order to add.
   */
  public addHeatingOrder (heatingOrder: HeatingOrder): void {
    const heatingOrderParameters = heatingOrder.getParameters()

    // Check if there is an existing order by the same user
    const indexToReplace = this._heatingOrders.findIndex((order) => {
      return order.getParameters().username === heatingOrderParameters.username
    })

    if (indexToReplace !== -1) {
      console.warn(
        `HeatingController addHeatingOrder(): User ${heatingOrderParameters.username} already has an existing order. Replacing the existing order.`
      )
      this._heatingOrders.splice(indexToReplace, 1)
    }

    this._heatingOrders.push(heatingOrder)
  }

  /**
   * Sets the heaters for the moment according to the existing heating orders.
   */
  async setHeatersAccordingToHeatingOrders (
    heatingOrders: HeatingOrder[] = this._heatingOrders
  ): Promise<void> {
    const rooms = await this.deviceController.getRooms()
    // remove duplicates
    const uniqueRooms = [...new Set(rooms)]
    console.info(
      'HeatingController: Setting heaters according to heating orders, for rooms:',
      uniqueRooms
    )
    console.debug(
      'HeatingController: Heating orders:',
      JSON.stringify(heatingOrders, null, 2)
    )
    for (const room of uniqueRooms) {
      const roomHeatingOrdersForTheMoment = heatingOrders.filter((order) => {
        const parameters = order.getParameters()
        // the time is not working as expected for the calendar, so we are working with UTC all the time
        // Even if the time is set to Berlin, the time is still in UTC
        const getCurrentTimeInBerlin = (): Date => {
          const options = { timeZone: 'Europe/Berlin', hour12: false }
          const berlinTimeString = new Date().toLocaleString('en-US', options)
          return new Date(berlinTimeString)
        }
        return (
          parameters.startDateTime < getCurrentTimeInBerlin() &&
          parameters.endDataTime > getCurrentTimeInBerlin() &&
          parameters.room === room
        )
      })
      await this.setHeatersOfRoom(roomHeatingOrdersForTheMoment, room)
    }
  }

  /**
   * Set the heaters of a room according to the current heating orders.
   * Prio1: If there are manual heating orders, the heaters will be set to the average temperature of the manual orders.
   * Prio2: If there are calendar heating orders, the heaters will be set to the average temperature of the calendar orders.
   * Prio3: If there are no heating orders, the heaters will be set to the default temperature.
   * @param heatingOrders - The heating orders that affect the room for the moment.
   * @param room - The room for which to set the heaters.
   */
  async setHeatersOfRoom (
    heatingOrders: HeatingOrder[],
    room: string
  ): Promise<void> {
    console.info('HeatingController: Setting heaters for room:', room)
    const allHeaterIds = await this.deviceController.getHeaterIdsByRoom(room)
    if (allHeaterIds.length === 0) {
      console.warn(`No heaters found for room ${room}, cannot temperature`)
      return
    }
    if (heatingOrders.length === 0) {
      console.debug(
        `No heating orders relevant for the moment in room ${room}, setting heaters to default admin temperature`
      )
      for (const heaterId of allHeaterIds) {
        if (this.IsHeaterManuallySet(heaterId)) {
          continue
        }
        await FRITZ_SINGLETON.setTempTarget(heaterId, this.defaultTemp)
      }
      return
    }

    console.debug(
      `Setting heaters according to manual heating orders for room ${room}`
    )
    // find the average temperature of all manual heating orders
    let averageTemp = 0
    for (const order of heatingOrders) {
      averageTemp += order.getParameters().temperature
    }
    averageTemp /= heatingOrders.length
    for (const heaterId of allHeaterIds) {
      if (this.IsHeaterManuallySet(heaterId)) {
        continue
      }
      await FRITZ_SINGLETON.setTempTarget(heaterId, averageTemp)
    }
  }

  /**
   * Checks the calendar for events and sets heating orders accordingly.
   */
  async syncCalendarHeatingOrders (): Promise<void> {
    const events = await CALENDAR_SINGLETON.getTodaysEvents()

    // !!! use for Testing, Dates are always in UTC timezone
    // const events = [
    //   {
    //     type: 'VEVENT',
    //     summary: 'fd040@n5',
    //     uid: '3a1783dd-ced7-4a07-b753-5256b418993d',
    //     status: 'CONFIRMED',
    //     start: new Date('2024-06-14T11:00:00.000Z'),
    //     end: new Date('2024-06-14T22:00:00.000Z'),
    //     created: new Date('2024-06-14T14:49:57.000Z'),
    //     dtstamp: new Date('2024-06-14T08:21:50.000Z'),
    //     lastmodified: new Date('2024-06-14T08:21:50.000Z'),
    //     sequence: '4'
    //   }
    // ]

    if (events.length === 0) {
      console.debug('No events found, skipping calendar heating order sync')
      return
    }
    console.info(`HeatingController: ${events.length} Calendar Event found.`)
    console.debug(
      'HeatingController: Calendar Events:',
      JSON.stringify(events, null, 2)
    )

    for (const event of events) {
      const userHeatingOrder = await this.parseCalendarEvent(
        event as unknown as CalendarComponent
      )
      if (userHeatingOrder) {
        this.addHeatingOrder(userHeatingOrder)
      }
    }
  }

  /**
   * Parses a calendar event into a heating order. Will check if all parameters in the event are valid.
   * @param event
   * @returns HeatingOrder if the event is valid, undefined otherwise.
   */
  async parseCalendarEvent (
    event: CalendarComponent
  ): Promise<HeatingOrder | undefined> {
    if (!event.summary) {
      console.warn(
        'CalendarFritzSyncController parseEvent(): Calendar entry does not include a summary \n',
        event
      )
      return undefined
    }

    const { user, building } = this.regexCalendarEntryForRoomAndUser(
      event.summary
    )
    if (!user || !building) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not include a username`
      )
      return undefined
    }

    if (building !== this.buildingOfInterest) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not include the building we are look for`
      )
      return undefined
    }

    const userDb = await User.findOne({ username: user })
    if (!userDb) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} includes ${user}, which has not been found`
      )
      return undefined
    }

    if (event.start === undefined || event.end === undefined) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not include a start or end time`
      )
      return undefined
    }

    // Calculate the preheating offset, so the room reaches the target temperature at the start of the event
    const preheatingOffsetStartDate = await this.offsetCalculator.calculatePreheatingOffset(event.start, userDb.room, userDb.temperature)

    try {
      return new HeatingOrder(
        userDb.room,
        userDb.temperature,
        preheatingOffsetStartDate,
        event.end,
        user
      )
    } catch (e) {
      console.warn(
        `Could not create heating order for ${userDb.room} with temperature ${
          userDb.temperature
        } and start ${event.start.toString()} and end ${event.end.toString()} \n`
      )
      console.warn(e)
      return undefined
    }
  }

  /**
   * Extracts the user and building from a calendar entry using a universal regex, that can be defined by the admin.
   * @param str - The calendar entry.
   * @returns The user and building.
   */
  regexCalendarEntryForRoomAndUser (str: string): {
    user: string | undefined
    building: string | undefined
  } {
    const match = str.match(CALENDAR_PARSING_REGEX)

    if (!match || match.length < 3) {
      console.warn(
        `Could not extract user and building from calendar entry ${str}, using RegEx ${CALENDAR_PARSING_REGEX.toString()}`
      )
      return { user: undefined, building: undefined }
    }

    return { user: match[1], building: match[2] }
  }
}

export const HEATING_CONTROLLER_SINGLETON = new HeatingController()
