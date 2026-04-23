import { lazy } from 'react'

export const MODALS = {
  ConfirmModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.ConfirmModal,
    })),
  ),
  GoodRetroModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.GoodRetroModal,
    })),
  ),
  CreateBoardModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.CreateBoardModal,
    })),
  ),
  CreateCardGroupModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.CreateCardGroupModal,
    })),
  ),
  GroupUpvoteModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.GroupUpvoteModal,
    })),
  ),
  DiceColorPickerModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.DiceColorPickerModal,
    })),
  ),
  CustomizeBoardColumnsModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.CustomizeBoardColumnsModal,
    })),
  ),
  EditCardGroupModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.EditCardGroupModal,
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
  SignInModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.SignInModal,
    })),
  ),
  TransferBoardModal: lazy(() =>
    import('./components/modals').then(module => ({
      default: module.TransferBoardModal,
    })),
  ),
}
