export interface EditResult {
  imageData: string; // Base64 string of the image
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  originalImage: string;
  prompt: string;
  resultImage: string;
  timestamp: number;
}
