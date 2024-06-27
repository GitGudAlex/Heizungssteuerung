/* eslint-disable @typescript-eslint/unbound-method */
import { HeatingOrder } from '../heating-order'
import { HeatingController } from '../heating-controller'
import { DEVICE_CONTROLLER_SINGLETON } from '../../devices/device'
import { FRITZ_SINGLETON } from '../../fritz/fritz'
import { EXISTING_ROOMS } from '../../devices/rooms-heaters-map'

jest.mock('../../../routes/admin-settings')
jest.mock('../../calendar/calendar')
jest.mock('../../devices/device')
jest.mock('../../fritz/fritz')
jest.mock('../../../model/user')

jest
  .spyOn(HeatingController.prototype, 'IsHeaterManuallySet')
  .mockImplementation()

describe('HeatingController - setHeatersOfRoom', () => {
  let heatingController: HeatingController
  const room = EXISTING_ROOMS[0]
  const now = new Date()
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000) // One hour later

  beforeEach(() => {
    heatingController = new HeatingController()
    heatingController.defaultTemp = 16 // Setting a default temperature
    jest.clearAllMocks()
  })

  test('should not set temperature if no heaters found in room', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue([])
    await heatingController.setHeatersOfRoom([], room)
    expect(FRITZ_SINGLETON.setTempTarget).not.toHaveBeenCalled()
  })

  test('should set default temperature if no heating orders are present', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue([
      'heater1',
      'heater2'
    ])
    await heatingController.setHeatersOfRoom([], room)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledTimes(2)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater1', 16)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater2', 16)
  })

  test('should not set temperature for manually set heaters', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue([
      'heater1',
      'heater2'
    ])
    HeatingController.prototype.IsHeaterManuallySet = jest.fn().mockReturnValueOnce(
      true
    ).mockReturnValueOnce(false)
    const orders = [
      new HeatingOrder(EXISTING_ROOMS[0], 22, now, oneHourLater, 'user1')
    ]
    await heatingController.setHeatersOfRoom(orders, room)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledTimes(1)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater2', 22)
  })

  test('should set average temperature of heating orders if present', async () => {
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest.fn().mockResolvedValue([
      'heater1',
      'heater2'
    ])
    HeatingController.prototype.IsHeaterManuallySet = jest.fn().mockReturnValue(false)
    const orders = [
      new HeatingOrder(EXISTING_ROOMS[0], 20, now, oneHourLater, 'user1'),
      new HeatingOrder(EXISTING_ROOMS[0], 24, now, oneHourLater, 'user2')
    ]
    await heatingController.setHeatersOfRoom(orders, room)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledTimes(2)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater1', 22)
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater2', 22)
  })
})
