import { FileData } from "../utils/fileService.ts";
import { fileService } from "../utils/fileService.ts";

interface FileItemProps {
  file: FileData;
}

export function FileItem({ file }: FileItemProps) {
  const handleDownload = async () => {
    try {
      await fileService.downloadFile(file.id, file.name);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <li class="flex justify-between items-center p-3 border-b border-gray-200">
      <span class="text-gray-700">{file.name}</span>
      <button 
        onClick={handleDownload}
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Download
      </button>
    </li>
  );
}