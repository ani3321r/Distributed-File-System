import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { FileData } from "../utils/fileService.ts";
import { fileService } from "../utils/fileService.ts";
import { FileList } from "./FileList.tsx";

export function FileUpload() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  const selectedFile = useSignal<File | null>(null);
  const uploadedFiles = useSignal<FileData[]>([]);
  const isUploading = useSignal(false);

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFile.value = input.files[0];
    }
  };

  const handleUpload = async () => {
    if (!selectedFile.value) return;
    
    isUploading.value = true;
    try {
      const uploadedFile = await fileService.uploadFile(selectedFile.value);
      uploadedFiles.value = [...uploadedFiles.value, uploadedFile];
      selectedFile.value = null;
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      isUploading.value = false;
    }
  };

  return (
    <div class="max-w-2xl mx-auto p-6">
      <div class="space-y-6">
        {/* File Upload Section */}
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">Upload Files</h2>
          
          {/* Drop Zone */}
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              onChange={handleFileSelect}
              class="hidden"
              id="fileInput"
            />
            <label
              for="fileInput"
              class="cursor-pointer"
            >
              <div class="space-y-4">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="text-gray-600">
                  <span class="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p class="text-xs text-gray-500">
                  Any file up to 10MB
                </p>
              </div>
            </label>
          </div>

          {/* Selected File Info */}
          {selectedFile.value && (
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span class="text-sm text-gray-700">
                    {selectedFile.value.name}
                  </span>
                </div>
                <button
                  onClick={() => selectedFile.value = null}
                  class="text-red-500 hover:text-red-700"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile.value || isUploading.value}
            class={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
              !selectedFile.value || isUploading.value
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading.value ? (
              <span class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload File"
            )}
          </button>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.value.length > 0 && (
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Uploaded Files
            </h3>
            <ul class="divide-y divide-gray-200">
              {uploadedFiles.value.map((file) => (
                <li class="py-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <svg
                      class="w-6 h-6 text-gray-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span class="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}