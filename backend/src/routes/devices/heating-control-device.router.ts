import { Router } from 'express'
import { FRITZ_SINGLETON } from '../../domain/fritz/fritz'
import { type FritzDevice } from '../../model/fritz/fritz-device.type'

const HEATING_CONTROL_DEVICE_NAMES = ['DECT 301']

export const heatingControlRouter = Router()

/**
 * This endpoint returns a list of all heating control devices.
 */
heatingControlRouter.get('/', async (req, res) => {
  try {
    const deviceList = await FRITZ_SINGLETON.getDeviceListInfos()
    const devices: FritzDevice[] = []
    for (const device of deviceList.device) {
      if (HEATING_CONTROL_DEVICE_NAMES.includes(device.name)) {
        devices.push(device)
      }
    }
    res.status(200).send(devices)
  } catch (error) {
    console.error('Error getting device list:', error)
    res.status(500).send(error)
  }
})

/**
 * @param identifier The identifier of the device. (e.g "09995 0688917")
 * @returns the temperature target and current temperature measured of a heating control device.
 */
heatingControlRouter.get('/:identifier', async (req, res) => {
  try {
    const tempTarget = await FRITZ_SINGLETON.getTempTarget(req.params.identifier)
    const temperature = await FRITZ_SINGLETON.getTemperature(req.params.identifier)
    res.status(200).send({
      tempTarget,
      temperature
    })
  } catch (error) {
    console.error('Error getting device:', error)
    res.status(500).send(error)
  }
})

/**
 * @param identifier The identifier of the device. (e.g "09995 0688917")
 * @param temp The temperature to set.
 *    Temperature value in 0.5 °C, value range:
 *    16 – 56
 *    8 to 28°C, 16 <= 8°C, 17 = 8.5°C...... 56 >= 28°C
 *    254 = ON, 253 = OFF
 */
heatingControlRouter.post('/:identifier', async (req, res) => {
  try {
    const temp = Number(req.body.temp)
    if (temp === undefined || isNaN(temp)) {
      throw new Error('Temperature must be a number')
    }
    const response = await FRITZ_SINGLETON.setTempTarget(req.params.identifier, temp)
    res.status(200).send(response)
  } catch (error) {
    console.error('Error setting temperature target:', error)
    res.status(500).send(error)
  }
})
