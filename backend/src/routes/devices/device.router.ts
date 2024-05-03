import { Router } from 'express'
import { FRITZ_SINGLETON } from '../../domain/fritz/fritz'
import { heatingControlRouter } from './heating-control-device.router'
import { type FritzDeviceList } from '../../model/fritz/fritz-device.type'

export const deviceRouter = Router()

/**
 * There are multiple types of devices, e.g. heating control, thermostat, etc.
 * This router is for all endpoints related to all devices.
 * There are also routers for specific types of devices, e.g. heating control.
 */
deviceRouter.use('/heating-control', heatingControlRouter)

/**
 * @returns a list of all devices.
 */
deviceRouter.get('/', async (req, res) => {
  try {
    const deviceList: FritzDeviceList = await FRITZ_SINGLETON.getDeviceListInfos()
    res.status(200).send(deviceList)
  } catch (error) {
    console.error('Error getting device list:', error)
    res.status(500).send(error)
  }
})

/**
 * @param identifier The identifier of the device. (e.g "09995 0688917")
 * @returns the basic information of a device.
 */
deviceRouter.get('/:identifier', async (req, res) => {
  try {
    const device: any = await FRITZ_SINGLETON.getBasicDeviceStats(req.params.identifier)
    res.status(200).send(device)
  } catch (error) {
    console.error('Error getting device:', error)
    res.status(500).send(error)
  }
})
