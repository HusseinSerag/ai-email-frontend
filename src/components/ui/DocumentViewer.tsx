import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'

interface DocumentViewerProps {
  doc: {
    uri: string
    fileType: string
  }
  className?: string
}
export default function DocumentViewer({
  doc,
  className,
}: DocumentViewerProps) {
  return (
    <DocViewer
      className={className}
      documents={[doc]}
      pluginRenderers={DocViewerRenderers}
      style={{
        fontSize: '1rem',
      }}
    />
  )
}
