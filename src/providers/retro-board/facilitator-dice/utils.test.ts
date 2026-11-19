import { getFacilitatorCandidates } from './utils'
import { BoardRole } from '@/enums'
import type { ViewingMembers } from '@/providers/viewing-members'
import type { BoardMember } from '@/types'

const viewer = (role: BoardRole) => ({
  name: `name-${role}`,
  image: `image-${role}`,
  isAuthenticated: true,
  role,
})

const member = (id: string, role: BoardRole): BoardMember => ({
  role,
  permissionMask: 0,
  user: { id, name: id, image: undefined },
})

describe('providers/retro-board/facilitator-dice/utils', () => {
  describe('getFacilitatorCandidates', () => {
    it.each([
      {
        scenario: 'member role wins over a stale presence role (promotion)',
        presenceRole: BoardRole.MEMBER,
        memberRole: BoardRole.FACILITATOR,
        eligible: true,
      },
      {
        scenario: 'member role wins over a stale presence role (demotion)',
        presenceRole: BoardRole.FACILITATOR,
        memberRole: BoardRole.MEMBER,
        eligible: false,
      },
      {
        scenario: 'non-members fall back to their presence role',
        presenceRole: BoardRole.ADMIN,
        memberRole: undefined,
        eligible: true,
      },
      {
        scenario: 'non-member viewers are not eligible',
        presenceRole: BoardRole.VIEWER,
        memberRole: undefined,
        eligible: false,
      },
    ])('$scenario', ({ presenceRole, memberRole, eligible }) => {
      const viewingMembers: ViewingMembers = { 'user-1': viewer(presenceRole) }
      const boardMembers = memberRole ? [member('user-1', memberRole)] : []

      const candidates = getFacilitatorCandidates(viewingMembers, boardMembers)

      expect(candidates).toEqual(
        eligible
          ? [
              {
                clientId: 'user-1',
                name: `name-${presenceRole}`,
                image: `image-${presenceRole}`,
              },
            ]
          : [],
      )
    })

    it('only includes members who are currently viewing the board', () => {
      const candidates = getFacilitatorCandidates({}, [
        member('offline-owner', BoardRole.OWNER),
      ])

      expect(candidates).toEqual([])
    })
  })
})
