import { useMemo } from 'react'
import { BoardColumnsMessageType } from '../enums'
import { useBoardColumnsDispatch } from '../provider'

export function useBoardColumnsMessageHandlers() {
  const dispatch = useBoardColumnsDispatch()

  const handlers = useMemo(() => {
    const h: Record<
      BoardColumnsMessageType,
      (data: any, name?: string) => void
    > = {
      [BoardColumnsMessageType.UPDATE_COLUMNS]: data =>
        dispatch({
          type: BoardColumnsMessageType.UPDATE_COLUMNS,
          columns: data.payload,
        }),
    }

    return h
  }, [dispatch])

  return handlers
}
