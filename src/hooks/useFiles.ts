import { useState } from "react";

export function useFiles() {
  const [files, setFiles] = useState<File[]>([]);
  function addFile(file: File) {
    setFiles((files) => [...files, file]);
  }
  function removeFile(fileName: string) {
    setFiles((files) => files.filter((file) => file.name !== fileName));
  }
  return {
    files,
    removeFile,
    addFile,
  };
}
