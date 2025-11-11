/**
 * @jest-environment node
 */

import { GET } from './route'

describe('app/api/feature-flags', () => {
  it('should return true for isAuthEnabled', async () => {
    process.env.AUTH_GOOGLE_ENABLED = 'true'
    process.env.DATABASE_URL = 'fake-db-connection-string'

    const response = await GET()
    const data = await response.json()

    expect(data.featureFlags.isAuthEnabled).toBe(true)
    expect(data.featureFlags.isDatabaseEnabled).toBe(true)
  })

  it('should return false for isAuthEnabled', async () => {
    process.env.AUTH_GOOGLE_ENABLED = 'false'
    process.env.DATABASE_URL = ''

    const response = await GET()
    const data = await response.json()

    expect(data.featureFlags.isAuthEnabled).toBe(false)
    expect(data.featureFlags.isDatabaseEnabled).toBe(false)
  })
})
