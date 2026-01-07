import { useBoardSettingsManager } from './hooks/use-board-settings-message-manager'

export function BoardSettingsMessageManager({
  boardId,
  children,
}: Readonly<{ boardId: string; children: React.ReactNode }>) {
  useBoardSettingsManager(boardId)
  return <>{children}</>
}
