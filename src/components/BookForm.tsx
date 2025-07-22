import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { bookApi } from '../services/bookApi';
import { BookFormData } from '../types/Book';

interface BookFormProps {
  onSubmit: (book: any) => void;
  initialData?: BookFormData;
  isEditing?: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    coverImage: initialData?.coverImage
  });
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPG or PNG only)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 2MB';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setFormData(prev => ({ ...prev, coverImage: file }));
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: undefined }));
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      let imageUrl = '';
      
      if (formData.coverImage) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const uploadResponse = await bookApi.uploadCover(formData.coverImage);
        imageUrl = uploadResponse.imageUrl;
        
        clearInterval(progressInterval);
        setUploadProgress(100);
      }

      // Create or update book
      const bookData = {
        title: formData.title,
        author: formData.author,
        imageUrl: imageUrl || undefined
      };

      const result = await bookApi.createBook(bookData);
      onSubmit(result);

      // Reset form
      setFormData({ title: '', author: '' });
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter book title"
            required
          />
        </div>

        {/* Author Field */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter author name"
            required
          />
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Cover Image
          </label>
          
          {!previewUrl ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG or JPG up to 2MB</p>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            <div className="relative">
              <div className="relative bg-gray-100 rounded-lg p-4">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 text-center">
                {formData.coverImage?.name}
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  {uploadProgress < 100 ? 'Uploading image...' : 'Creating book...'}
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
            isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadProgress < 100 ? 'Uploading...' : 'Creating...'}
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Book' : 'Add Book'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};