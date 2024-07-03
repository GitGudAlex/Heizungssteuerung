import { getAdminSettings } from '../../routes/admin-settings'
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
  async isNightlyShutoffActive (date: Date = new Date()): Promise<boolean> {
    const nightlyShutoffSettings = await getAdminSettings()
    if (nightlyShutoffSettings == null) {
      console.error('NightlyShutoffHandler: nightlyShutoffSettings is missing in the AdminSettings, ignoring nightly shutoff')
      return false
    }
    const offHour = nightlyShutoffSettings.nightlyShutoff.off
    const onHour = nightlyShutoffSettings.nightlyShutoff.on
    if (!offHour || !onHour) {
      console.error('NightlyShutoffHandler: nightlyShutoff hours are missing in the AdminSettings, ignoring nightly shutoff')
      return false
    }
    if (typeof offHour !== 'number' || typeof onHour !== 'number') {
      console.error('NightlyShutoffHandler: nightlyShutoff hours are not numbers, ignoring nightly shutoff')
      return false
    }
    if (offHour < onHour) {
      console.error('NightlyShutoffHandler: Invalid nightly shutoff hours, off hour is greater than on hour, ignoring nightly shutoff')
      return false
    }
    if (offHour < 0 || offHour >= 23 || onHour < 0 || onHour >= 23) {
      console.error(`NightlyShutoffHandler: Invalid nightly shutoff hours: Off-${offHour}, On-${onHour}, ignoring nightly shutoff`)
      return false
    }
    const hour = date.getHours()
    // We need to offset the hours: 24:00 - 05:59 Local time is 22:00 - 03:59 UTC
    const offsetOffHour = this.offsetHourByNumber(offHour, 2)
    const offsetOnHour = this.offsetHourByNumber(onHour, 2)
    return hour >= offsetOffHour || hour <= offsetOnHour
  }

  /**
   * Sets all heaters to the default temperature.
   * @param defaultTemp defaultTemp to set the heaters to
   */
  async setHeatersToDefaultTemp (defaultTemp: number): Promise<void> {
    if (defaultTemp < 8 || defaultTemp > 28) {
      console.error('NightlyShutoffHandler: Invalid default temperature:', defaultTemp)
      return
    }
    const heaterIds = await DEVICE_CONTROLLER_SINGLETON.getHeaterIds()
    const uniqueHeaterIds = new Set(heaterIds)
    for (const heaterId of uniqueHeaterIds) {
      await FRITZ_SINGLETON.setTempTarget(heaterId, defaultTemp)
    }
  }

  /**
   * Offsets the hour by a number. Makes sure the result is between 0 and 23.
   * @param hours hour to offset
   * @param offset hours to offset by
   * @returns the offset hour
   */
  offsetHourByNumber (hours: number, offset: number): number {
    return (hours + offset) % 24
  }
}

export const NIGHTLY_SHUTOFF_HANDLER_SINGLETON = new NightlyShutoffHandler()
