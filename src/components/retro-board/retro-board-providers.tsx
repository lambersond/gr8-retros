import { DiceRendererProvider } from '@lambersond/3d-dice-react'
import { MessageOrchestrator } from '../message-orchestrator'
import { RENDERER_CONFIG } from '@/hooks/dice'
import { CommentsSidebarProvider } from '@/providers/comments-sidebar'
import { BoardAccessRequestsProvider } from '@/providers/retro-board/board-access-requests'
import { BoardSettingsProvider } from '@/providers/retro-board/board-settings'
import { BoardCardsProvider } from '@/providers/retro-board/cards'
import { BoardColumnsProvider } from '@/providers/retro-board/columns'
import { RetroBoardControlsProvider } from '@/providers/retro-board/controls'
import { FacilitatorDiceProvider } from '@/providers/retro-board/facilitator-dice'
import { SessionStatsProvider } from '@/providers/retro-board/session-stats'
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
    <BoardSettingsProvider
      settings={board.settings}
      boardId={board.id}
      boardName={board.name || board.id}
    >
      <ViewingMembersProvider channelName={board.id}>
        <RetroBoardControlsProvider boardId={board.id}>
          <BoardColumnsProvider board={board}>
            <BoardCardsProvider board={board}>
              <SessionStatsProvider boardId={board.id}>
                <CommentsSidebarProvider boardId={board.id}>
                  <DiceRendererProvider config={RENDERER_CONFIG}>
                    <FacilitatorDiceProvider>
                      <BoardAccessRequestsProvider
                        settingsId={board.settings.id}
                      >
                        <MessageOrchestrator boardId={board.id}>
                          {children}
                        </MessageOrchestrator>
                      </BoardAccessRequestsProvider>
                    </FacilitatorDiceProvider>
                  </DiceRendererProvider>
                </CommentsSidebarProvider>
              </SessionStatsProvider>
            </BoardCardsProvider>
          </BoardColumnsProvider>
        </RetroBoardControlsProvider>
      </ViewingMembersProvider>
    </BoardSettingsProvider>
  )
}
