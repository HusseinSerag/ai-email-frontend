import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
export default function DocumentViewer() {
  return (
    <DocViewer
      className="h-screen"
      documents={[
        {
          uri: "https://email-ai-saas.s3.eu-north-1.amazonaws.com/uploads/1734194456099Rome-Munich-Gaemisch-(1)%20(1).docx",
          fileType: "docx",
        },
      ]}
      pluginRenderers={DocViewerRenderers}
    />
  );
}
