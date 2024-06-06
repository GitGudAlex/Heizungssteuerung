import cron from 'node-cron'
import { HeatingOrder } from './heating-order'
import { type CalendarComponent } from 'ical'
import { User } from '../../model/user'
import { FRITZ_SINGLETON } from '../fritz/fritz'
import { type IDeviceController } from '../devices/device.interface'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'

// The calendar events include the building name and the user name in the summary.
// This is the building name we are interested in.
const BUILDING_OF_INTEREST = 'n5'

const DEFAULT_TEMP = 20

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
class HeatingController {
  private readonly deviceController: IDeviceController = DEVICE_CONTROLLER_SINGLETON
  private readonly heatingOrders: HeatingOrder[] = []

  constructor () {
    cron.schedule('* * * * *', async () => {
      await this.syncCalendarHeatingOrders()
      await this.setHeatersAccordingToHeatingOrders()
    })
  }

  /**
   * Adds a heating order to the list of heating orders.
   * Checks that the heating order is not already in the list based on its parameters.
   * @param heatingOrder - The heating order to add.
   */
  public addHeatingOrder (heatingOrder: HeatingOrder): void {
    const heatingOrderParameters = heatingOrder.getParameters()
    const isAlreadyInList = this.heatingOrders.some((order) => {
      return (
        JSON.stringify(order.getParameters()) ===
        JSON.stringify(heatingOrderParameters)
      )
    })
    if (isAlreadyInList) {
      console.warn(
        `HeatingController addHeatingOrder(): Heating order ${JSON.stringify(heatingOrderParameters)} is already in the list.`
      )
      return
    }
    this.heatingOrders.push(heatingOrder)
  }

  /**
   * Sets the heaters for the moment according to the existing heating orders.
   */
  private async setHeatersAccordingToHeatingOrders () {
    const defaultTemp = DEFAULT_TEMP

    const roomsThatHaveBeenSet: string[] = []

    const heatingOrdersForTheMoment = this.heatingOrders.filter((order) => {
      const parameters = order.getParameters()
      return (
        parameters.startDateTime < new Date() &&
        parameters.endDataTime > new Date()
      )
    })

    // Used DefaultTemp for all rooms, if no heating order is active
    if (heatingOrdersForTheMoment.length === 0) {
      console.debug('No heating orders relevant for the moment, setting heaters to default temperature')
      const allHeaterIds = await this.deviceController.getHeaterIds()
      for (const heaterId of allHeaterIds) {
        await FRITZ_SINGLETON.setTempTarget(heaterId, defaultTemp)
      }
    }

    // Set the heaters according to the manual heating orders, as they are prioritized
    const manualHeatingOrders = heatingOrdersForTheMoment.filter((order) => {
      return order.getParameters().origin === 'manual'
    })
    if (manualHeatingOrders.length > 0) {
      console.debug('Setting heaters according to manual heating orders')
      for (const order of manualHeatingOrders) {
        const parameters = order.getParameters()
        const heaterIds = await this.deviceController.getHeaterIdsByRoom(
          parameters.room
        )
        roomsThatHaveBeenSet.push(parameters.room)
        for (const heaterId of heaterIds) {
          await FRITZ_SINGLETON.setTempTarget(heaterId, parameters.temperature)
        }
      }
    }

    // Set the heaters according to the calendar heating orders
    const calendarHeatingOrders = heatingOrdersForTheMoment.filter((order) => {
      return order.getParameters().origin === 'calendar'
    })
    if (calendarHeatingOrders.length > 0) {
      console.debug('Setting heaters according to calendar heating orders')
      for (const order of calendarHeatingOrders) {
        const parameters = order.getParameters()
        const heaterIds = await this.deviceController.getHeaterIdsByRoom(
          parameters.room
        )
        roomsThatHaveBeenSet.push(parameters.room)
        for (const heaterId of heaterIds) {
          await FRITZ_SINGLETON.setTempTarget(heaterId, parameters.temperature)
        }
      }
    }
  }

  /**
   * Checks the calendar for events and sets heating orders accordingly.
   */
  private async syncCalendarHeatingOrders (): Promise<void> {
    // const events = await CALENDAR_SINGLETON.getTodaysEvents()

    // !!! use for Testing

    const events = [
      {
        type: 'VEVENT',
        summary: 'fd040@n5',
        uid: '3a1783dd-ced7-4a07-b753-5256b418993d',
        status: 'CONFIRMED',
        start: new Date('2024-05-29T22:00:00.000Z'),
        end: new Date('2024-05-30T22:00:00.000Z'),
        created: new Date('2024-05-16T14:49:57.000Z'),
        dtstamp: new Date('2024-05-30T08:21:50.000Z'),
        lastmodified: new Date('2024-05-30T08:21:50.000Z'),
        sequence: '4'
      }
    ]

    if (events.length === 0) {
      console.debug('No events found, skipping calendar fritz sync')
      return
    }
    console.debug(`${events.length} found, starting calendar fritz sync`)
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
  private async parseCalendarEvent (
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

    if (building !== BUILDING_OF_INTEREST) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not include the building we are look for`
      )
      return undefined
    }

    const userDb = await User.findOne({ user })
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

    try {
      return new HeatingOrder(
        userDb.room,
        userDb.temperature,
        event.start,
        event.end
      )
    } catch (e) {
      console.warn(
        `Could not create heating order for ${userDb.room} with temperature ${
          userDb.temperature
        } and start ${event.start.toString()} and end ${event.end.toString()} \n`
      )
      return undefined
    }
  }

  /**
   * Extracts the user and building from a calendar entry using a universal regex, that can be defined by the admin.
   * @param str - The calendar entry.
   * @returns The user and building.
   */
  private regexCalendarEntryForRoomAndUser (str: string): {
    user: string | undefined
    building: string | undefined
  } {
    const regex = /^([^@]+)@([^@]+)$/
    const match = str.match(regex)

    if (!match || match.length < 3) {
      console.warn(
        `Could not extract user and building from calendar entry ${str}, using RegEx ${regex.toString()}`
      )
      return { user: undefined, building: undefined }
    }

    return { user: match[1], building: match[2] }
  }
}

export const HEATING_CONTROLLER_SINGLETON = new HeatingController()
