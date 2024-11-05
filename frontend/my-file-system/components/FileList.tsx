import { FileItem } from "./FileItem.tsx";
import { FileData } from "../utils/fileService.ts";

interface FileListProps {
  files: FileData[];
}

export function FileList({ files }: FileListProps) {
  return (
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-3">Uploaded Files:</h3>
      <ul class="bg-white rounded-lg shadow">
        {files.map(file => (
          <FileItem key={file.id} file={file} />
        ))}
      </ul>
    </div>
  );
}