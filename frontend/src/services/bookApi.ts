import axios from 'axios';
import { Book, BookFormData, UploadResponse } from '../types/Book';

const API_BASE_URL = '/api';

export const bookApi = {
  async uploadCover(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('cover', file);
    
    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}/books/upload-cover`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  async createBook(bookData: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
    const response = await axios.post<Book>(`${API_BASE_URL}/books`, bookData);
    return response.data;
  },

  async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
    const response = await axios.put<Book>(`${API_BASE_URL}/books/${id}`, bookData);
    return response.data;
  },

  async getBook(id: string): Promise<Book> {
    const response = await axios.get<Book>(`${API_BASE_URL}/books/${id}`);
    return response.data;
  },

  async getAllBooks(): Promise<Book[]> {
    const response = await axios.get<Book[]>(`${API_BASE_URL}/books`);
    return response.data;
  },

  async deleteBook(id: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_BASE_URL}/books/${id}`);
    return response.data;
  }
};