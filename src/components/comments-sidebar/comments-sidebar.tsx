import { SidebarCloseIcon } from 'lucide-react'
import { Comment } from '../comment'
import { Sidebar, SidebarItem } from '../common'
import { AddCommentForm } from '../forms/add-comment-form'
import { useCardComments } from '../retro-board'
import {
  useCommentsActions,
  useCommentsSidebar,
  useCommentsSidebarActions,
} from '@/providers/comments-sidebar'
import { useBoardPermissions } from '@/providers/retro-board/board-settings/hooks/use-board-permissions'

export function CommentsSidebar() {
  const { closeSidebar } = useCommentsSidebarActions()
  const { sidebarOpen, cardId } = useCommentsSidebar()
  const comments = useCardComments(cardId)
  const { addComment } = useCommentsActions()
  const { userPermissions } = useBoardPermissions()
  const canComment = userPermissions['comments.restricted.canComment']

  const handleAddComment = (content: string) => {
    addComment(content, cardId)
  }

  return (
    <Sidebar
      side='right'
      isOpen={sidebarOpen}
      onClose={closeSidebar}
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
          {comments?.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
          {comments?.length === 0 && (
            <p className='text-center text-text-secondary mt-4'>
              No comments yet.
            </p>
          )}
        </section>
        <div className='flex-1' id='spacer' />
        {canComment && <AddCommentForm onSubmit={handleAddComment} />}
      </div>
    </Sidebar>
  )
}
