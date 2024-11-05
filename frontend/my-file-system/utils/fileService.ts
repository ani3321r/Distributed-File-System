export interface FileData {
  id: string;
  name: string;
}

const API_URL = 'http://localhost:3000';

export const fileService = {
  async uploadFile(file: File): Promise<FileData> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  async downloadFile(fileId: string, fileName: string): Promise<void> {
    const response = await fetch(`${API_URL}/files/${fileId}`);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};