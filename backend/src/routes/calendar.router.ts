import express from 'express'
import { CALENDAR_SINGLETON } from '../domain/calendar/calendar'

// UTC fixes timezone issues
process.env.TZ = 'UTC'

const calendarRouter = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
calendarRouter.get('/events', async (req, res) => {
  try {
    const events = await CALENDAR_SINGLETON.getCalendarEvents()
    res.json(events)
  } catch (error: any) {
    console.error('Error getting calendar events:', error)
    res.status(500).send(error.toString())
  }
})

export default calendarRouter
