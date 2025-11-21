import { SidebarCloseIcon } from 'lucide-react'
import { Comment } from '../comment'
import { Sidebar, SidebarItem } from '../common'
import { AddCommentForm } from '../forms/add-comment-form'
import { useComments, useCommentsDispatch } from './comments-provider'

export function Comments() {
  const dispatch = useCommentsDispatch()
  const { comments, cardId, sidebarOpen } = useComments()

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SIDEBAR' })
  }

  const handleAddComment = (content: string | undefined) => {
    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, cardId }),
    })
      .then(response => response.json())
      .then(data => {
        console.warn('Success:', data)
      })
  }

  return (
    <Sidebar
      side='right'
      isOpen={sidebarOpen}
      onClose={handleClose}
      className='w-full sm:w-sm shadow-xl'
    >
      <div className='flex flex-col p-2 pt-0 h-full'>
        <section className='flex items-start justify-between sticky top-0 bg-appbar z-10 pb-4'>
          <div>
            <p className='text-2xl font-bold'>Comments</p>
            <p className='text-text-secondary text-sm'>
              For when the card needs more context.
            </p>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <section className='flex flex-col gap-2 overflow-y-auto'>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </section>
        <div className='flex-1' id='spacer' />
        <AddCommentForm onSubmit={handleAddComment} />
      </div>
    </Sidebar>
  )
}
