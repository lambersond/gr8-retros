import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, SidebarCloseIcon } from 'lucide-react'
import { Comment } from '../comment'
import { Sidebar, SidebarItem } from '../common'
import { AddCommentForm } from '../forms/add-comment-form'
import { useCardComments, useGroupComments } from '../retro-board'
import {
  useCommentsActions,
  useCommentsSidebar,
  useCommentsSidebarActions,
} from '@/providers/comments-sidebar'
import { useBoardPermissions } from '@/providers/retro-board/board-settings/hooks/use-board-permissions'

const SCROLL_THRESHOLD = 40

export function CommentsSidebar() {
  const { closeSidebar } = useCommentsSidebarActions()
  const { sidebarOpen, cardId, groupId } = useCommentsSidebar()
  const cardComments = useCardComments(groupId ? undefined : cardId)
  const { comments: groupComments, memberCards } = useGroupComments(groupId)
  const { addComment } = useCommentsActions()
  const { userPermissions } = useBoardPermissions()
  const canComment = userPermissions['comments.restricted.canComment']

  const isGroupMode = !!groupId
  const comments = isGroupMode ? groupComments : cardComments

  const scrollRef = useRef<HTMLElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [newCount, setNewCount] = useState(0)
  const prevCountRef = useRef(comments?.length ?? 0)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    setNewCount(0)
    setIsAtBottom(true)
    isAtBottomRef.current = true
  }, [])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD
    isAtBottomRef.current = atBottom
    setIsAtBottom(atBottom)
    if (atBottom) setNewCount(0)
  }, [])

  // Track new comments
  useEffect(() => {
    const currentCount = comments?.length ?? 0
    const added = currentCount - prevCountRef.current

    if (added > 0) {
      if (isAtBottomRef.current) {
        requestAnimationFrame(() => scrollToBottom())
      } else {
        setNewCount(prev => prev + added)
      }
    }

    prevCountRef.current = currentCount
  }, [comments?.length, scrollToBottom])

  useEffect(() => {
    setNewCount(0)
    setIsAtBottom(true)
    isAtBottomRef.current = true
    prevCountRef.current = comments?.length ?? 0
    if (sidebarOpen) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView()
      })
    }
  }, [sidebarOpen, cardId, groupId])

  const handleAddComment = (content: string, targetCardId?: string) => {
    const resolvedCardId = targetCardId ?? cardId
    addComment(content, resolvedCardId)
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
              {isGroupMode
                ? 'Comments across all cards in this group.'
                : 'For when the card needs more context.'}
            </p>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <section
          ref={scrollRef}
          onScroll={handleScroll}
          className='flex flex-col gap-2 overflow-y-auto'
        >
          {comments?.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
          {comments?.length === 0 && (
            <p className='text-center text-text-secondary mt-4'>
              No comments yet.
            </p>
          )}
          <div ref={bottomRef} />
        </section>
        {newCount > 0 && !isAtBottom && (
          <button
            type='button'
            onClick={scrollToBottom}
            className='sticky bottom-16 mx-auto flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-text-primary shadow-lg'
          >
            <ArrowDown size={14} />
            {newCount} new {newCount === 1 ? 'comment' : 'comments'}
          </button>
        )}
        <div className='flex-1' id='spacer' />
        {canComment && (
          <AddCommentForm
            onSubmit={handleAddComment}
            memberCards={isGroupMode ? memberCards : undefined}
          />
        )}
      </div>
    </Sidebar>
  )
}
