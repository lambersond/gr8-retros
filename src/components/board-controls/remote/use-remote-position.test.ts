import { act, renderHook } from '@test-utils'
import { useRemotePosition } from './use-remote-position'
import { DEFAULT_POSITION, toPositionStyle } from './utils'

const STORAGE_KEY = 'facilitator-remote:position'

type Hook = { current: ReturnType<typeof useRemotePosition> }

// A 1000x800 window with the 120px remote in its default corner (16px in from
// the bottom right): 848px of travel across and 648px down.
function attachRemote(result: Hook) {
  const remote = document.createElement('fieldset')
  remote.getBoundingClientRect = () =>
    ({ left: 864, top: 664, width: 120, height: 120 }) as DOMRect
  result.current.remoteRef.current = remote
}

function pointer(overrides: Partial<React.PointerEvent<HTMLElement>> = {}) {
  return {
    pointerId: 1,
    isPrimary: true,
    button: 0,
    clientX: 900,
    clientY: 700,
    currentTarget: { setPointerCapture: jest.fn() },
    ...overrides,
  } as unknown as React.PointerEvent<HTMLElement>
}

function key(
  name: string,
  overrides: Partial<React.KeyboardEvent<HTMLElement>> = {},
) {
  return {
    key: name,
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    preventDefault: jest.fn(),
    ...overrides,
  } as unknown as React.KeyboardEvent<HTMLElement>
}

function throwUnavailable(): never {
  throw new Error('storage disabled')
}

function setup() {
  const { result } = renderHook(() => useRemotePosition())
  attachRemote(result)
  return result
}

