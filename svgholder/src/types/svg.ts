export interface SvgItem {
  id: string;
  name: string;
  description: string;
  content: string;
  uploadDate: string;
  fileSize: number;
}

export interface SvgFormData {
  name: string;
  description: string;
  file: File | null;
}
