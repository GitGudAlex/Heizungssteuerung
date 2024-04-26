declare module 'fritzdect-aha-nodejs' {
  /**
   * Represents a Fritz!Box device.
   * @param username The username to authenticate with.
   * @param password The password to authenticate with.
   * @param uri The URI of the Fritz!Box.
   * @param debug Whether to enable debug mode.
   * @param options Additional options.
   */
  export class Fritz {
    constructor (username: string, password: string, uri?: string, debug?: boolean, options?: any)
    /**
     * @returns The device list infos as XML.
     */
    getDeviceListInfos (): Promise<string>
    /**
     * @returns Gets basic device stats as XML.
     * @param ain The AIN of the device. (e.g "09995 0688917")
     */
    getBasicDeviceStats (ain: string): Promise<string>
    /**
     * Sets the temperature target for a device.
     * @param ain The AIN of the device. (e.g "09995 0688917")
     * @param temp The temperature to set.
     *    Temperature value in 0.5 °C, range:
     *    16 – 56
     *    8 to 28°C, 16 <= 8°C, 17 = 8.5°C...... 56 >= 28°C
     *    254 = ON, 253 = OFF
     * @returns The response is the temperate setting as number.
    */
    setTempTarget (ain: string, temp: number): Promise<number>
    /**
     * Gets the last temperature information of a device.
     * @param ain The AIN of the device. (e.g "09995 0688917")
     */
    getTemperature (ain: string): Promise<number>
    /**
     * Gets the current temperature target of a device.
     * @param ain The AIN of the device. (e.g "09995 0688917")
     */
    getHkrTsoll (ain: string): Promise<number>
  }

  /**
   * Used to create a Fitzbox mock server.
   * @param username The username to authenticate with.
   */
  export class FritzEmulator {
    constructor (
      port: number,
      debugmode: boolean,
      xmlDevGroups: any,
      xmlTemplates: any,
      xmlTrigger: any,
      xmlColors: any,
      xmlTempStats: any,
      xmlPowerStats: any,
      guestWlan: any,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      hkr_batt: any
    )
    getDeviceListInfos (): Promise<any>
  }
}
