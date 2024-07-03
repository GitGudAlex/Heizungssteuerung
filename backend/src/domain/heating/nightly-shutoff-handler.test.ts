import { NIGHTLY_SHUTOFF_HANDLER_SINGLETON } from './nightly-shutoff-handler'

describe('NightlyShutoffHandler', () => {
  it('should return true if the current time is between 22:00 and 04:00', () => {
    const date1 = new Date('2024-07-01T23:00:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date1)).toBe(true)

    const date2 = new Date('2024-07-01T22:00:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date2)).toBe(true)

    const date3 = new Date('2024-07-01T03:59:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date3)).toBe(true)
  })

  it('should return false if the current time is outside 22:00 and 04:00', () => {
    const date1 = new Date('2024-07-01T12:00:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date1)).toBe(false)

    const date2 = new Date('2024-07-01T21:59:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date2)).toBe(false)

    const date3 = new Date('2024-07-01T04:00:00Z')
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date3)).toBe(false)
  })
})
