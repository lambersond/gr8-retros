import { lazy } from 'react'

export const MODALS = {
  ConfirmModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.ConfirmModal,
    })),
  ),
  CreateBoardModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.CreateBoardModal,
    })),
  ),
  CustomizeBoardColumnsModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.CustomizeBoardColumnsModal,
    })),
  ),
  ManageUsersModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.ManageUsersModal,
    })),
  ),
  UpsertContentModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.UpsertContentModal,
    })),
  ),
  UpsertActionItemModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.UpsertActionItemModal,
    })),
  ),
  PDFPreviewerModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.PDFPreviewerModal,
    })),
  ),
}
