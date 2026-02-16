import { noop } from 'lodash'
import { Tooltip } from '@/components/common'
import { IAmDoneButton } from '@/components/i-am-done-button'

export function VotesRemaining() {
  const votesMax: number = 3
  const votesUsed: number = 3
  const formatted = `${votesMax - votesUsed}/${votesMax}`
  return (
    <>
      <Tooltip title='Votes Remaining'>{formatted}</Tooltip>
      <IAmDoneButton
        onClick={noop}
        showBounceAnimation={votesUsed === votesMax}
      />
    </>
  )
}
