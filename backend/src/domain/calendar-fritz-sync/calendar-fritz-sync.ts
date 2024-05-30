import cron from 'node-cron'
import { CALENDAR_SINGLETON } from '../calendar/calendar'
import { User, type UserDocument } from '../../model/user'
import { type CalendarComponent } from 'ical'

const BUILDING_OF_INTEREST = 'n5'

interface userHeatingOrder {
  room: string
  temperature: number
  start: Date
  end: Date
}

/**
 * Controller class for syncing calendar events with FritzBox.
 */
export class CalendarFritzSyncController {
  public scheduleSyncCron (): void {
    cron.schedule('* * * * *', () => {
      this.start().catch((error) => {
        console.error(
          'CalendarFritzSyncController: Error starting calendar fritz sync:',
          error
        )
      })
    })
  }

  private async start (): Promise<void> {
    const events = await CALENDAR_SINGLETON.getTodaysEvents()

    // !!! use for Testing
    //
    // const events = [
    //   {
    //     type: 'VEVENT',
    //     summary: 'fd040@n5',
    //     uid: '3a1783dd-ced7-4a07-b753-5256b418993d',
    //     status: 'CONFIRMED',
    //     start: new Date('2024-05-29T22:00:00.000Z'),
    //     end: new Date('2024-05-30T22:00:00.000Z'),
    //     created: new Date('2024-05-16T14:49:57.000Z'),
    //     dtstamp: new Date('2024-05-30T08:21:50.000Z'),
    //     lastmodified: new Date('2024-05-30T08:21:50.000Z'),
    //     sequence: '4'
    //   }
    // ]

    if (events.length === 0) {
      console.debug('No events found, skipping calendar fritz sync')
      return
    }
    console.debug(`${events.length} found, starting calendar fritz sync`)
    const userHeatingOrders: userHeatingOrder[] = []
    for (const event of events) {
      const userHeatingOrder = await this.parseEvent(event as unknown as CalendarComponent)
      if (userHeatingOrder) userHeatingOrders.push(userHeatingOrder)
    }
    console.log(userHeatingOrders)
  }

  private async parseEvent (
    event: CalendarComponent
  ): Promise<userHeatingOrder | undefined> {
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
        `CalendarFritzSyncController: Calendar entry ${event.summary} does not include the correct building`
      )
      return undefined
    }

    const userDb = await this.getUserWithName(user)
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

    return {
      temperature: userDb.temperature,
      room: userDb.room,
      start: event.start,
      end: event.end
    }
  }

  private regexCalendarEntryForRoomAndUser (str: string): {
    user: string | undefined
    building: string | undefined
  } {
    const regex = /^([^@]+)@([^@]+)$/
    const match = str.match(regex)

    if (!match || match.length < 3) {
      return { user: undefined, building: undefined }
    }

    return { user: match[1], building: match[2] }
  }

  /**
   * Retrieves a user document with the specified username.
   * @param username - The username of the user.
   * @returns A promise that resolves to the user document, or undefined if the user is not found.
   */
  private async getUserWithName (
    username: string
  ): Promise<UserDocument | undefined> {
    const user = await User.findOne({ username })
    if (!user) {
      console.warn(
        `CalendarFritzSyncController: Calendar entry includes ${username}, which has not been found`
      )
      return undefined
    }
    return user
  }
}

export const CALENDAR_FRITZ_SYNC_SINGLETON = new CalendarFritzSyncController()
