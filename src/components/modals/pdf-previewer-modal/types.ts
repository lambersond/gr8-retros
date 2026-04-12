import type {
  ReportDetailsColumn,
  ReportDetailsStats,
  ReportSessionData,
} from '@/components/pdf-views/report-details'

export type PDFPreviewModalProps = {
  open?: boolean
  title?: string
} & ReportDetailsModalProps

type ReportDetailsModalProps = {
  type: 'ReportDetails'
  columns: ReportDetailsColumn[]
  stats: ReportDetailsStats
  summary?: string
  sessionData?: ReportSessionData
}
