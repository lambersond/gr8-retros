import type { BoardColumnsMessageType } from '../enums'
import type { Column, MessageStruct } from '@/types'

export type CardMessageData = MessageStruct<
  BoardColumnsMessageType.UPDATE_COLUMNS,
  { columns: Column[] }
>
