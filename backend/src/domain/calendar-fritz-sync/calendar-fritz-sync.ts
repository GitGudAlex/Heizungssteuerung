import cron from 'node-cron'
import { CALENDAR_SINGLETON } from '../calendar/calendar'

export class CalendarFritzSyncService {
  public scheduleSyncCron (): void {
    // cron.schedule('* * * * *', () => {
    //   this.start().catch((error) => {
    //     console.error('Error starting calendar fritz sync:', error)
    //   })
    // })
  }

  private async start (): Promise<void> {
    const calendarEvents = await CALENDAR_SINGLETON.getCalendarEvents()
    console.log(JSON.stringify(calendarEvents))
  }
}

export const CALENDAR_FRITZ_SYNC_SINGLETON = new CalendarFritzSyncService()
