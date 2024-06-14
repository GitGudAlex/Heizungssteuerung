import { Device } from '../../model/device'
import { type IDeviceController } from './device.interface'
import { ROOMS_HEATERS_MAP } from './rooms-heaters-map'

type RoomHeaterIdMap = Array<{ heater: string, room: string, id: string }>

class DeviceController implements IDeviceController {
  private RoomHeaterIdMap: RoomHeaterIdMap = []

  /**
   * Parses the ROOMS_HEATERS_MAP and adds a device id for each heater, if the device is registered in the DB.
   */
  private async getRoomHeaterIdMap (): Promise<void> {
    this.RoomHeaterIdMap = []
    const heatingDevices: RoomHeaterIdMap = []
    const uniqueDeviceIds = new Set()

    for (const roomHeater of ROOMS_HEATERS_MAP) {
      try {
        const devices = await Device.find({
          roomMap: roomHeater.room
        }).exec()

        if (!devices || devices.length === 0) {
          continue
        }

        for (const device of devices) {
          if (!uniqueDeviceIds.has(device.identifier)) {
            uniqueDeviceIds.add(device.identifier)
            heatingDevices.push({
              heater: device.heaterMap,
              room: device.roomMap,
              id: device.identifier
            })
          }
        }
      } catch (error) {
        console.error('getRoomHeaterIdMap(): Error finding device:', error)
      }
    }

    console.info('DeviceController: RoomHeaterIdMap', heatingDevices)
    this.RoomHeaterIdMap = heatingDevices
  }

  public async getHeaterIdsByRoom (room: string): Promise<string[]> {
    await this.getRoomHeaterIdMap()
    return this.RoomHeaterIdMap.filter((map) => map.room === room).map(
      (map) => map.id
    )
  }

  public async getHeaterIds (): Promise<string[]> {
    await this.getRoomHeaterIdMap()
    return this.RoomHeaterIdMap.map((map) => map.id)
  }

  public async getRooms (): Promise<string[]> {
    return ROOMS_HEATERS_MAP.map((map) => map.room)
  }
}

export const DEVICE_CONTROLLER_SINGLETON = new DeviceController()
