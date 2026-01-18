import { CommentsSidebarProvider } from '@/providers/comments-sidebar'
import { BoardSettingsProvider } from '@/providers/retro-board/board-settings'
import { BoardCardsProvider } from '@/providers/retro-board/cards'
import { RetroBoardControlsProvider } from '@/providers/retro-board/controls'
import { ViewingMembersProvider } from '@/providers/viewing-members'
import type { Board } from '@/types'

export function RetroBoardProviders({
  board,
  children,
}: Readonly<{
  board: Board
  children: React.ReactNode
}>) {
  return (
    <ViewingMembersProvider channelName={board.id}>
      <BoardSettingsProvider settings={board.settings} boardId={board.id}>
        <RetroBoardControlsProvider boardId={board.id}>
          <BoardCardsProvider board={board}>
            <CommentsSidebarProvider boardId={board.id}>
              {children}
            </CommentsSidebarProvider>
          </BoardCardsProvider>
        </RetroBoardControlsProvider>
      </BoardSettingsProvider>
    </ViewingMembersProvider>
  )
}
