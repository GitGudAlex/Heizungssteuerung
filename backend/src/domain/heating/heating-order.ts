import { EXISTING_ROOMS } from '../devices/rooms-heaters-map'

/**
 * Represents a instruction to set the heating to a certain temperature in a certain room at a certain time.
 * The instruction can either come from a calendar or be set manually.
 * This class is used to check the validity of the instructions.
 * @throws Error if some of the parameters are invalid.
 */
export class HeatingOrder {
  private readonly _room: string
  private readonly _temperature: number
  private readonly _startDateTime: Date
  private readonly _endDataTime: Date
  private readonly _username: string
  private readonly _origin: 'calendar' | 'manual'

  /**
   * @param room - The room where the heating order applies.
   * @param temperature - The desired temperature for the heating order.
   * @param startDateTime - The start date and time of the heating order.
   * @param endDataTime - The end date and time of the heating order.
   * @param origin - The origin of the heating order. Defaults to 'calendar'.
   * @throws Error if the origin is neither 'calendar' nor 'manual'.
   */
  constructor (
    room: string,
    temperature: number,
    startDateTime: Date,
    endDataTime: Date,
    username: string,
    origin: string = 'calendar'
  ) {
    // Check if the room is valid
    if (!EXISTING_ROOMS.includes(room)) {
      throw new Error(
        `HeatingOrder Constructor(): Room ${room} does not exist.`
      )
    }
    this._room = room

    // Check if the temperature is valid
    if (temperature < 8 || temperature > 28) {
      throw new Error(
        `HeatingOrder Constructor(): Temperature must be between 8 and 28, but was ${temperature}`
      )
    }
    this._temperature = temperature

    // Check if the start date and end date are valid
    if (startDateTime >= endDataTime) {
      throw new Error(
        'HeatingOrder Constructor(): Start date and time must be before end date and time.'
      )
    }
    this._startDateTime = startDateTime
    this._endDataTime = endDataTime

    // Check if the origin is valid
    if (origin !== 'calendar' && origin !== 'manual') {
      throw new Error(
        `HeatingOrder Constructor(): Origin must be 'calendar' or 'manual', but was ${origin}`
      )
    }
    this._origin = origin
    this._username = username
  }

  getParameters (): {
    room: string
    temperature: number
    startDateTime: Date
    endDataTime: Date
    username: string
    origin: 'calendar' | 'manual'
  } {
    return {
      room: this._room,
      temperature: this._temperature,
      startDateTime: this._startDateTime,
      endDataTime: this._endDataTime,
      username: this._username,
      origin: this._origin
    }
  }
}
