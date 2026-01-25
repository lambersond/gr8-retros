'use client'

import { PDFViewer, Font, type PDFViewerProps } from '@react-pdf/renderer'

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/img/apple/64/',
  withVariationSelectors: true,
})

export function PDFPreviewer({
  children,
  height = '100%',
  width = '1200px',
  ...props
}: Readonly<PDFViewerProps>) {
  return (
    <PDFViewer height={height} width={width} {...props}>
      {children}
    </PDFViewer>
  )
}
