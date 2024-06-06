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
    for (const roomHeater of ROOMS_HEATERS_MAP) {
      try {
        const device = await Device.findOne({
          type: 'heater',
          name: roomHeater.heater
        }).exec()
        if (device) {
          this.RoomHeaterIdMap.push({
            heater: roomHeater.heater,
            room: roomHeater.room,
            id: device.id
          })
        }
      } catch (error) {
        console.error('getRoomHeaterIdMap (): Error finding device:', error)
      }
    }
  }

  public async getHeaterIdsByRoom (room: string): Promise<string[]> {
    await this.getRoomHeaterIdMap()
    return this.RoomHeaterIdMap
      .filter((map) => map.room === room)
      .map((map) => map.id)
  }

  public async getHeaterIds (): Promise<string[]> {
    await this.getRoomHeaterIdMap()
    return this.RoomHeaterIdMap.map((map) => map.id)
  }
}

export const DEVICE_CONTROLLER_SINGLETON = new DeviceController()
