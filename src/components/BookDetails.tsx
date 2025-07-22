import React from 'react';
import { Book, User, Calendar, ImageIcon } from 'lucide-react';
import { Book as BookType } from '../types/Book';

interface BookDetailsProps {
  book: BookType;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Book Cover */}
        <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="max-w-full max-h-96 rounded-lg shadow-md object-cover"
            />
          ) : (
            <div className="bg-gray-200 rounded-lg p-12 text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No cover image</p>
            </div>
          )}
        </div>

        {/* Book Information */}
        <div className="md:w-2/3 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <User className="h-5 w-5 mr-2" />
              <span className="text-lg">{book.author}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Added on {formatDate(book.createdAt)}</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Book className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-700">ID</span>
                </div>
                <p className="mt-1 text-gray-900 font-mono text-sm">{book.id}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-700">Cover Status</span>
                </div>
                <p className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    book.imageUrl 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {book.imageUrl ? 'Available' : 'Not Available'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Book
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};