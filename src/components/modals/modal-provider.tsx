import {
  type Dispatch,
  type ReactNode,
  createContext,
  useReducer,
  Suspense,
  use,
} from 'react'
import { MODALS } from '@/modals'
import type { ModalMap, Modal, ModalState, ModalAction } from '@/types/modals'

export const ModalStateCtx = createContext<ModalState | undefined>(undefined)
export const ModalDispatchCtx = createContext<
  Dispatch<ModalAction<keyof ModalMap>> | undefined
>(undefined)

const reducer = (state: ModalState, action: ModalAction<Modal>): ModalState => {
  switch (action.type) {
    case 'open': {
      return { ...state, [action.modal]: { open: true, props: action.props } }
    }
    case 'close': {
      return { ...state, [action.modal]: { open: false, props: {} } }
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`)
    }
  }
}

function ModalManager() {
  const state = use(ModalStateCtx)

  if (!state) return

  const modals = Object.entries(state).map(([modal, state]) => {
    const Component = MODALS[modal as Modal]
    const props = state.props as any

    return (
      <Suspense key={modal}>
        <Component open={state.open} {...props} />
      </Suspense>
    )
  })

  return <>{modals}</>
}

export function ModalProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, {} as ModalState)

  return (
    <ModalDispatchCtx value={dispatch}>
      <ModalStateCtx value={state}>
        {children}
        <ModalManager />
      </ModalStateCtx>
    </ModalDispatchCtx>
  )
}
