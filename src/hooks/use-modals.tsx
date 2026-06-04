import { use, useCallback } from 'react'
import { ModalDispatchCtx } from '@/components/modals/modal-provider'
import type { Modal, ModalMap } from '@/types/modals'

export const useModals = () => {
  const dispatch = use(ModalDispatchCtx)

  // Memoized so consumers can safely list these in effect dependency arrays
  // without re-firing on every render (dispatch from useReducer is stable).
  const openModal = useCallback(
    (modal: Modal, props: Parameters<ModalMap[typeof modal]>[0]) =>
      dispatch?.({ type: 'open', modal, props }),
    [dispatch],
  )

  const closeModal = useCallback(
    (modal: Modal) => dispatch?.({ type: 'close', modal }),
    [dispatch],
  )

  if (!dispatch) {
    throw new Error('useModals must be used within a ModalProvider')
  }

  return { openModal, closeModal }
}
