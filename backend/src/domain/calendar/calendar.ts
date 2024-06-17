import * as ical from 'ical'
import * as dav from 'dav'
import { subMilliseconds, startOfToday, endOfToday } from 'date-fns'
import { type Calendar, type CalendarResults } from './calendar-results.type'
import { type ICalendarController } from './calendar.interface'

export class CalendarController implements ICalendarController {
  private readonly domain: string
  private readonly username: string
  private readonly password: string
  private readonly calendars: Record<string, { start: Date, end: Date }>

  // As we do not want to fetch the calendar data to often, to avoid blocks by Nextcloud,
  // we defined an interval for fetching the calendar data.
  private readonly fetchInterval: number = 15 * 60 * 1000 // 15 mins
  private lastFetchTime: number = 0
  private cachedEvents: ical.CalendarComponent[] = []

  constructor () {
    this.domain = process.env.CALENDAR_DOMAIN ?? ''
    if (this.domain === '') {
      throw new Error('CALENDAR_DOMAIN is not set')
    }
    this.username = process.env.CALENDAR_USERNAME ?? ''
    if (this.username === '') {
      throw new Error('CALENDAR_USERNAME is not set')
    }
    this.password = process.env.CALENDAR_PASSWORD ?? ''
    if (this.password === '') {
      throw new Error('CALENDAR_PASSWORD is not set')
    }
    const calendarName = process.env.CALENDAR_NAME_HEIZUNGSSTEUERUNG ?? ''
    if (calendarName === '') {
      throw new Error('CALENDAR_NAME_HEIZUNGSSTEUERUNG is not set')
    }

    this.calendars = {
      [calendarName]: {
        start: startOfToday(),
        end: endOfToday()
      }
    }
  }

  /**
   * Get the events of the calendar for today for the given calendar name in the environment variables.
   * env: CALENDAR_NAME_HEIZUNGSSTEUERUNG
   * @returns CalendarResults
   */
  private async getTodaysCalendarEvents (): Promise<
  CalendarResults | undefined
  > {
    const userCalendars = this.calendars
    const foundEvents: CalendarResults = { calendars: [] }

    const account = await this.createDavAccount()
    if (account === undefined) {
      return undefined
    }

    account.calendars.forEach((calendar) => {
      if (!Object.keys(userCalendars).includes(calendar.displayName)) {
        return
      }

      const calendarJSON: Calendar = {
        name: calendar.displayName,
        events: []
      }

      const startDate = userCalendars[calendar.displayName].start
      const endDate = userCalendars[calendar.displayName].end

      calendar.objects.forEach((event) => {
        const eventData = ical.parseICS(event.calendarData)
        for (const key in eventData) {
          const eventDetails = eventData[key]
          if (
            eventDetails.end === undefined ||
            eventDetails.start === undefined
          ) {
            throw new Error('Event start or end is undefined')
          }

          if (eventDetails.type === 'VEVENT') {
            const eventStart: Date = eventDetails.start
            const eventEnd: Date = subMilliseconds(eventDetails.end, 1)

            if (eventStart <= endDate && eventEnd >= startDate) {
              calendarJSON.events.push(eventDetails)
            }
            break
          }
        }
      })
      foundEvents.calendars.push(calendarJSON)
    })

    return foundEvents
  }

  /**
   * Does the initial setup for the dav account, retries 3 times if it fails, waiting for 20 seconds between each attempt.
   * @returns dav.Account object if the account was created successfully, undefined otherwise
   */
  private async createDavAccount (): Promise<dav.Account | undefined> {
    let retry = 0
    try {
      const davServerURL = `${this.domain}/remote.php/dav/`
      const auth = new dav.transport.Basic(
        new dav.Credentials({
          username: this.username,
          password: this.password
        })
      )

      return await dav.createAccount({
        server: davServerURL,
        xhr: auth,
        loadObjects: true
      })
    } catch (error) {
      console.error('Error creating dav account:', error)
      if (retry < 3) {
        retry++
        console.info(`Retrying to create dav account, waiting for 20 seconds, attempt: ${retry}`)
        // sleep for 20 seconds
        await new Promise((resolve) => setTimeout(resolve, 20000))
        return await this.createDavAccount()
      }
      console.info('Failed to create dav account after 3 attempts')
      return undefined
    }
  }

  /**
   * Parses the calendar results to an array of ical.CalendarComponent objects,
   * this does not check the date range or calendar name,
   * getCalendarEvents does that.
   * @param calendarResults Object containing the calendar results
   * @returns Array of ical.CalendarComponent objects
   */
  private parseCalendarResultsToEvents (
    calendarResults: CalendarResults
  ): ical.CalendarComponent[] {
    const events: ical.CalendarComponent[] = []
    calendarResults.calendars.forEach((calendar) => {
      calendar.events.forEach((event) => {
        events.push(event)
      })
    })

    return events
  }

  /**
   * @returns true if the time since the last calendar fetch is more than the fetch interval, false otherwise
   */
  private isFetchIntervalOver (): boolean {
    const currentTime = Date.now()
    const timeSinceLastFetch = currentTime - this.lastFetchTime

    if (timeSinceLastFetch < this.fetchInterval) {
      return true
    }

    this.lastFetchTime = currentTime
    return false
  }

  /**
   * Checks whether the time since the last fetch is more than the fetch interval,
   * if it is, it fetches the calendar events for today and returns them.
   * If it is not, it returns the cached events.
   */
  public async getTodaysEvents (): Promise<ical.CalendarComponent[]> {
    if (this.isFetchIntervalOver()) {
      return this.cachedEvents
    }
    const newEvents = await this.getTodaysCalendarEvents()
    if (!newEvents) {
      console.error('getTodaysEvents(): Error fetching new events')
      return []
    }
    const parsedEvents = this.parseCalendarResultsToEvents(newEvents)
    this.cachedEvents = parsedEvents
    console.info("successfully fetched today's events: \n", parsedEvents)
    return this.cachedEvents
  }
}

export const CALENDAR_SINGLETON = new CalendarController()
