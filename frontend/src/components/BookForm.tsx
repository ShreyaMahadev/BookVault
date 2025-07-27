import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from 'lucide-react';
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

      let result;
      if (isEditing && initialData) {
        const bookId = (initialData as any)._id || initialData.id;
        result = await bookApi.updateBook(bookId, bookData);
      } else {
        result = await bookApi.createBook(bookData);
      }
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
    <div className="max-w-2xl mx-auto fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-6">
          <Upload className="h-12 w-12 text-gray-700" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h1>
        <p className="text-xl text-muted">
          {isEditing ? 'Update your book details' : 'Add a new book to your collection'}
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input-field w-full px-4 py-3 text-gray-900 placeholder-gray-500"
              placeholder="Enter the book title"
              required
            />
          </div>

          {/* Author Field */}
          <div className="space-y-2">
            <label htmlFor="author" className="block text-sm font-semibold text-gray-900">
              Author *
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="input-field w-full px-4 py-3 text-gray-900 placeholder-gray-500"
              placeholder="Enter the author's name"
              required
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Book Cover Image
            </label>
            
            {!previewUrl ? (
              <div
                className={`upload-area p-12 text-center transition-all duration-200 ${
                  dragActive ? 'active' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-gray-200 rounded-xl">
                    <Upload className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-900 mb-2">
                      <button
                        type="button"
                        className="font-semibold text-gray-900 hover:text-gray-700 underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Click to upload
                      </button>{' '}
                      or drag and drop
                    </p>
                    <p className="text-sm text-muted">PNG or JPG up to 2MB</p>
                  </div>
                </div>
                
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
                <div className="card p-6">
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="max-h-80 mx-auto rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-4 text-sm text-muted text-center">
                  {formData.coverImage?.name}
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Loader2 className="h-6 w-6 text-gray-600 animate-spin" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {uploadProgress < 100 ? 'Uploading cover image...' : 'Creating book...'}
                  </p>
                  <div className="progress-bar h-2">
                    <div
                      className="progress-fill transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted mt-1">{uploadProgress}% complete</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="status-error rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full flex items-center justify-center px-6 py-4 text-lg font-medium transition-all duration-200 ${
              isUploading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'btn-primary'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                {uploadProgress < 100 ? 'Uploading...' : 'Creating...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-3" />
                {isEditing ? 'Update Book' : 'Add to Library'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};