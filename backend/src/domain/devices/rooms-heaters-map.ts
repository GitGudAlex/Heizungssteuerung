export const EXISTING_HEATERS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'h7',
  'h8',
  'h9',
  'h10'
]
export const EXISTING_ROOMS = ['n001', 'n005', 'n006']

export interface RoomHeaterMap {
  heater: string
  room: string
}

export const ROOMS_HEATERS_MAP: RoomHeaterMap[] = [
  { heater: 'h1', room: 'n001' },
  { heater: 'h2', room: 'n001' },
  { heater: 'h3', room: 'n005' },
  { heater: 'h4', room: 'n005' },
  { heater: 'h5', room: 'n006' },
  { heater: 'h6', room: 'n001' },
  { heater: 'h7', room: 'n001' },
  { heater: 'h8', room: 'n001' },
  { heater: 'h9', room: 'n001' },
  { heater: 'h10', room: 'n001' }
]
