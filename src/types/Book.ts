export interface Book {
  id: string;
  _id?: string;
  title: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  coverImage?: File;
}

export interface UploadResponse {
  imageUrl: string;
}