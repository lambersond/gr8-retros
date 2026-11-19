import {
  clearFreshConnectionReload,
  reloadWithFreshConnection,
  saveRecoveryKey,
  takeRecoveryKey,
} from './recovery'

describe('providers/ably/recovery', () => {
  beforeEach(() => {
    sessionStorage.clear()
    // jsdom doesn't implement navigation; it logs instead of reloading.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('hands a saved recovery key to the next page load only once', () => {
    saveRecoveryKey('key-1')

    expect(takeRecoveryKey()).toBe('key-1')
    expect(takeRecoveryKey()).toBeUndefined()
  })

  it('discards the saved key and skips saving on the reload unload', () => {
    saveRecoveryKey('stale-identity-key')

    expect(reloadWithFreshConnection()).toBe(true)
    saveRecoveryKey('stale-identity-key')

    expect(takeRecoveryKey()).toBeUndefined()

    saveRecoveryKey('later-key')
    expect(takeRecoveryKey()).toBe('later-key')
  })

  it('reloads only once per tab until the identity is confirmed', () => {
    expect(reloadWithFreshConnection()).toBe(true)
    expect(reloadWithFreshConnection()).toBe(false)

    clearFreshConnectionReload()

    expect(reloadWithFreshConnection()).toBe(true)
  })
})
