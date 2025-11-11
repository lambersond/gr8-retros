import { MODALS } from '@/modals'

export type ModalMap = typeof MODALS
export type Modal = keyof ModalMap
export type ModalState = Record<Modal, { open: boolean; props: object }>
export type ModalAction<T extends Modal> =
  | {
      type: 'open'
      modal: T
      props: Parameters<ModalMap[T]>[0]
    }
  | { type: 'close'; modal: T }
