import { HeatingOrder } from '../heating-order'
import { HeatingController } from '../heating-controller'
import { User } from '../../../model/user'
import { FRITZ_SINGLETON } from '../../fritz/fritz'
import { DEVICE_CONTROLLER_SINGLETON } from '../../devices/device'
import { CALENDAR_SINGLETON } from '../../calendar/calendar'
import { type CalendarComponent } from 'ical'
import { EXISTING_ROOMS } from '../../devices/rooms-heaters-map'

jest.mock('../../../routes/admin-settings')
jest.mock('../../calendar/calendar')
jest.mock('../../devices/device')
jest.mock('../../fritz/fritz')
jest.mock('../../../model/user')

describe('HeatingController', () => {
  let heatingController: HeatingController

  beforeEach(() => {
    heatingController = new HeatingController()
    jest.clearAllMocks()
  })

  test('should initialize with default values', () => {
    expect(heatingController.defaultTemp).toBe(16)
    expect(heatingController.buildingOfInterest).toBe('n5')
  })

  test('should add manually set heater correctly', () => {
    const heaterId = 'heater1'
    heatingController.addManuallySetHeater(heaterId)
    const manuallySetHeater = heatingController.manuallySetHeaters.find(
      (heater) => heater.heaterId === heaterId
    )
    expect(manuallySetHeater).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(manuallySetHeater!.dueDate).toBeDefined()
  })

  test('should check if heater is manually set correctly', () => {
    const heaterId = 'heater1'
    heatingController.addManuallySetHeater(heaterId)
    expect(heatingController.IsHeaterManuallySet(heaterId)).toBe(true)

    // Simulate due date passed
    heatingController.manuallySetHeaters[0].dueDate = new Date(
      Date.now() - 1000
    )
    expect(heatingController.IsHeaterManuallySet(heaterId)).toBe(false)
  })

  test('should add heating order correctly', () => {
    const heatingOrder = new HeatingOrder(
      EXISTING_ROOMS[0],
      22,
      new Date(),
      new Date(Date.now() + 3600000),
      'user1'
    )
    heatingController.addHeatingOrder(heatingOrder)
    expect(heatingController.heatingOrders).toContain(heatingOrder)
  })

  test('should set heaters according to heating orders', async () => {
    DEVICE_CONTROLLER_SINGLETON.getRooms = jest
      .fn()
      .mockResolvedValue(EXISTING_ROOMS)
    DEVICE_CONTROLLER_SINGLETON.getHeaterIdsByRoom = jest
      .fn()
      .mockResolvedValue(['heater1'])
    FRITZ_SINGLETON.setTempTarget = jest.fn().mockResolvedValue(22)

    const heatingOrder = new HeatingOrder(
      EXISTING_ROOMS[0],
      22,
      new Date(Date.now() - 1000),
      new Date(Date.now() + 3600000),
      'user1'
    )
    heatingController.addHeatingOrder(heatingOrder)

    await heatingController.setHeatersAccordingToHeatingOrders()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledTimes(
      EXISTING_ROOMS.length
    )
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(FRITZ_SINGLETON.setTempTarget).toHaveBeenCalledWith('heater1', 22)
  })

  test('should sync calendar heating orders', async () => {
    const mockEvent = {
      type: 'VEVENT',
      summary: 'fd040@n5',
      start: new Date(Date.now() + 1000),
      end: new Date(Date.now() + 3600000)
    }
    CALENDAR_SINGLETON.getTodaysEvents = jest
      .fn()
      .mockResolvedValue([mockEvent])
    User.findOne = jest.fn().mockResolvedValue({
      username: 'fd040',
      room: EXISTING_ROOMS[0],
      temperature: 22
    })

    await heatingController.syncCalendarHeatingOrders()
    expect(heatingController.heatingOrders.length).toBe(1)
  })

  test('should parse calendar event correctly', async () => {
    const mockEvent = {
      summary: 'fd040@n5',
      start: new Date(),
      end: new Date(Date.now() + 3600000)
    }
    User.findOne = jest.fn().mockResolvedValue({
      username: 'fd040',
      room: EXISTING_ROOMS[0],
      temperature: 22
    })

    const heatingOrder = await heatingController.parseCalendarEvent(
      mockEvent as unknown as CalendarComponent
    )
    expect(heatingOrder).toBeDefined()
    const heatingOrderParameters = heatingOrder?.getParameters()
    expect(heatingOrderParameters?.room).toBe(EXISTING_ROOMS[0])
    expect(heatingOrderParameters?.temperature).toBe(22)
  })

  test('should handle invalid calendar event gracefully', async () => {
    const invalidEvent = { summary: 'invalid' }
    const heatingOrder = await heatingController.parseCalendarEvent(
      invalidEvent as unknown as CalendarComponent
    )
    expect(heatingOrder).toBeUndefined()
  })
})
