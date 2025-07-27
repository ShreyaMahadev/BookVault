import React from 'react';
import { Book, User, Calendar, ImageIcon, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { Book as BookType } from '../types/Book';

interface BookDetailsProps {
  book: BookType;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book, onDelete, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete && onDelete(book._id || book.id);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="btn-secondary px-4 py-2 mb-8 inline-flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Library</span>
      </button>

      <div className="card overflow-hidden">
        <div className="lg:flex">
          {/* Book Cover */}
          <div className="lg:w-2/5 bg-gray-50 flex items-center justify-center p-12">
            {book.imageUrl ? (
              <div className="relative group">
                <img
                  src={book.imageUrl}
                  alt={`Cover of ${book.title}`}
                  className="max-w-full max-h-96 rounded-xl shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-xl p-16 text-center">
                <div className="inline-flex p-4 bg-gray-300 rounded-xl mb-4">
                  <ImageIcon className="h-16 w-16 text-gray-500" />
                </div>
                <p className="text-gray-600 text-lg font-medium">No cover image</p>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="lg:w-3/5 p-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{book.title}</h1>
              
              <div className="flex items-center text-muted mb-6">
                <div className="p-2 bg-gray-100 rounded-xl mr-3">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-xl font-semibold">{book.author}</span>
              </div>

              <div className="flex items-center text-subtle mb-6">
                <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Added on {formatDate(book.createdAt)}</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {book.genre && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                    Genre: {book.genre}
                  </span>
                )}
                {book.publishedYear && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200">
                    Year: {book.publishedYear}
                  </span>
                )}
              </div>

              {book.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-xl mr-3">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Book ID</span>
                  </div>
                  <p className="text-gray-600 font-mono text-sm bg-white rounded-lg px-3 py-2 border">
                    {book.id || book._id}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-xl mr-3">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Cover Status</span>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg ${
                    book.imageUrl 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {book.imageUrl ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="btn-primary px-6 py-3 inline-flex items-center space-x-2"
                onClick={onEdit}
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};