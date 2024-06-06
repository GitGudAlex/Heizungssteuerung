import { type HeatingOrder } from './heating-order'

export interface IHeatingController {
/**
 * Adds a heating order to the heating controller.
 * @param heatingOrder The heating order to be added.
 * @returns A promise that resolves when the heating order has been added.
 */
  addHeatingOrder: (heatingOrder: HeatingOrder) => Promise<void>
}
