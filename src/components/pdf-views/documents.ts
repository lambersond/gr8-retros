import { lazy } from 'react'

export const PDF_DOCUMENTS = {
  ReportDetails: lazy(() =>
    import('./report-details').then(module => ({
      default: module.ReportDetailsDocument,
    })),
  ),
}
