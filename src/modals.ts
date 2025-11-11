import { lazy } from 'react'

export const MODALS = {
  ConfirmModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.ConfirmModal,
    })),
  ),
  UpsertContentModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.UpsertContentModal,
    })),
  ),
}
