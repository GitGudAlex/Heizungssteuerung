export interface IDeviceController {
  /**
     * Retrieves the heater IDs associated with a specific room.
     * @param room The room for which to retrieve the heater IDs.
     * @returns A promise that resolves with an array of heater IDs.
     */
  getHeaterIdsByRoom: (room: string) => Promise<string[]>

  /**
     * Retrieves all heater IDs.
     * @returns A promise that resolves with an array of all heater IDs.
     */
  getHeaterIds: () => Promise<string[]>
}
