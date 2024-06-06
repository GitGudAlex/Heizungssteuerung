import { type CalendarComponent } from 'ical'

export interface ICalendarController {
  /**
     * @returns All events of the calendar for the Heizungssteuerung calendar for today.
     * Name of the calendar is in the environment variable CALENDAR_NAME_HEIZUNGSSTEUERUNG
     */
  getTodaysEvents: () => Promise<CalendarComponent[]>
}
