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
      <div className="text-center py-20">
        <div className="inline-flex p-6 glass rounded-3xl mb-6 float">
          <BookIcon className="h-20 w-20 text-white/60" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No books yet</h3>
        <p className="text-white/70 text-lg">Add your first book to start building your digital library.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {books.map((book) => (
        <div
          key={book.id}
          className="glass rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group glow-hover transform hover:scale-105"
          onClick={() => onBookSelect(book)}
        >
          {/* Book Cover */}
          <div className="h-64 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
            {book.imageUrl ? (
              <>
                <img
                  src={book.imageUrl}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="text-center p-6">
                <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-3">
                  <ImageIcon className="h-12 w-12 text-white/60" />
                </div>
                <p className="text-white/60 text-sm font-medium">No cover</p>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-6">
            <h3 className="font-bold text-white mb-2 line-clamp-2 text-lg tracking-tight leading-tight">
              {book.title}
            </h3>
            <div className="flex items-center text-white/70 mb-3">
              <div className="p-1 bg-white/10 rounded-lg mr-2">
                <User className="h-3 w-3" />
              </div>
              <span className="text-sm font-medium">{book.author}</span>
            </div>
            <p className="text-xs text-white/50 font-medium">
              {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};