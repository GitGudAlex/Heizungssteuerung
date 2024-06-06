import { Router } from 'express'
import { FRITZ_SINGLETON } from '../../domain/fritz/fritz'
import { heatingControlRouter } from './heating-control-device.router'
import { type FritzDeviceList } from '../../domain/fritz/fritz-device.type'
import { Device, type DeviceDocument } from '../../model/device'
import { ROOMS_HEATERS_MAP } from '../../domain/devices/rooms-heaters-map'
import { HEATER_DEVICE_TYPES } from '../../domain/devices/heater-device-types'

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

deviceRouter.get('/device-map', async (req, res) => {
  try {
    const map = {
      roomsHeatersMap: ROOMS_HEATERS_MAP,
      heaterDeviceTypes: HEATER_DEVICE_TYPES
    }
    res.status(200).send(map)
  } catch (error: any) {
    console.error('Device Router Error: /device-map', error)
    res.status(500).send('Device Router Error: /device-map' + error.message)
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

deviceRouter.post('/db/devices', async (req, res) => {
  try {
    const { name, identifier, type, heaterMap, roomMap } = req.body
    // TODO: Check if device with identifier is online in FritzBox
    // e.g. with the logic from the route above
    // then, add additional info to the device in the db (check what is needed in dashboard)
    // also check if device identifier / map / name are unique. Those should not be in DB already

    const device: DeviceDocument = new Device({ name, identifier, type, heaterMap, roomMap })
    await device.save()
    res.status(200).json({ message: 'Device saved successfully' })
  } catch (error) {
    console.error('Error saving device:', error)
    res.status(500).send(error)
  }
})

// get all devices from db
deviceRouter.get('/db/devices', async (req, res) => {
  try {
    const devices: DeviceDocument[] = await Device.find()
    res.status(200).json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    res.status(500).send(error)
  }
})

// delete device from db using identifier
deviceRouter.delete('/db/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params
    await Device.deleteOne({ identifier })
    res.status(200).json({ message: 'Device deleted successfully' })
  } catch (error) {
    console.error('Error deleting device:', error)
    res.status(500).send(error)
  }
})
