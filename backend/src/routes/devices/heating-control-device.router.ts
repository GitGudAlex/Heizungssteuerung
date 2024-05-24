import { Router } from 'express'
import { FRITZ_SINGLETON } from '../../domain/fritz/fritz'
import { type FritzDevice } from '../../model/fritz/fritz-device.type'

const HEATING_CONTROL_DEVICE_NAMES = ['FRITZ!DECT 301']

export const heatingControlRouter = Router()

/**
 * This endpoint returns a list of all heating control devices.
 */
heatingControlRouter.get('/', async (req, res) => {
  try {
    const deviceList = await FRITZ_SINGLETON.getDeviceListInfos()
    const devices: FritzDevice[] = []
    for (const device of deviceList.device) {
      if (HEATING_CONTROL_DEVICE_NAMES.includes(device.productname)) {
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
 * @returns { tempTarget: number, temperatur: number}
 *    Target Temperature (tempTarget) value in 0.5 °C, value range:
 *    16 – 56
 *    8 to 28°C, 16 <= 8°C, 17 = 8.5°C...... 56 >= 28°C
 *    254 = ON, 253 = OFF
 *    Temperature (temperatur), in 0,1 °C steps (e.g. 200 is 20°C).
 */
heatingControlRouter.get('/:identifier', async (req, res) => {
  try {
    const tempTarget = await FRITZ_SINGLETON.getTempTarget(
      req.params.identifier
    )
    const temperature = await FRITZ_SINGLETON.getTemperature(
      req.params.identifier
    )
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
 * @param temp The temperature to set. Temperature value in 1 °C, range 8 to 28°C
 *             Or the strings "on" & "off"
 * @returns The new temperature target of the device.
 *    Return Temperature value in 0.5 °C, value range:
 *    16 – 56
 *    8 to 28°C, 16 <= 8°C, 17 = 8.5°C...... 56 >= 28°C
 *    254 = ON, 253 = OFF
 */
heatingControlRouter.post('/:identifier', async (req, res) => {
  try {
    const temp = req.body.temp
    if (
      (typeof temp !== 'number' && temp !== 'on' && temp !== 'off') ||
      (typeof temp === 'number' && (temp < 8 || temp > 28 || temp % 1 !== 0))
    ) {
      console.error('Invalid temperature value')
      res.status(400).send('Invalid temperature value')
      return
    }
    const response = await FRITZ_SINGLETON.setTempTarget(
      req.params.identifier,
      temp as number | 'on' | 'off'
    )
    res.status(200).send(response)
  } catch (error) {
    console.error('Error setting temperature target:', error)
    res.status(500).send(error)
  }
})
