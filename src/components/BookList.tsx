import React from 'react';
import { Book as BookIcon, User, ImageIcon } from 'lucide-react';
import { Book } from '../types/Book';

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onBookSelect }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
        <p className="text-gray-500">Add your first book to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          onClick={() => onBookSelect(book)}
        >
          {/* Book Cover */}
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No cover</p>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {book.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">{book.author}</span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};