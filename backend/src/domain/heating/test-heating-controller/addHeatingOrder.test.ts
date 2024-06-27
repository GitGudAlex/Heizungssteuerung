import { EXISTING_ROOMS } from '../../devices/rooms-heaters-map'
import { HeatingController } from '../heating-controller'
import { HeatingOrder } from '../heating-order'

describe('HeatingController - addHeatingOrder', () => {
  let heatingController: HeatingController
  beforeEach(() => {
    heatingController = new HeatingController()
    jest.clearAllMocks()
  })

  test('should add a new heating order', () => {
    const heatingOrder = new HeatingOrder(EXISTING_ROOMS[0], 22, new Date(), new Date(Date.now() + 3600000), 'user1')
    heatingController.addHeatingOrder(heatingOrder)
    expect(heatingController.heatingOrders).toContain(heatingOrder)
  })

  test('should replace an existing order with the same user', () => {
    const startTime = new Date()
    const endTime = new Date(Date.now() + 3600000)
    const heatingOrder1 = new HeatingOrder(EXISTING_ROOMS[0], 22, startTime, endTime, 'user1')
    const heatingOrder2 = new HeatingOrder(EXISTING_ROOMS[0], 24, startTime, endTime, 'user1')

    heatingController.addHeatingOrder(heatingOrder1)
    heatingController.addHeatingOrder(heatingOrder2)

    expect(heatingController.heatingOrders.length).toBe(1)
    expect(heatingController.heatingOrders[0]).toBe(heatingOrder2)
  })

  test('should not replace an order for a different user', () => {
    const heatingOrder1 = new HeatingOrder(EXISTING_ROOMS[0], 22, new Date(), new Date(Date.now() + 3600000), 'user1')
    const heatingOrder2 = new HeatingOrder(EXISTING_ROOMS[1], 24, new Date(), new Date(Date.now() + 7200000), 'user2')

    heatingController.addHeatingOrder(heatingOrder1)
    heatingController.addHeatingOrder(heatingOrder2)

    expect(heatingController.heatingOrders.length).toBe(2)
    expect(heatingController.heatingOrders).toContain(heatingOrder1)
    expect(heatingController.heatingOrders).toContain(heatingOrder2)
  })

  test('should allow adding multiple orders for different users', () => {
    const heatingOrder1 = new HeatingOrder(EXISTING_ROOMS[0], 22, new Date(), new Date(Date.now() + 3600000), 'user1')
    const heatingOrder2 = new HeatingOrder(EXISTING_ROOMS[1], 24, new Date(), new Date(Date.now() + 7200000), 'user2')
    const heatingOrder3 = new HeatingOrder(EXISTING_ROOMS[0], 20, new Date(), new Date(Date.now() + 10800000), 'user3')

    heatingController.addHeatingOrder(heatingOrder1)
    heatingController.addHeatingOrder(heatingOrder2)
    heatingController.addHeatingOrder(heatingOrder3)

    expect(heatingController.heatingOrders.length).toBe(3)
    expect(heatingController.heatingOrders).toContain(heatingOrder1)
    expect(heatingController.heatingOrders).toContain(heatingOrder2)
    expect(heatingController.heatingOrders).toContain(heatingOrder3)
  })
})
