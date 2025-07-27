export interface Book {
  id: string;
  _id?: string;
  title: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
  genre?: string;
  description?: string;
  publishedYear?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  coverImage?: File;
}

export interface UploadResponse {
  imageUrl: string;
}