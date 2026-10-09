import '@testing-library/jest-dom'
import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'jest-mock-extended'

// create one shared deep‐mock for all tests
export const prismaMock = mockDeep<PrismaClient>()
export const diceRollMock = jest.fn()

// jest will replace any import of { PrismaClient } with this mock. Everything
// else (the generated enums like BoardRole / PaymentTier that src/enums.ts
// re-exports, and the Prisma namespace) stays the real generated value.
// Loading the generated client module does not open a connection; that only
// happens on a query through a real PrismaClient instance, which is mocked.
jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    __esModule: true,
    PrismaClient: jest.fn(() => prismaMock),
  }
})

// Mock 3D Dice Box
jest.mock('@/hooks/dice', () => {
  return {
    useDice: () => ({
      roll: diceRollMock,
    }),
  }
})

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// jsdom doesn't implement matchMedia (next-themes' system theme reads it).
// Reports no media query as matching; override per test for other cases.
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: undefined,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

globalThis.fetch = jest.fn()
/**
 * A simple mockFetch function that returns a Promise<Response>.
 * @param status The status code of the response
 * @param responseData The data that is passed in response
 * @returns void
 */
export function mockFetch({ status = 200, responseData = {} } = {}) {
  globalThis.fetch = jest.fn(() => {
    return Promise.resolve({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(responseData),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => {},
      // eslint-disable-next-line unicorn/no-null
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(responseData),
    } as Response)
  })
}

export function mockManyFetch(
  responses: Array<{ status?: number; responseData?: any }> = [
    { status: 200, responseData: {} },
  ],
) {
  const fetchMock = jest.fn<Promise<Response>, [RequestInfo, RequestInit?]>()

  // for each config, queue up one mock response
  for (const { status = 200, responseData = {} } of responses) {
    const res: Partial<Response> = {
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(responseData),
      text: () =>
        typeof responseData === 'string'
          ? Promise.resolve(responseData)
          : Promise.resolve(JSON.stringify(responseData)),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => ({}) as Response,
      body: undefined,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
    }
    fetchMock.mockResolvedValueOnce(res as Response)
  }

  globalThis.fetch = fetchMock as any
  return fetchMock
}
