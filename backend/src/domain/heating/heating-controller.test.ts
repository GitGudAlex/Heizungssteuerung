import cron from 'node-cron'
import { DEVICE_CONTROLLER_SINGLETON } from '../devices/device'
import { HeatingController } from './heating-controller'
import { type HeatingOrder } from './heating-order'

jest.mock('node-cron')
jest.mock('./heating-order')
jest.mock('../../model/user')
jest.mock('../fritz/fritz')
jest.mock('../devices/device')

describe('HeatingController', () => {
  let heatingController: HeatingController
  let mockDeviceController: any
  let mockHeatingOrder: any

  beforeEach(() => {
    cron.schedule = jest.fn().mockImplementation((cronTime, task) => {
      console.log('Cron job scheduled')
    })

    mockDeviceController = {
      getRooms: jest.fn(),
      getHeaterIdsByRoom: jest.fn()
    }
    DEVICE_CONTROLLER_SINGLETON.getRooms = mockDeviceController.getRooms
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom =
      mockDeviceController.getHeaterIdsByRoom

    heatingController = new HeatingController()

    mockHeatingOrder = {
      getParameters: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addHeatingOrder', () => {
    it('should add a new heating order if not already in the list', () => {
      mockHeatingOrder.getParameters = jest.fn().mockReturnValue({
        id: 1,
        room: 'room1',
        temperature: 22
      })

      heatingController.addHeatingOrder(mockHeatingOrder as HeatingOrder)

      expect(heatingController.heatingOrders).toContain(mockHeatingOrder)
    })

    it('should not add a duplicate heating order', () => {
      mockHeatingOrder.getParameters.mockReturnValue({
        id: 1,
        room: 'room1',
        temperature: 22
      })

      heatingController.addHeatingOrder(mockHeatingOrder as HeatingOrder)
      heatingController.addHeatingOrder(mockHeatingOrder as HeatingOrder)

      expect(heatingController.heatingOrders.length).toBe(1)
    })
  })

  describe('setHeatersAccordingToHeatingOrders', () => {
    it('should set heaters to default temperature if no heating orders', async () => {
      mockDeviceController.getRooms.mockResolvedValue(['room1'])
      mockDeviceController.getHeaterIdsByRoom.mockResolvedValue(['heater1'])

      await heatingController.setHeatersAccordingToHeatingOrders([])

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        heatingController.fritzController.setTempTarget
      ).toHaveBeenCalledWith('heater1', 20)
    })

    it('should set heaters to average temperature of manual heating orders', async () => {
      const manualOrder = {
        getParameters: jest.fn().mockReturnValue({
          origin: 'manual',
          temperature: 24,
          room: 'room1',
          startDateTime: new Date(Date.now() - 1000),
          endDataTime: new Date(Date.now() + 1000)
        })
      }

      heatingController.addHeatingOrder(manualOrder as unknown as HeatingOrder)

      mockDeviceController.getRooms.mockResolvedValue(['room1'])
      mockDeviceController.getHeaterIdsByRoom.mockResolvedValue(['heater1'])

      await heatingController.setHeatersAccordingToHeatingOrders()

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        heatingController.fritzController.setTempTarget
      ).toHaveBeenCalledWith('heater1', 24)
    })

    it('should set heaters to average temperature of calendar heating orders', async () => {
      const calendarOrder = {
        getParameters: jest.fn().mockReturnValue({
          origin: 'calendar',
          temperature: 22,
          room: 'room1',
          startDateTime: new Date(Date.now() - 1000),
          endDataTime: new Date(Date.now() + 1000)
        })
      }

      heatingController.addHeatingOrder(
        calendarOrder as unknown as HeatingOrder
      )

      mockDeviceController.getRooms.mockResolvedValue(['room1'])
      mockDeviceController.getHeaterIdsByRoom.mockResolvedValue(['heater1'])

      await heatingController.setHeatersAccordingToHeatingOrders()

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        heatingController.fritzController.setTempTarget
      ).toHaveBeenCalledWith('heater1', 22)
    })

    it('should prioritize manual heating orders over calendar heating orders', async () => {
      const manualOrder = {
        getParameters: jest.fn().mockReturnValue({
          origin: 'manual',
          temperature: 24,
          room: 'room1',
          startDateTime: new Date(Date.now() - 1000),
          endDataTime: new Date(Date.now() + 1000)
        })
      }

      const calendarOrder = {
        getParameters: jest.fn().mockReturnValue({
          origin: 'calendar',
          temperature: 22,
          room: 'room1',
          startDateTime: new Date(Date.now() - 1000),
          endDataTime: new Date(Date.now() + 1000)
        })
      }

      heatingController.addHeatingOrder(manualOrder as unknown as HeatingOrder)
      heatingController.addHeatingOrder(
        calendarOrder as unknown as HeatingOrder
      )

      mockDeviceController.getRooms.mockResolvedValue(['room1'])
      mockDeviceController.getHeaterIdsByRoom.mockResolvedValue(['heater1'])

      await heatingController.setHeatersAccordingToHeatingOrders()

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        heatingController.fritzController.setTempTarget
      ).toHaveBeenCalledWith('heater1', 24)
    })

    it('should set heaters to default temperature if no relevant heating orders', async () => {
      const irrelevantOrder = {
        getParameters: jest.fn().mockReturnValue({
          origin: 'calendar',
          temperature: 22,
          room: 'room2',
          startDateTime: new Date(Date.now() - 1000),
          endDataTime: new Date(Date.now() + 1000)
        })
      }

      heatingController.addHeatingOrder(
        irrelevantOrder as unknown as HeatingOrder
      )

      mockDeviceController.getRooms.mockResolvedValue(['room1'])
      mockDeviceController.getHeaterIdsByRoom.mockResolvedValue(['heater1'])

      await heatingController.setHeatersAccordingToHeatingOrders()

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        heatingController.fritzController.setTempTarget
      ).toHaveBeenCalledWith('heater1', 20)
    })
  })
})
