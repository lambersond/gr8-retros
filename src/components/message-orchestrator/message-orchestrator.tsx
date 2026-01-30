import { useMessageOrchestrator } from './use-message-orchestrator'
import type { MessageOrchestratorProps } from './types'

export function MessageOrchestrator({
  children,
  boardId,
}: Readonly<MessageOrchestratorProps>) {
  useMessageOrchestrator(boardId)
  return children
}
