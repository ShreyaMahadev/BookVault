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
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {currentView !== 'list' && (
                <button
                  onClick={goBack}
                  className="mr-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BookIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">BookVault</h1>
              </div>
            </div>

            {currentView === 'list' && (
              <button
                onClick={() => setCurrentView('add')}
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 backdrop-blur-sm transition-all duration-300 glow-hover"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {currentView === 'list' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                My Library ({books.length} books)
              </h2>
              <p className="text-white/70 text-lg">
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