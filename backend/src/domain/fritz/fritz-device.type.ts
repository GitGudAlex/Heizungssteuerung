export interface FritzDeviceList {
  version: string
  fwversion: string
  device: FritzDevice[]
}

export interface FritzDevice {
  identifier: string
  id: string
  functionbitmask: string
  fwversion: string
  manufacturer: string
  productname: string
  present: string
  txbusy: string
  name: string
  switch?: Switch
  simpleonoff?: SimpleOnOff
  powermeter?: PowerMeter
  temperature: Temperature
  battery?: string
  batterylow?: string
  hkr?: Hkr
  levelcontrol?: LevelControl
  colorcontrol?: ColorControl
  etsiunitinfo?: EtsiUnitInfo
}

interface Switch {
  state: string
  mode: string
  lock: string
  devicelock: string
}

interface SimpleOnOff {
  state: string
}

interface PowerMeter {
  voltage: string
  power: string
  energy: string
}

interface Temperature {
  celsius: string
  offset: string
}

interface Hkr {
  tist: string
  tsoll: string
  absenk: string
  komfort: string
  lock: string
  devicelock: string
  errorcode: string
  windowopenactiv: string
  windowopenactiveendtime: string
  boostactive: string
  boostactiveendtime: string
  batterylow: string
  battery: string
  nextchange: NextChange
  summeractive: string
  holidayactive: string
  adaptiveHeatingActive: string
  adaptiveHeatingRunning: string
}

interface NextChange {
  endperiod: string
  tchange: string
}

interface LevelControl {
  level: string
  levelpercentage: string
}

interface ColorControl {
  supported_modes: string
  current_mode: string
  fullcolorsupport: string
  mapped: string
  hue: string
  saturation: string
  unmapped_hue: string
  unmapped_saturation: string
  temperature: string
}

interface EtsiUnitInfo {
  etsideviceid: string
  unittype: string
  interfaces: string
}
