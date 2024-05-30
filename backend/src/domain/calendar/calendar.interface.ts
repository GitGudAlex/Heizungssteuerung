import { type CalendarComponent } from 'ical'

export interface ICalendarController {
  /**
     * @returns All events of the calendar for today, for the Heizungssteuerung calendar. Name of the calendar is in the environment variable CALENDAR_NAME_HEIZUNGSSTEUERUNG
     */
  getTodaysEvents: () => Promise<CalendarComponent[]>
}
