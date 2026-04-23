import clsx from 'clsx'
import { ArrowBigUp, MessageSquareIcon, Vote } from 'lucide-react'
import { DiscussedIcon } from '../../common/icons'
import { CardAction } from '../card-action'
import type { CardGroupActionsProps } from './types'

export function CardGroupActions({
  aggregates,
  canUpvote,
  votes,
  settings,
  onMarkAllDiscussed,
  onUpvote,
  onOpenComments,
}: Readonly<CardGroupActionsProps>) {
  return (
    <div className='flex items-center py-1 px-3 gap-1'>
      {!aggregates.allDiscussed && (
        <CardAction
          icon={<DiscussedIcon className='size-4 text-text-secondary' />}
          text='Discussed'
          onClick={onMarkAllDiscussed}
          buttonClasses='bg-text-secondary/10 cursor-pointer'
          textClasses='text-text-secondary'
        />
      )}
      {settings.upvoting.enabled && (
        <CardAction
          amount={aggregates.totalUpvotes}
          icon={
            <ArrowBigUp
              className={clsx('size-4 transition-colors', {
                'text-success group-hover/action:text-warning':
                  aggregates.anyUpvotedByMe,
                'text-text-secondary group-hover/action:text-text-primary':
                  !aggregates.anyUpvotedByMe && canUpvote,
                'text-text-secondary': !aggregates.anyUpvotedByMe && !canUpvote,
              })}
            />
          }
          text={`Upvote${aggregates.totalUpvotes === 1 ? '' : 's'}`}
          onClick={canUpvote ? onUpvote : undefined}
          buttonClasses={clsx({
            'bg-transparent cursor-not-allowed': !canUpvote,
            'bg-success/10 hover:bg-success/20 cursor-pointer':
              canUpvote && aggregates.anyUpvotedByMe,
            'bg-text-secondary/10 hover:bg-text-secondary/20 cursor-pointer':
              canUpvote && !aggregates.anyUpvotedByMe,
          })}
        />
      )}
      {!!votes && (
        <CardAction
          icon={<Vote className='size-4 text-primary' />}
          text={`Vote${votes === 1 ? '' : 's'}`}
          amount={votes}
          buttonClasses='bg-primary/10'
          textClasses='text-primary'
        />
      )}
      {settings.comments.enabled && (
        <CardAction
          amount={aggregates.totalComments}
          icon={<MessageSquareIcon className='size-4 text-text-secondary' />}
          text={`Comment${aggregates.totalComments === 1 ? '' : 's'}`}
          onClick={onOpenComments}
          buttonClasses='bg-text-secondary/10 cursor-pointer'
          textClasses='text-text-secondary'
        />
      )}
    </div>
  )
}
