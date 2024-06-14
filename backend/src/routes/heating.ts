import express, { type Request, type Response } from 'express'
import { HeatingOrder } from '../domain/heating/heating-order'
import { HEATING_CONTROLLER_SINGLETON } from '../domain/heating/heating-controller'

const heatingRouter = express.Router()

/**
 * Receives a heating order and creates a new HeatingOrder object in the heatingController with the given parameters.
 */
heatingRouter.post('/', (req: Request, res: Response) => {
  const { room, temperature, startDateTimeAsString, endDataTimeAsString, user } =
    req.body
  console.info('Heating order received:', {
    room,
    temperature,
    startDateTimeAsString,
    endDataTimeAsString,
    user
  })

  if (!room || !temperature || !startDateTimeAsString || !endDataTimeAsString) {
    res.status(400).send('Missing parameters')
    return
  }
  if (typeof room !== 'string') {
    res.status(400).send('Room must be a string')
    return
  }
  if (typeof temperature !== 'number') {
    res.status(400).send('Temperature must be a number')
    return
  }
  if (typeof startDateTimeAsString !== 'string') {
    res.status(400).send('Start date and time must be a string')
    return
  }
  if (typeof endDataTimeAsString !== 'string') {
    res.status(400).send('End date and time must be a string')
    return
  }
  const endDataTime = new Date(endDataTimeAsString)
  if (endDataTime < new Date()) {
    res.status(400).send('End date and time must be in the future')
    return
  }
  const startDateTime = new Date(startDateTimeAsString)
  if (typeof user !== 'string') {
    res.status(400).send('User must be a string')
    return
  }

  try {
    const heatingOrder = new HeatingOrder(
      room,
      temperature,
      startDateTime,
      endDataTime,
      user
    )
    HEATING_CONTROLLER_SINGLETON.addHeatingOrder(heatingOrder)
    res.status(200).send('Heating order received')
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    } else {
      res.status(500).send(error)
    }
  }
})

export default heatingRouter
