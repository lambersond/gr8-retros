import clsx from 'clsx'
import { ArrowBigUp } from 'lucide-react'
import { Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { GroupUpvoteModalProps } from './types'

export function GroupUpvoteModal({
  open = true,
  cards,
  onUpvote,
}: Readonly<GroupUpvoteModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('GroupUpvoteModal')
  }

  const handleUpvote = (cardId: string) => {
    onUpvote(cardId)
    onClose()
  }

  return (
    <Modal title='Upvote a Card' isOpen={open} onClose={onClose}>
      <ul className='flex flex-col gap-2'>
        {cards?.map(card => (
          <li key={card.id}>
            <button
              onClick={() => handleUpvote(card.id)}
              className={clsx(
                'w-full flex items-center gap-3 rounded-lg',
                'border border-border-light px-4 py-3',
                'text-left transition-colors cursor-pointer',
                card.isUpvoted
                  ? 'bg-success/5 hover:bg-success/10'
                  : 'bg-card hover:bg-hover',
              )}
            >
              <div
                className={clsx(
                  'flex items-center gap-1 shrink-0',
                  card.isUpvoted ? 'text-success' : 'text-text-secondary',
                )}
              >
                <ArrowBigUp className='size-5' />
                <span className='text-sm font-medium'>{card.upvotes}</span>
              </div>
              <p className='text-sm text-text-primary truncate'>
                {card.content}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
