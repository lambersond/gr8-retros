import {
  DEFAULT_POSITION,
  parsePosition,
  toPosition,
  toPositionStyle,
} from './utils'

// A 1000x800 window with a 120px remote and a 16px margin: 848px of travel
// across and 648px down.
const BOUNDS = {
  width: 120,
  height: 120,
  viewportWidth: 1000,
  viewportHeight: 800,
  margin: 16,
}

describe('components/board-controls/remote/utils', () => {
  describe('parsePosition', () => {
    it('should read a stored position', () => {
      expect(parsePosition('{"x":0.25,"y":0.75}')).toEqual({
        x: 0.25,
        y: 0.75,
      })
    })

    it('should clamp an out-of-range position onto the screen', () => {
      expect(parsePosition('{"x":-3,"y":1.5}')).toEqual({ x: 0, y: 1 })
    })

    it.each([
      ['nothing stored', ''],
      ['invalid JSON', '{"x":0.5,'],
      ['null', 'null'],
      ['a number', '42'],
      ['an array', '[0.5,0.5]'],
      ['a missing coordinate', '{"x":0.5}'],
      ['a string coordinate', '{"x":"0.5","y":0.5}'],
      ['a null coordinate', '{"x":null,"y":0.5}'],
    ])('should ignore %s', (_, raw) => {
      expect(parsePosition(raw)).toBeUndefined()
    })
  })

  describe('toPosition', () => {
    it('should map the top-left margin to 0, 0', () => {
      expect(toPosition(16, 16, BOUNDS)).toEqual({ x: 0, y: 0 })
    })

    it('should map the bottom-right margin to 1, 1', () => {
      expect(toPosition(864, 664, BOUNDS)).toEqual({ x: 1, y: 1 })
    })

    it('should map the middle of the travel to 0.5, 0.5', () => {
      expect(toPosition(440, 340, BOUNDS)).toEqual({ x: 0.5, y: 0.5 })
    })

    it('should keep the remote inside the margins', () => {
      expect(toPosition(-500, 5000, BOUNDS)).toEqual({ x: 0, y: 1 })
    })

    it('should round to four decimal places', () => {
      expect(toPosition(17, 17, BOUNDS)).toEqual({ x: 0.0012, y: 0.0015 })
    })

    it('should stay in the default corner when the window is too small', () => {
      expect(
        toPosition(0, 0, {
          ...BOUNDS,
          viewportWidth: 100,
          viewportHeight: 150,
        }),
      ).toEqual(DEFAULT_POSITION)
    })
  })

  describe('toPositionStyle', () => {
    it('should place the default corner a margin in from the bottom right', () => {
      expect(toPositionStyle(DEFAULT_POSITION)).toEqual({
        left: 'calc(1rem + 1 * (100% - 2 * 1rem))',
        top: 'calc(1rem + 1 * (100% - 2 * 1rem))',
        translate: '-100% -100%',
      })
    })

    it('should place 0, 0 a margin in from the top left', () => {
      expect(toPositionStyle({ x: 0, y: 0 })).toEqual({
        left: 'calc(1rem + 0 * (100% - 2 * 1rem))',
        top: 'calc(1rem + 0 * (100% - 2 * 1rem))',
        translate: '0% 0%',
      })
    })

    it('should pull the remote back by the same fraction of its size', () => {
      expect(toPositionStyle({ x: 0.5, y: 0.25 }).translate).toBe('-50% -25%')
    })
  })
})
