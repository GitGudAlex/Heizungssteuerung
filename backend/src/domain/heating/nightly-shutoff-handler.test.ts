import { NIGHTLY_SHUTOFF_HANDLER_SINGLETON } from './nightly-shutoff-handler'

jest.mock('../../routes/admin-settings', () => ({
  getAdminSettings: jest.fn().mockResolvedValue({
    nightlyShutoff: { off: 22, on: 4 }
  })
}))

describe('NightlyShutoffHandler', () => {
  it('should return true if the current time is between 22:00 and 04:00', async () => {
    const date1 = new Date('2024-07-01T18:00:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date1)).toBe(true)

    const date2 = new Date('2024-07-01T04:00:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date2)).toBe(true)

    const date3 = new Date('2024-07-01T21:59:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date3)).toBe(true)
  })

  it('should return false if the current time is outside 22:00 and 04:00', async () => {
    const date1 = new Date('2024-07-01T23:00:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date1)).toBe(false)

    const date2 = new Date('2024-07-01T22:01:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date2)).toBe(false)

    const date3 = new Date('2024-07-01T03:59:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date3)).toBe(false)

    const date4 = new Date('2024-07-01T02:035:00Z')
    expect(await NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isNightlyShutoffActive(date4)).toBe(false)
  })
})

describe('isHourBetweenOnAndOff', () => {
  it('should return true if the hour is between On and Off Hour', () => {
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isHourBetweenOnAndOff(10, 4, 22)).toBe(true)
  })

  it('should return false if the hour is not between On and Off Hour', () => {
    expect(NIGHTLY_SHUTOFF_HANDLER_SINGLETON.isHourBetweenOnAndOff(10, 11, 4)).toBe(false)
  })
})
