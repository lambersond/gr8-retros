import { Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '../common'
import { useModals } from '@/hooks/use-modals'
import type { CommentProps } from './types'

export function Comment({ comment, hasEdit = true }: Readonly<CommentProps>) {
  const { openModal } = useModals()

  const handleEdit = () => {
    openModal('UpsertContentModal', {
      title: 'Edit Comment',
      defaultContent: comment.content,
      onSubmit: (content: string) => {
        fetch('/api/comments', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: comment.id,
            content,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.warn('Success:', data)
          })
      },
    })
  }

  const handleDelete = () => {
    openModal('ConfirmModal', {
      title: 'Delete Comment',
      message: (
        <div className='flex flex-col gap-2 mb-5'>
          <p className='text-sm font-normal -mt-3'>
            Are you sure you want to delete this comment?
          </p>
          <p className='text-md p-2 rounded-xl shadow-sm'>{comment.content}</p>
        </div>
      ),
      color: 'danger',
      confirmButtonText: 'Delete',
      onConfirm: () => {
        fetch('/api/comments', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: comment.id,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.warn('Success:', data)
          })
      },
    })
  }

  return (
    <div className='relative bg-page border border-tertiary rounded-lg p-2 flex flex-col gap-1'>
      <div className='text-text-secondary flex justify-between align-center'>
        <p>{comment.createdBy}</p>
        {hasEdit && (
          <div className='flex items-center'>
            <IconButton icon={Pencil} onClick={handleEdit} />
            <IconButton icon={Trash2} onClick={handleDelete} intent='danger' />
          </div>
        )}
      </div>
      <p>{comment.content}</p>
    </div>
  )
}
