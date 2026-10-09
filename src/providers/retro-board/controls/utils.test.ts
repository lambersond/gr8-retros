import { tallyVotes } from './utils'

describe('providers/retro-board/controls/utils', () => {
  describe('tallyVotes', () => {
    it('groups each voted-for id with its voters', () => {
      expect(
        tallyVotes({
          ann: ['card-1', 'card-2'],
          bob: ['card-1'],
          cat: ['card-1', 'card-1'],
        }),
      ).toEqual({
        'card-1': ['ann', 'bob', 'cat', 'cat'],
        'card-2': ['ann'],
      })
    })

    it('returns no results when nobody voted', () => {
      expect(tallyVotes({})).toEqual({})
      expect(tallyVotes({ ann: [] })).toEqual({})
    })
  })
})
