import type { PDFViewerProps } from '@react-pdf/renderer'

export type PdfPreviewerProps = {
  children: PDFViewerProps['children']
  width?: string | number
  height?: string | number
}
