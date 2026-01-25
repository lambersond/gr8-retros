import { Suspense } from 'react'
import { Document, Page, Text } from '@react-pdf/renderer'
import { PDFPreviewModalProps } from './types'
import { CircularLoader, Modal } from '@/components/common'
import { PDFPreviewer } from '@/components/pdf-previewer'
import { ReportDetailsDocument } from '@/components/pdf-views'
import { useModals } from '@/hooks/use-modals'

export function PDFPreviewerModal({
  open = true,
  title = 'PDF Preview',
  type,
  ...props
}: Readonly<PDFPreviewModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('PDFPreviewerModal')
  }

  if (!open) {
    return
  }

  const getDocumentComponent = () => {
    if (type === 'ReportDetails') {
      return <ReportDetailsDocument {...props} />
    }

    return (
      <Document>
        <Page>
          <Text>Unknown</Text>
        </Page>
      </Document>
    )
  }

  return (
    <Modal
      title={title}
      isOpen={open}
      onClose={onClose}
      fullScreen
      disableContainerStyles
    >
      <Suspense
        fallback={<CircularLoader label='Loading Preview' fullscreen />}
      >
        <PDFPreviewer width='100%' height='100%'>
          {getDocumentComponent()}
        </PDFPreviewer>
      </Suspense>
    </Modal>
  )
}
