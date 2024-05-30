import cron from 'node-cron'
import { CALENDAR_SINGLETON } from '../calendar/calendar'
import { User, type UserDocument } from '../../model/user'

interface userHeatingOrder {
  heaterId: string
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
        console.error('CalendarFritzSyncController: Error starting calendar fritz sync:', error)
      })
    })
  }

  private async start (): Promise<void> {
    const events = await CALENDAR_SINGLETON.getTodaysEvents()
    if (events.length === 0) {
      console.debug('No events found, skipping calendar fritz sync')
      return
    }
    console.debug(`${events.length} found, starting calendar fritz sync`)
  }

  /**
   * Retrieves a user document with the specified username.
   * @param username - The username of the user.
   * @returns A promise that resolves to the user document, or undefined if the user is not found.
   */
  private async getUserWithName (username: string): Promise<UserDocument | undefined> {
    const user = await User.findOne({ username })
    if (!user) {
      console.warn(`CalendarFritzSyncController: Calendar entry includes ${username}, which has not been found`)
      return undefined
    }
    return user
  }
}

export const CALENDAR_FRITZ_SYNC_SINGLETON = new CalendarFritzSyncController()
