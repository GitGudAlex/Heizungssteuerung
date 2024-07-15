import { Fritz } from 'fritzdect-aha-nodejs'
import { XmlParser } from './xml-parser'
import { type FritzDeviceList } from './fritz-device.type'
import dotenv from 'dotenv'
import { HeatingLog, type HeatingLogDocument } from '../../model/heatingLog'
dotenv.config()

class FritzController {
  public readonly fritz: Fritz
  private readonly xmlParser = new XmlParser()
  private readonly _log: any = console.log

  constructor () {
    const fritzUsername = process.env.FRITZ_USERNAME
    if (fritzUsername == null) {
      throw new Error('FRITZ_USERNAME is not set')
    }
    const fritzPassword = process.env.FRITZ_PASSWORD
    if (fritzPassword == null) {
      throw new Error('FRITZ_PASSWORD is not set')
    }
    const fritzIp = process.env.FRITZ_ADDRESS
    if (fritzIp == null) {
      throw new Error('FRITZ_ADDRESS is not set')
    }
    // this is the fallback IP address of the FritzBox
    this.fritz = new Fritz(fritzUsername, fritzPassword, fritzIp)
  }

  /**
   * Gets the device list infos.
   */
  public async getDeviceListInfos (): Promise<FritzDeviceList | undefined> {
    try {
      const xml = await this.fritz.getDeviceListInfos()
      const json = await this.xmlParser.parseXmlToJson(xml)
      return json.devicelist
    } catch (error) {
      console.error('FritzController: Error getting device list infos:', error)
      return undefined
    }
  }

  /**
   * Gets basic device stats.
   * @param identifier The identifier of the device. (e.g "09995 0688917")
   */
  public async getBasicDeviceStats (identifier: string): Promise<any> {
    let returnValue
    this.disableConsoleLog()
    try {
      const xml = await this.fritz.getBasicDeviceStats(identifier)
      if (xml == null) {
        console.error('FritzController: Getting basic device stats are empty.')
      }
      returnValue = await this.xmlParser.parseXmlToJson(xml)
    } catch (error) {
      console.error(
        'FritzController: Error getting basic device stats:',
        error
      )
    }
    this.enableConsoleLog()
    return returnValue
  }

  /**
   * Sets the temperature target for a device.
   * @param identifier The identifier of the device. (e.g "09995 0688917")
   * @param temp
   *      Temperature value as numbers in 1 °C, range: 8 to 28°C
   *      Or the strings "on" & "off"
   */
  public async setTempTarget (
    identifier: string,
    temp: number | 'on' | 'off'
  ): Promise<number | undefined> {
    try {
      console.debug(`Setting temperature target of ${identifier} to ${temp}`)
      const stats = await this.getBasicDeviceStats(identifier)
      if (stats == null) {
        console.error('FritzController: Could not verify connection to FritzBox, setting temperature target failed.')
        return undefined
      }
      const tempTarget = await this.fritz.setTempTarget(identifier, temp)
      // Write log
      const log: HeatingLogDocument = new HeatingLog({
        heater: identifier,
        temperature: temp,
        deviceStats: stats,
        timestamp: new Date()
      })
      await log.save()
      return tempTarget
    } catch (error: any) {
      console.error(
        'FritzController: Error setting temperature target:',
        error
      )
      return undefined
    }
  }

  /**
   *
   * @param identifier The identifier of the device. (e.g "09995 0688917")
   * @returns The current temperature target of a device.
   *    Temperature value in 0.5 °C, value range:
   *    16 – 56
   *    8 to 28°C, 16 <= 8°C, 17 = 8.5°C...... 56 >= 28°C
   *    254 = ON, 253 = OFF
   */
  public async getTempTarget (identifier: string): Promise<number | undefined> {
    try {
      const stats = await this.getBasicDeviceStats(identifier)
      if (stats == null) {
        console.error('FritzController: Could not verify connection to FritzBox, getting temperature target failed.')
        return undefined
      }
      return Number(await this.fritz.getHkrTsoll(identifier))
    } catch (error) {
      console.error(
        'FritzController: Error getting temperature target:',
        error
      )
      return undefined
    }
  }

  /**
   * Gets the last temperature information of a device.
   * @param identifier The identifier of the device. (e.g "09995 0688917")
   * @returns The last temperature information of a device, in 0,1 °C steps (e.g. 200 is 20°C).
   */
  public async getTemperature (identifier: string): Promise<number | undefined> {
    try {
      const stats = await this.getBasicDeviceStats(identifier)
      if (stats == null) {
        console.error('FritzController: Could not verify connection to FritzBox, getting temperature failed.')
        return undefined
      }
      return Number(await this.fritz.getTemperature(identifier))
    } catch (error) {
      console.error('FritzController: Error getting temperature:', error)
      return undefined
    }
  }

  private disableConsoleLog (): void {
    console.log = function () {} // Override console.log with an empty function
  }

  private enableConsoleLog (): void {
    console.log = this._log // Restore the original console.log
  }
}

export const FRITZ_SINGLETON = new FritzController()
