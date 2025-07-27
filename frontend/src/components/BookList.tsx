import React from 'react';
import { Book as BookIcon, User, ImageIcon, Calendar } from 'lucide-react';
import { Book } from '../types/Book';

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onBookSelect }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-8 bg-gray-100 rounded-2xl mb-8">
          <BookIcon className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No books yet</h3>
        <p className="text-muted text-lg mb-8">Start building your digital library by adding your first book.</p>
        <a 
          href="/add" 
          className="btn-primary px-6 py-3 inline-flex items-center space-x-2"
        >
          <BookIcon className="h-5 w-5" />
          <span>Add Your First Book</span>
        </a>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <div
          key={book._id || book.id}
          className="card cursor-pointer overflow-hidden group"
          onClick={() => onBookSelect(book)}
        >
          {/* Book Cover */}
          <div className="h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-center p-6">
                <div className="inline-flex p-4 bg-gray-200 rounded-xl mb-3">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-subtle text-sm font-medium">No cover image</p>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight">
              {book.title}
            </h3>
            
            <div className="flex items-center text-muted mb-3">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{book.author}</span>
            </div>

            <div className="flex items-center text-subtle">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">
                Added {formatDate(book.createdAt)}
              </span>
            </div>

            {/* Additional info if available */}
            <div className="mt-4 flex flex-wrap gap-2">
              {book.genre && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                  {book.genre}
                </span>
              )}
              {book.publishedYear && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                  {book.publishedYear}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};