import { useMemo } from 'react'
import { ArrowDownWideNarrow, Funnel } from 'lucide-react'
import { FacilitatorActions } from './facilitator-actions'
import { LabeledTriggerButton } from './labeled-trigger-button'
import { useRetroActions } from './use-retro-actions'
import { Menu, Popover } from '@/components/common'
import { VotingState } from '@/enums'
import {
  BoardCardsFilterOptions,
  BoardCardsSortOptions,
} from '@/providers/retro-board/cards'
import { useBoardControlsState } from '@/providers/retro-board/controls'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { handleSortCardsBy, handleFilterCardsBy } = useRetroActions(id)
  const { hasVotingResults } = useBoardControlsState(s => ({
    hasVotingResults: s.boardControls.voting.state === VotingState.CLOSED,
  }))

  const showFilterButton = hasVotingResults

  const sortOptions = useMemo(() => {
    const options = [
      {
        label: 'Sort by Discussed Status',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_DISCUSSED),
      },
      {
        label: 'Sort by Most Upvotes',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_UPVOTES),
      },
      {
        label: 'Sort by Most Comments',
        onClick: () =>
          handleSortCardsBy(BoardCardsSortOptions.BY_COMMENT_COUNT),
      },
      {
        label: 'Sort by Most Action Items',
        onClick: () =>
          handleSortCardsBy(BoardCardsSortOptions.BY_ACTION_ITEM_COUNT),
      },
    ]

    if (showFilterButton) {
      options.push({
        label: 'Sort by Most Votes',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_VOTES),
      })
    }
    return options
  }, [handleSortCardsBy, showFilterButton])

  return (
    <div className='flex gap-2 z-10'>
      {showFilterButton && (
        <Popover
          asChild
          modal
          placement='bottom-start'
          content={
            <Menu
              options={[
                {
                  label: 'Show All Cards',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.ALL),
                },
                {
                  label: 'Show Only Cards With Votes',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.WITH_VOTES),
                },
                {
                  label: 'Show Cards Without Votes',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.WITHOUT_VOTES),
                },
              ]}
            />
          }
        >
          <LabeledTriggerButton label='Filters' icon={Funnel} />
        </Popover>
      )}
      <Popover
        asChild
        modal
        placement='bottom-start'
        content={<Menu options={sortOptions} />}
      >
        <LabeledTriggerButton label='Sorts' icon={ArrowDownWideNarrow} />
      </Popover>
      <FacilitatorActions id={id} />
    </div>
  )
}
