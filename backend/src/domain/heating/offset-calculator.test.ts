// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getAdminSettings } from '../../routes/admin-settings'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { FRITZ_SINGLETON } from '../fritz/fritz'
import { OFFSET_CALCULATOR_SINGLETON, OffsetCalculator } from './offset-calculator'

jest.mock('../../routes/admin-settings', () => ({
  getAdminSettings: jest.fn().mockResolvedValue({ preheatingMinutesPerDegree: 10 })
}))

jest.mock('../devices/device', () => ({
  DEVICE_CONTROLLER_SINGLETON: {
    getHeaterIdsByRoom: jest.fn()
  }
}))

jest.mock('../fritz/fritz', () => ({
  FRITZ_SINGLETON: {
    getTemperature: jest.fn()
  }
}))

describe('OffsetCalculator - calculatePreheatingOffset', () => {
  let calculator: OffsetCalculator

  beforeEach(() => {
    calculator = new OffsetCalculator()
    jest.clearAllMocks()
  })

  it('should calculate the correct preheating offset based on admin settings', async () => {
    const startDate = new Date()
    const room = 'living room'
    const targetTemperature = 22

    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue(['heater1'])
    FRITZ_SINGLETON.getTemperature = jest.fn().mockResolvedValue(18)

    const expectedOffsetDate = new Date(startDate.getTime() - (4 * 10 * 60000)) // 4 degrees difference, 10 minutes per degree
    const result = await calculator.calculatePreheatingOffset(startDate, room, targetTemperature)

    expect(result).toEqual(expectedOffsetDate)
  })

  it('should calculate the correct preheating offset based on admin settings for another temp', async () => {
    const startDate = new Date()
    const room = 'living room'
    const targetTemperature = 28

    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue(['heater1'])
    FRITZ_SINGLETON.getTemperature = jest.fn().mockResolvedValue(18)

    const expectedOffsetDate = new Date(startDate.getTime() - (10 * 10 * 60000)) // 4 degrees difference, 10 minutes per degree
    const result = await calculator.calculatePreheatingOffset(startDate, room, targetTemperature)

    expect(result).toEqual(expectedOffsetDate)
  })
})

describe('OffsetCalculator - offsetDateEarlierInMinutes', () => {
  it('should return a date offset by the specified number of minutes', () => {
    const baseDate = new Date('2020-01-01T12:00:00Z')
    const minutes = 60
    const expectedDate = new Date('2020-01-01T11:00:00Z')
    const result = OFFSET_CALCULATOR_SINGLETON.offsetDateEarlierInMinutes(baseDate, minutes)
    expect(result).toEqual(expectedDate)
  })
})

describe('OffsetCalculator - getCurrentAverageRoomTemperature', () => {
  it('should return the average temperature of all heaters in a room', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue(['heater1', 'heater2'])
    FRITZ_SINGLETON.getTemperature = jest.fn().mockResolvedValueOnce(19).mockResolvedValueOnce(21)

    const temperature = await OFFSET_CALCULATOR_SINGLETON.getCurrentAverageRoomTemperature('kitchen')
    expect(temperature).toEqual(20)
  })

  it('should return the default temperature if no heaters found', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue([])
    const temperature = await OFFSET_CALCULATOR_SINGLETON.getCurrentAverageRoomTemperature('bathroom')
    expect(temperature).toEqual(16)
  })
})
