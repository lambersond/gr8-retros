import { BoardRoleBadge, PaymentTierBadge } from '@/components/badges'
import { BoardRole, PaymentTier as PaymentTierEnum } from '@/enums'

const PLAN_MAP: Record<string, PaymentTierEnum> = {
  Free: PaymentTierEnum.FREE,
  Supporter: PaymentTierEnum.SUPPORTER,
  Believer: PaymentTierEnum.BELIEVER,
}

export default function BoardSettings() {
  return (
    <>
      <h1 className='pt-8'>Board Settings</h1>
      <p>
        Every board comes with a set of configurable settings. Settings are
        managed from the Board Settings sidebar by users with the appropriate
        role. The list below shows every setting, its default state on a new
        board, and the minimum plan required for the board owner.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: Only the board owner needs the required plan. All other
        participants can use the features on the board without a subscription.
      </p>

      <p className='text-sm text-text-secondary italic'>
        Note: Board settings can only be changed once a board has been claimed
        by an owner.
      </p>

      <h2>Managing Board Members</h2>
      <p>
        Once a board has been claimed, other users can join as participants.
        After a user has joined, the board owner or an{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> can assign
        them a role. Available roles include{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.VIEWER} />,{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.MEMBER} />,{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} />, and{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} />. The{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> role can only
        be assigned to users who have a{' '}
        <PaymentTierBadge tier={PaymentTierEnum.SUPPORTER} /> plan or above.
      </p>

      <h2>Settings Overview</h2>

      <div className='text-sm'>
        <div className='sticky top-0 flex gap-4 px-3 py-2 font-semibold border-b-2 border-border-light bg-page z-10'>
          <div className='flex-1'>Setting</div>
          <div className='w-24'>Default</div>
          <div className='w-24'>Plan</div>
        </div>

        <SettingGroup>
          <SettingRow
            name='Private Board'
            defaultValue='Off'
            plan='Free'
            description='Make the board private so only invited members can access it. Only board owners can toggle privacy.'
          />
          <SettingRow
            name='Guest Access'
            defaultValue='Off'
            plan='Free'
            description='Allow unauthenticated guests to view and participate in a private board via an invite link.'
            indent
          />
          <SettingRow
            name='Card Retention'
            defaultValue='7 days'
            plan='Free'
            description='How long discussed cards are retained before being automatically removed. Applies to private boards only.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Comments'
            defaultValue='On'
            plan='Free'
            description='Allow participants to add threaded comments to cards.'
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only members and above can comment &mdash; viewers are excluded.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Music'
            defaultValue='On'
            plan='Free'
            description='Enable the background music player. Choose from a selection of ambient tracks to set the mood.'
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only facilitators and above can start, stop, or change tracks.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Timer'
            defaultValue='On'
            plan='Free'
            description='Enable a shared countdown timer visible to all participants. Default duration is 5 minutes.'
          />
          <SettingRow
            name='Default Duration'
            defaultValue='5 min'
            plan='Free'
            description='The starting duration when the timer is reset. Can be adjusted per session.'
            indent
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only facilitators and above can start or stop the timer.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Upvoting'
            defaultValue='On'
            plan='Free'
            description='Allow participants to upvote cards to signal agreement or importance. Each participant can cast a single upvote per card. When both upvoting and voting are enabled, cards are automatically ordered by most to least upvotes when a vote starts.'
          />
          <SettingRow
            name='Limit'
            defaultValue='Unlimited'
            plan='Free'
            description='Cap the number of upvotes each participant can give. Set to unlimited by default.'
            indent
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only members and above can upvote &mdash; viewers are excluded.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Action Items'
            defaultValue='On'
            plan='Free'
            description='Enable the action items panel where the team can capture follow-up tasks and assign them to members.'
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only facilitators and above can manage action items. Members and above can still add them.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Voting'
            defaultValue='Off'
            plan='Free'
            description='Enable structured voting sessions where a facilitator opens a vote, participants cast ballots, and results are tallied.'
          />
          <SettingRow
            name='Mode'
            defaultValue='Multi'
            plan='Free'
            description='Multi-mode allows participants to cast multiple votes on the same card. Single-mode restricts to one vote per card.'
            indent
          />
          <SettingRow
            name='Max Votes'
            defaultValue='3'
            plan='Free'
            description='The maximum number of votes each participant can cast per voting session.'
            indent
          />
          <SettingRow
            name='Restricted'
            defaultValue='Off'
            plan='Free'
            description='Only members and above can cast votes.'
            indent
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Drag and Drop'
            defaultValue='On'
            plan='Free'
            description='Allow cards to be reordered and moved between columns via drag and drop.'
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Board Customization'
            defaultValue='Off'
            plan='Supporter'
            description='Customize the look and feel of your board with themes, column colors, and layout options.'
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Card Grouping'
            defaultValue='Off'
            plan='Supporter'
            description='Enable grouping of related cards via drag and drop. Grouped cards are displayed together under a shared heading.'
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='AI Group Naming'
            defaultValue='Off'
            plan='Believer'
            description='Automatically generate descriptive names for card groups.'
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='Facilitator Mode'
            defaultValue='Off'
            plan='Free'
            description='Enable the facilitator mode feature, allowing facilitators to run guided discussion sessions one card at a time.'
          />
        </SettingGroup>

        <SettingGroup>
          <SettingRow
            name='AI Summaries'
            defaultValue='Off'
            plan='Believer'
            description='Generate AI-powered summaries of discussion points and themes across the board.'
          />
        </SettingGroup>
      </div>

      <h2>Danger Zone</h2>
      <p>
        The following actions are irreversible and only available to the board{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.OWNER} />.
      </p>

      <div className='text-sm border border-red-300 dark:border-red-800 rounded-lg overflow-hidden'>
        <DangerRow
          name='Delete Board'
          description='Permanently delete the board and all of its data. This action cannot be undone.'
        />
        <DangerRow
          name='Transfer Board'
          description='Transfer ownership of the board to another user. Only board admins are eligible to receive ownership.'
          last
        />
      </div>

      <h2>Who Can Change Settings</h2>
      <p>
        Top-level feature toggles (e.g. enabling comments, voting, drag and
        drop) require the{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.ADMIN} /> role.
        Sub-settings like &ldquo;Allow Anytime,&rdquo; vote limits, and
        restriction toggles require the{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.FACILITATOR} /> role.
        Board privacy can only be changed by the{' '}
        <BoardRoleBadge variant='simple' role={BoardRole.OWNER} />.
      </p>
    </>
  )
}

function DangerRow({
  name,
  description,
  last,
}: Readonly<{ name: string; description: string; last?: boolean }>) {
  return (
    <div
      className={`flex gap-4 px-3 py-2 ${last ? '' : 'border-b border-red-300 dark:border-red-800'}`}
    >
      <div className='flex-1'>
        <strong>{name}</strong>
        <br />
        <span className='text-text-secondary text-sm'>{description}</span>
      </div>
      <div className='w-24'>
        <BoardRoleBadge variant='simple' role={BoardRole.OWNER} />
      </div>
    </div>
  )
}

function SettingGroup({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className='border-b border-border-light'>{children}</div>
}

function SettingRow({
  name,
  defaultValue,
  plan,
  description,
  indent,
}: Readonly<{
  name: string
  defaultValue: string
  plan: string
  description: string
  indent?: boolean
}>) {
  const tier = PLAN_MAP[plan] ?? PaymentTierEnum.FREE

  return (
    <div className='flex gap-4 px-3 py-2'>
      <div className={`flex-1 ${indent ? 'pl-6' : ''}`}>
        <strong dangerouslySetInnerHTML={{ __html: name }} />
        <br />
        <span className='text-text-secondary text-sm'>{description}</span>
      </div>
      <div className='w-24'>{defaultValue}</div>
      <div className='w-24'>
        <PaymentTierBadge tier={tier} />
      </div>
    </div>
  )
}
