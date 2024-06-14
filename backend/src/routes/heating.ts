import express, { type Request, type Response } from 'express'
import { HEATING_CONTROLLER_SINGLETON } from '../domain/heating/heating-controller'
import { FRITZ_SINGLETON } from '../domain/fritz/fritz'

const heatingRouter = express.Router()

/**
 * Receives a heating order and creates a new HeatingOrder object in the heatingController with the given parameters.
 */
heatingRouter.post('/', async (req: Request, res: Response) => {
  const { id, temperature } =
    req.body
  console.info('HeatingRouter: Manual Heating order received:', {
    id,
    temperature
  })

  if (typeof temperature !== 'number') {
    res.status(400).send('Temperature must be a number')
    return
  }
  if (typeof id !== 'string') {
    res.status(400).send('Id must be a string')
    return
  }

  try {
    await FRITZ_SINGLETON.setTempTarget(id, temperature)
  } catch (error) {
    res.status(500).send('Error setting temperature target')
    return
  }

  HEATING_CONTROLLER_SINGLETON.addManuallySetHeater(id)
  res.status(200).send('Heater set to ' + temperature + '°C')
})

export default heatingRouter
