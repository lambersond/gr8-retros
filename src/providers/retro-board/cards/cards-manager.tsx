import { useCardsManager } from './use-cards-manager'

export function CardsManager({
  boardId,
  children,
}: Readonly<{ boardId: string; children: React.ReactNode }>) {
  useCardsManager(boardId)
  return <>{children}</>
}