describe('components/board-controls/remote/use-remote-position', () => {
  beforeAll(() => {
    Object.defineProperties(document.documentElement, {
      clientWidth: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 800 },
    })
  })

  afterAll(() => {
    // Back to jsdom's own (prototype) getters.
    Reflect.deleteProperty(document.documentElement, 'clientWidth')
    Reflect.deleteProperty(document.documentElement, 'clientHeight')
  })

  beforeEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
  })

  it('should start in the default corner', () => {
    const result = setup()

    expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
    expect(result.current.isDragging).toBe(false)
  })

  it('should start where the remote was last left', () => {
    localStorage.setItem(STORAGE_KEY, '{"x":0.25,"y":0.5}')

    const result = setup()

    expect(result.current.style).toEqual(toPositionStyle({ x: 0.25, y: 0.5 }))
  })

  it('should ignore a corrupted stored position', () => {
    localStorage.setItem(STORAGE_KEY, 'not a position')

    const result = setup()

    expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
  })

  it('should follow a move made in another tab', () => {
    const result = setup()

    act(() => {
      localStorage.setItem(STORAGE_KEY, '{"x":0,"y":0}')
      globalThis.dispatchEvent(
        new StorageEvent('storage', { key: STORAGE_KEY }),
      )
    })

    expect(result.current.style).toEqual(toPositionStyle({ x: 0, y: 0 }))
  })

  it('should follow a reset made in another tab after moving it here', () => {
    const result = setup()
    act(() => result.current.handleProps.onKeyDown(key('ArrowLeft')))

    act(() => {
      localStorage.removeItem(STORAGE_KEY)
      globalThis.dispatchEvent(
        new StorageEvent('storage', { key: STORAGE_KEY }),
      )
    })

    expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
  })

  describe('dragging', () => {
    it('should follow the pointer and save on drop', () => {
      const result = setup()
      const down = pointer()

      act(() => result.current.handleProps.onPointerDown(down))
      // Grabbed 36px in from its corner, so this puts it mid-travel.
      act(() =>
        result.current.handleProps.onPointerMove(
          pointer({ clientX: 476, clientY: 376 }),
        ),
      )

      expect(down.currentTarget.setPointerCapture).toHaveBeenCalledWith(1)
      expect(result.current.isDragging).toBe(true)
      expect(result.current.style).toEqual(toPositionStyle({ x: 0.5, y: 0.5 }))
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

      act(() => result.current.handleProps.onPointerUp(pointer()))

      expect(result.current.isDragging).toBe(false)
      expect(result.current.style).toEqual(toPositionStyle({ x: 0.5, y: 0.5 }))
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{"x":0.5,"y":0.5}')
    })

    it('should keep the remote on screen', () => {
      const result = setup()

      act(() => result.current.handleProps.onPointerDown(pointer()))
      act(() =>
        result.current.handleProps.onPointerMove(
          pointer({ clientX: -400, clientY: 5000 }),
        ),
      )
      act(() => result.current.handleProps.onPointerCancel(pointer()))

      expect(localStorage.getItem(STORAGE_KEY)).toBe('{"x":0,"y":1}')
    })

    it('should save nothing for a press that never moves', () => {
      const result = setup()

      act(() => result.current.handleProps.onPointerDown(pointer()))
      act(() => result.current.handleProps.onPointerUp(pointer()))

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it.each([
      ['a right-click', { button: 2 }],
      ['a second finger', { isPrimary: false }],
    ])('should not start a drag from %s', (_, overrides) => {
      const result = setup()
      const down = pointer(overrides)

      act(() => result.current.handleProps.onPointerDown(down))
      act(() =>
        result.current.handleProps.onPointerMove(
          pointer({ clientX: 476, clientY: 376 }),
        ),
      )

      expect(down.currentTarget.setPointerCapture).not.toHaveBeenCalled()
      expect(result.current.isDragging).toBe(false)
    })

    it('should ignore other pointers mid-drag', () => {
      const result = setup()

      act(() => result.current.handleProps.onPointerDown(pointer()))
      act(() =>
        result.current.handleProps.onPointerMove(
          pointer({ pointerId: 2, clientX: 476, clientY: 376 }),
        ),
      )

      expect(result.current.isDragging).toBe(false)
    })
  })

  describe('keyboard', () => {
    it('should nudge with the arrow keys', () => {
      const result = setup()
      const event = key('ArrowLeft')

      act(() => result.current.handleProps.onKeyDown(event))

      expect(event.preventDefault).toHaveBeenCalled()
      // 10px left of the corner: 838 / 848 of the way across.
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{"x":0.9882,"y":1}')
    })

    it('should nudge further with Shift', () => {
      const result = setup()

      act(() =>
        result.current.handleProps.onKeyDown(
          key('ArrowUp', { shiftKey: true }),
        ),
      )

      // 50px up from the corner: 598 / 648 of the way down.
      expect(localStorage.getItem(STORAGE_KEY)).toBe('{"x":1,"y":0.9228}')
    })

    it('should leave modified arrow keys to the browser', () => {
      const result = setup()
      const event = key('ArrowLeft', { altKey: true })

      act(() => result.current.handleProps.onKeyDown(event))

      expect(event.preventDefault).not.toHaveBeenCalled()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it('should reset to the default corner with Home', () => {
      localStorage.setItem(STORAGE_KEY, '{"x":0,"y":0}')
      const result = setup()

      act(() => result.current.handleProps.onKeyDown(key('Home')))

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
      expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
    })
  })

  it('should reset to the default corner on double-click', () => {
    localStorage.setItem(STORAGE_KEY, '{"x":0,"y":0}')
    const result = setup()

    act(() => result.current.handleProps.onDoubleClick())

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
  })

  it('should still move for this page when storage is unavailable', () => {
    for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
      jest.spyOn(Storage.prototype, method).mockImplementation(throwUnavailable)
    }
    const result = setup()

    act(() => result.current.handleProps.onKeyDown(key('ArrowLeft')))

    expect(result.current.style).toEqual(toPositionStyle({ x: 0.9882, y: 1 }))

    // Clears the in-memory position so it can't leak into other tests.
    act(() => result.current.handleProps.onDoubleClick())

    expect(result.current.style).toEqual(toPositionStyle(DEFAULT_POSITION))
  })
})
