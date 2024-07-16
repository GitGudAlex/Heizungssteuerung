import cron from 'node-cron'
import { HeatingOrder } from './heating-order'
import { type CalendarComponent } from 'ical'
import { User } from '../../model/user'
import { FRITZ_SINGLETON } from '../fritz/fritz'
import { type IDeviceController } from '../devices/device.interface'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { CALENDAR_SINGLETON } from '../calendar/calendar'
import { getAdminSettings } from '../../routes/admin-settings'
import { OFFSET_CALCULATOR_SINGLETON } from './offset-calculator'
import { NIGHTLY_SHUTOFF_HANDLER_SINGLETON } from './nightly-shutoff-handler'

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
  _heatingOrders: HeatingOrder[] = []
  defaultTemp = 16

  // array of manually set heaters
  readonly manuallySetHeaters: Array<{ heaterId: string, dueDate: Date }> = []

  async startSync (): Promise<void> {
    // Sync the heating orders every other second at 0 seconds
    cron.schedule('0 * * * * *', async () => {
      const { isSyncActive, defaultTemp } = await getAdminSettings()
      this.defaultTemp = defaultTemp
      if (isSyncActive) {
        console.info(
          '\n***HeatingController: Syncing calendar with heating orders.'
        )
        await this.syncCalendarHeatingOrders()
        console.info(
          '***HeatingController: Calendar Events has been synced to heating orders.\n'
        )
      } else {
        console.warn('HeatingController: Calendar Sync is not active.')
      }
    })

    // Sync the heating orders every other second at 30 seconds
    cron.schedule('30 * * * * *', async () => {
      const { isSyncActive, defaultTemp } = await getAdminSettings()
      this.defaultTemp = defaultTemp
      if (isSyncActive) {
        console.info(
          '\n***HeatingController: Syncing heating with heating orders.'
        )

        // if the nightly shutoff is active, set all heaters to default temp
        if (await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive()) {
          console.info('HeatingController: Nightly shutoff is active.')
          await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.setHeatersToDefaultTemp(
            this.defaultTemp
          )
        } else {
          console.info('HeatingController: Nightly shutoff is not active.')
          await this.setHeatersAccordingToHeatingOrders()
        }

        console.info(
          '***HeatingController: Heaters have been set according to heating orders.\n'
        )
      } else {
        console.warn('HeatingController: Heating Sync is not active.')
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
    //     params: [],
    //     created: '2024-07-02T13:47:25.000Z',
    //     dtstamp: '2024-07-03T08:29:49.000Z',
    //     lastmodified: '2024-07-03T08:29:49.000Z',
    //     sequence: '4',
    //     uid: '8bd26f4e-8849-45cb-a4a6-ca4651b434a4',
    //     start: '2024-07-02T22:00:00.000Z',
    //     end: '2024-07-03T22:00:00.000Z',
    //     status: 'CONFIRMED',
    //     summary: 'admin@n5'
    //   }
    // ]

    if (events.length === 0) {
      console.debug('No events found, skipping calendar heating order sync')
      return
    }
    console.info(`HeatingController: ${events.length} Calendar Event found.`)
    console.info('Cleaning up old heating orders.')
    this._heatingOrders = []
    console.debug(
      'HeatingController: Calendar Events:',
      JSON.stringify(events, null, 2)
    )

    for (const event of events) {
      const userHeatingOrder = await this.parseCalendarEvent(
        event as unknown as CalendarComponent
      )
      if (userHeatingOrder) {
        this._heatingOrders.push(userHeatingOrder)
      }
    }
    console.info(
      `HeatingController: Heating orders have been set according to the calendar events.\n ${JSON.stringify(
        this._heatingOrders,
        null,
        2
      )}`
    )
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

    const userCalStrings: Array<{ username: string, calString: string }> = []
    const allUsernamesAndCalString = await User.find({}).select(
      'username calString'
    )
    for (const user of allUsernamesAndCalString) {
      if (user?.calString && user?.username) {
        userCalStrings.push({
          username: user.username,
          calString: user.calString
        })
      }
    }

    if (userCalStrings.length === 0) {
      console.warn(
        'CalendarFritzSyncController parseEvent(): No users with CalStrings found in the database. \n'
      )
      return undefined
    }

    const userCalString = userCalStrings.find((user) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const eventName = event.summary!.toLowerCase()
      const calString = user.calString.toLowerCase()
      if (eventName.includes(calString)) {
        return true
      }
      return false
    })

    if (!userCalString) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not match a users Calender string.`
      )
      return undefined
    }
    console.debug(
      `CalendarFritzSyncController: Found user ${userCalString.username} for event ${event.summary}`
    )

    const userDb = await User.findOne({ username: userCalString.username })

    if (!userDb) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not match a users Calender string.`
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
    console.info(`Calculating preheating offset for ${event.summary}`)
    const preheatingOffsetStartDate =
      await this.offsetCalculator.calculatePreheatingOffset(
        event.start,
        userDb.room,
        userDb.temperature,
        this.defaultTemp
      )

    try {
      return new HeatingOrder(
        userDb.room,
        userDb.temperature,
        preheatingOffsetStartDate,
        event.end,
        userDb.username
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
}

export const HEATING_CONTROLLER_SINGLETON = new HeatingController()
