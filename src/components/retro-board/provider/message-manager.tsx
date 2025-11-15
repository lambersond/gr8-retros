import { useMessageManager } from '../hooks/use-message-manager'

export function MessageManager({
  boardId,
  children,
}: Readonly<{ boardId: string; children: React.ReactNode }>) {
  useMessageManager(boardId)
  return <>{children}</>
}
