import React, { useState, useEffect } from 'react';
import { Plus, Book as BookIcon, ArrowLeft } from 'lucide-react';
import { BookForm } from './components/BookForm';
import { BookDetails } from './components/BookDetails';
import { BookList } from './components/BookList';
import { Book } from './types/Book';
import { bookApi } from './services/bookApi';

type View = 'list' | 'add' | 'details';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        imageUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        createdAt: '2024-01-20T14:20:00Z'
      }
    ];
    setBooks(mockBooks);
  }, []);

  const handleBookSubmit = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setCurrentView('list');
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('details');
  };

  const goBack = () => {
    setCurrentView('list');
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {currentView !== 'list' && (
                <button
                  onClick={goBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <BookIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Book Manager</h1>
              </div>
            </div>

            {currentView === 'list' && (
              <button
                onClick={() => setCurrentView('add')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                My Library ({books.length} books)
              </h2>
              <p className="text-gray-600">
                Manage your book collection with cover images and details.
              </p>
            </div>
            <BookList books={books} onBookSelect={handleBookSelect} />
          </div>
        )}

        {currentView === 'add' && (
          <BookForm onSubmit={handleBookSubmit} />
        )}

        {currentView === 'details' && selectedBook && (
          <BookDetails book={selectedBook} />
        )}
      </main>
    </div>
  );
}

export default App;