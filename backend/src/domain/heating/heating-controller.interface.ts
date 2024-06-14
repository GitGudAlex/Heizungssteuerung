import { type HeatingOrder } from './heating-order'

export interface IHeatingController {

  /**
   * Starts the heating controller.
   */
  startSync: () => Promise<void>

  /**
   * Adds a heating order to the heating controller.
   * @param heatingOrder The heating order to be added.
   * @returns A promise that resolves when the heating order has been added.
   */
  addHeatingOrder: (heatingOrder: HeatingOrder) => Promise<void>

  /**
   * In case the heater is manually set to a certain temperature, this function is called.
   * This avoids that the heater is turned off by the heating controller.
   * It will add a due date to the heating order, so the heater will be automated again on the next day.
   * @param heaterId
   * @returns
   */
  addManuallySetHeater: (heaterId: string) => void

  /**
   * Returns the list of heating orders.
   * @returns The list of heating orders.
   */
  heatingOrders: HeatingOrder[]
}
