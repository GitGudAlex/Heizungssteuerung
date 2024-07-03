import { NIGHTLY_SHUTOFF_HANDLER_SINGLETON } from './nightly-shutoff-handler'

jest.mock('../../routes/admin-settings', () => ({
  getAdminSettings: jest.fn().mockResolvedValue({
    nightlyShutoff: { off: 22, on: 4 }
  })
}))

describe('NightlyShutoffHandler', () => {
  it('should return true if the current time is between 22:00 and 04:00', async () => {
    const date1 = new Date('2024-07-01T23:00:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date1)).toBe(true)

    const date2 = new Date('2024-07-01T22:00:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date2)).toBe(true)

    const date3 = new Date('2024-07-01T03:59:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date3)).toBe(true)
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

describe('offsetHourByNumber', () => {
  test('should correctly calculate the offset hour', () => {
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.offsetHourByNumber(10, 3)).toBe(13)
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.offsetHourByNumber(0, 5)).toBe(5)
  })

  test('should wrap around if the result exceeds 24 hours', () => {
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.offsetHourByNumber(23, 2)).toBe(1)
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.offsetHourByNumber(22, 3)).toBe(1)
  })
})
