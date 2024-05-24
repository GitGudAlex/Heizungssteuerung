import * as ical from 'ical'
import * as dav from 'dav'
import { subMilliseconds, startOfToday, endOfToday } from 'date-fns'
import { type Calendar, type CalendarResults } from '../../model/calendar/calendar-results.type'

export class CalendarController {
  private readonly domain: string
  private readonly username: string
  private readonly password: string
  private readonly calendars: Record<string, { start: Date, end: Date }>

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

  public async getCalendarEvents (): Promise<CalendarResults | undefined> {
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

  async getHeatingControlData (cachedEvents: { calendars: any[] }): Promise<any[]> {
    const heatingData: any[] = []
    cachedEvents.calendars.forEach(calendar => {
      if (calendar.name === 'Heizungssteuerung') {
        calendar.events.forEach((event: { summary: any, start: any, description: any }) => {
          try {
            heatingData.push({
              title: event.summary,
              date: event.start,
              device: event.description
            })
          } catch (error) {
            console.error('Error while parsing heating data:', error)
          }
        })
      }
    })

    return heatingData
  }

  async createDavAccount (): Promise<dav.Account | undefined> {
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
      return undefined
    }
  }
}

export const CALENDAR_SINGLETON = new CalendarController()
