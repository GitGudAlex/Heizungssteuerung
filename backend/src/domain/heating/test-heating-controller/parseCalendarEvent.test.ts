// Imports
import { HeatingController } from '../heating-controller'
import { User } from '../../../model/user'
import { HeatingOrder } from '../heating-order'
import { type CalendarComponent } from 'ical'
import { EXISTING_ROOMS } from '../../devices/rooms-heaters-map'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { OFFSET_CALCULATOR_SINGLETON } from '../offset-calculator'

// Mocks
jest.mock('../../../model/user', () => ({
  User: { findOne: jest.fn() }
}))

jest.mock('../offset-calculator', () => ({
  // remove offset calculation
  OFFSET_CALCULATOR_SINGLETON: { calculatePreheatingOffset: jest.fn().mockImplementation((date: Date) => date) }
}))

describe('HeatingController - parseCalendarEvent', () => {
  let heatingController: HeatingController
  const validEvent: CalendarComponent = {
    summary: 'Event @Building1',
    start: new Date(),
    end: new Date(new Date().getTime() + 3600 * 1000), // 1 hour later
    type: 'VEVENT'
  } as unknown as CalendarComponent

  beforeEach(() => {
    // Create a new instance of HeatingController before each test
    heatingController = new HeatingController()
    heatingController.buildingOfInterest = 'Building1'
    jest.clearAllMocks()
  })

  test('should return undefined if the event has no summary', async () => {
    const event = { ...validEvent, summary: undefined }
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)
    expect(result).toBeUndefined()
  })

  test('should return undefined if the event summary does not include a username or building', async () => {
    const event = { ...validEvent, summary: 'Event' }
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)
    expect(result).toBeUndefined()
  })

  test('should return undefined if the event summary includes the wrong building', async () => {
    const event = { ...validEvent, summary: 'Event @Building2' }
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)
    expect(result).toBeUndefined()
  })

  test('should return undefined if user is not found in database', async () => {
    const event = { ...validEvent, summary: 'Event @Building1' };
    (User.findOne as jest.Mock).mockResolvedValueOnce(undefined)
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)
    expect(result).toBeUndefined()
  })

  test('should return undefined if event does not have start or end time', async () => {
    const event = { ...validEvent, start: undefined, end: undefined }
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)
    expect(result).toBeUndefined()
  })

  test('should create a HeatingOrder if all parameters are valid', async () => {
    const userDb = { username: 'user1', room: EXISTING_ROOMS[0], temperature: 22 };
    (User.findOne as jest.Mock).mockResolvedValueOnce(userDb)
    const event = { ...validEvent, summary: 'user1@Building1' }
    const result = await heatingController.parseCalendarEvent(event as CalendarComponent)

    expect(result).toBeInstanceOf(HeatingOrder)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/unbound-method
    expect(result?.getParameters()).toEqual(new HeatingOrder(EXISTING_ROOMS[0], 22, event.start!, event.end!, 'user1').getParameters())
  })
})
