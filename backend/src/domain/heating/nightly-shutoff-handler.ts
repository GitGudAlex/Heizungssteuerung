import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { FRITZ_SINGLETON } from '../fritz/fritz'

/**
 * Will set all devices to default temp if the current time is between 22:00 and 04:00.
 */
class NightlyShutoffHandler {
  /**
   * Make sure to pass a UTC date to this function.
   * @param date a UTC date to check if the hour is between 22:00 and 03:59
   * @returns true if the current time is between 22:00 and 03:59, false otherwise
   */
  isNightlyShutoffActive (date: Date = new Date()): boolean {
    const hour = date.getHours()
    // 24:00 - 05:59 Local time is 22:00 - 03:59 UTC
    return hour >= 24 || hour <= 5
  }

  /**
   * Sets all heaters to the default temperature.
   * @param defaultTemp defaultTemp to set the heaters to
   */
  async setHeatersToDefaultTemp (defaultTemp: number): Promise<void> {
    if (defaultTemp < 8 || defaultTemp > 28) {
      console.error('setHeatersToDefaultTemp(): Invalid default temperature:', defaultTemp)
      return
    }
    const heaterIds = await DEVICE_CONTROLLER_SINGLETON.getHeaterIds()
    const uniqueHeaterIds = new Set(heaterIds)
    for (const heaterId of uniqueHeaterIds) {
      await FRITZ_SINGLETON.setTempTarget(heaterId, defaultTemp)
    }
  }
}

export const NIGHTLY_SHUTOFF_HANDLER_SINGLETON = new NightlyShutoffHandler()
