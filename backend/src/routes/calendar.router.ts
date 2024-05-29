import express from 'express'
import { CALENDAR_SINGLETON } from '../domain/calendar/calendar'

// UTC fixes timezone issues
process.env.TZ = 'UTC'

const calendarRouter = express.Router()
let cachedEvents: any | undefined = []

let lastFetchTime = 0
const fetchInterval = 15 * 60 * 1000 // 15 mins

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function checkLastGetRequest (res: any) {
  const currentTime = Date.now()
  const timeSinceLastFetch = currentTime - lastFetchTime

  if (timeSinceLastFetch < fetchInterval) {
    const remainingTime = fetchInterval - timeSinceLastFetch
    const remainingMinutes = Math.floor(remainingTime / 60000)
    const remainingSeconds = Math.floor((remainingTime % 60000) / 1000)

    res.status(429).json({
      message: `Next get-request available in ${remainingMinutes} minutes and ${remainingSeconds} seconds.`
    })
    return true
  }

  lastFetchTime = currentTime
  return false
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
calendarRouter.get('/events', async (req, res) => {
  if (checkLastGetRequest(res)) {
    return
  }
  try {
    const events = await CALENDAR_SINGLETON.getCalendarEvents()
    cachedEvents = events
    res.json(events)
  } catch (error: any) {
    console.error('Error getting calendar events:', error)
    res.status(500).send(error.toString())
  }
})

calendarRouter.get('/heaters', async (req, res) => {
  if (checkLastGetRequest(res)) { /* empty */ } else {
    try {
      cachedEvents = await CALENDAR_SINGLETON.getCalendarEvents()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const heaterData = await CALENDAR_SINGLETON.getHeatingControlData(cachedEvents)
      res.json(heaterData)
    } catch (error) {
      res.status(500).send('Error getting formated calendar events')
    }
  }
})

export default calendarRouter
