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
    <div className="max-w-2xl mx-auto glass rounded-3xl shadow-2xl p-8 float">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h2>
        <p className="text-white/70">Share your literary discoveries</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Field */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-white/90">
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-4 input-modern rounded-2xl text-gray-800 placeholder-gray-500 font-medium"
            placeholder="Enter the book title"
            required
          />
        </div>

        {/* Author Field */}
        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-semibold text-white/90">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-4 py-4 input-modern rounded-2xl text-gray-800 placeholder-gray-500 font-medium"
            placeholder="Enter the author's name"
            required
          />
        </div>

        {/* File Upload Area */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white/90">
            Book Cover Image
          </label>
          
          {!previewUrl ? (
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-white/60 bg-white/10 scale-105'
                  : 'border-white/30 hover:border-white/50 hover:bg-white/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="inline-flex p-4 bg-white/10 rounded-2xl">
                  <Upload className="h-12 w-12 text-white/80" />
                </div>
                <div>
                  <p className="text-lg text-white/90 mb-2">
                    <button
                      type="button"
                      className="font-semibold text-white hover:text-white/80 underline decoration-2 underline-offset-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Click to upload
                    </button>{' '}
                    or drag and drop
                  </p>
                  <p className="text-sm text-white/60">PNG or JPG up to 2MB</p>
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
              <div className="relative glass-dark rounded-3xl p-6 glow">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="max-h-80 mx-auto rounded-2xl shadow-2xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-sm text-white/70 text-center font-medium">
                {formData.coverImage?.name}
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-white mb-2">
                  {uploadProgress < 100 ? 'Uploading your cover...' : 'Creating your book...'}
                </p>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-white/60 mt-1">{uploadProgress}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 flex items-start space-x-3 backdrop-blur-sm">
            <div className="p-1 bg-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-red-200 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold transition-all duration-300 ${
            isUploading
              ? 'bg-gray-500/50 cursor-not-allowed text-white/50'
              : 'btn-primary text-white hover:shadow-2xl transform hover:scale-[1.02]'
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
  );
};