import React from 'react';
import { Book, User, Calendar, ImageIcon, Trash2 } from 'lucide-react';
import { Book as BookType } from '../types/Book';

interface BookDetailsProps {
  book: BookType;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book, onDelete, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  return (
    <div className="max-w-5xl mx-auto glass rounded-3xl shadow-2xl overflow-hidden float">
      <div className="lg:flex">
        {/* Book Cover */}
        <div className="lg:w-2/5 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center p-12">
          {book.imageUrl ? (
            <div className="relative group">
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                className="max-w-full max-h-96 rounded-2xl shadow-2xl object-cover glow transform group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="glass-dark rounded-2xl p-16 text-center">
              <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-4">
                <ImageIcon className="h-16 w-16 text-white/60" />
              </div>
              <p className="text-white/60 text-lg font-medium">No cover image</p>
            </div>
          )}
        </div>

        {/* Book Information */}
        <div className="lg:w-3/5 p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">{book.title}</h1>
            <div className="flex items-center text-white/80 mb-6">
              <div className="p-2 bg-white/10 rounded-xl mr-3">
                <User className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold">{book.author}</span>
            </div>
            <div className="flex items-center text-white/60">
              <div className="p-1.5 bg-white/10 rounded-lg mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Added on {formatDate(book.createdAt)}</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-white/20 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-xl mr-3">
                    <Book className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="font-semibold text-white/90">Book ID</span>
                </div>
                <p className="mt-3 text-white/70 font-mono text-sm bg-white/10 rounded-lg px-3 py-2">{book.id}</p>
              </div>
              
              <div className="glass-dark rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/20 rounded-xl mr-3">
                    <ImageIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="font-semibold text-white/90">Cover Status</span>
                </div>
                <p className="mt-3">
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-xl ${
                    book.imageUrl 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                  }`}>
                    {book.imageUrl ? 'Available' : 'Not Available'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              className="btn-primary px-8 py-3 rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300"
              onClick={onEdit}
            >
              Edit Book
            </button>
            <button
              className="glass-dark text-white/80 px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20 flex items-center"
              onClick={handleDelete}
            >
              <Trash2 className="h-5 w-5 mr-2" /> Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};