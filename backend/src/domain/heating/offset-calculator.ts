import { getAdminSettings } from '../../routes/admin-settings'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { FRITZ_SINGLETON } from '../fritz/fritz'

export class OffsetCalculator {
  readonly deviceController = DEVICE_CONTROLLER_SINGLETON
  readonly fritzController = FRITZ_SINGLETON
  readonly defaultTemp = 16 // Is used as room temperature if it is not available via the FritzBox

  /**
   * @returnsthe date when the preheating should start to reach the @param targetTemperature at the @param room.
   * @param startDate The date when the temperature should be reached.
   * @param room The room where the temperature should be reached.
   * @param targetTemperature The temperature that should be reached.
   */
  async calculatePreheatingOffset (startDate: Date, room: string, targetTemperature: number): Promise<Date> {
    const roomTemperature = await this.getCurrentAverageRoomTemperature(room)
    const offsetTemperature = targetTemperature - roomTemperature
    if (offsetTemperature <= 0) {
      console.log('OffsetCalculator: calculatePreheatingOffset(): No preheating needed, target temperature already reached')
      return startDate
    }
    let preheatingMinutesPerDegree = 5
    try {
      const adminSettings = await getAdminSettings()
      preheatingMinutesPerDegree = adminSettings.preheatingMinutesPerDegree
    } catch (error) {
      console.error('OffsetCalculator: calculatePreheatingOffset(): Error getting admin settings:', error)
    }
    const offsetMinutes = offsetTemperature * preheatingMinutesPerDegree
    const offsetDate = this.offsetDateEarlierInMinutes(startDate, offsetMinutes)
    console.log(`OffsetCalculator: calculatePreheatingOffset(): Preheating needed, offsetting date by ${offsetMinutes} minutes`)
    return offsetDate
  }

  /**
   * @returns the current average room temperature of all heaters in the @param room.
   */
  async getCurrentAverageRoomTemperature (room: string): Promise<number> {
    try {
      const heaterIds = await this.deviceController.getHeaterIdsByRoom(room)
      const temperatures = []
      for (const heaterId of heaterIds) {
        const temperature = await this.fritzController.getTemperature(heaterId)
        if (temperature !== undefined) {
          temperatures.push(temperature)
        }
      }
      if (temperatures.length === 0) {
        console.warn(`OffsetCalculator: getAverageRoomTemperature(): No temperatures found for room ${room}, returning default temperature ${this.defaultTemp}`)
        return this.defaultTemp
      }
      // Calculate the average temperature
      let sum = 0
      let count = 0
      for (const temperature of temperatures) {
        if (temperature !== undefined) {
          sum += temperature
          count++
        }
      }
      return sum / count
    } catch (error) {
      console.error('OffsetCalculator: getAverageRoomTemperature(): Error getting temperatures:', error)
      return this.defaultTemp
    }
  }

  /**
   * Offsets @param date to be @param minutes earlier.
   */
  offsetDateEarlierInMinutes (date: Date, minutes: number): Date {
    return new Date(date.getTime() - minutes * 60000)
  }
}

export const OFFSET_CALCULATOR_SINGLETON = new OffsetCalculator()
