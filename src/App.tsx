import React, { useState, useEffect } from 'react';
import { Plus, Book as BookIcon, ArrowLeft, Home } from 'lucide-react';
import { BookForm } from './components/BookForm';
import { BookDetails } from './components/BookDetails';
import { BookList } from './components/BookList';
import { Book } from './types/Book';
import { bookApi } from './services/bookApi';

type View = 'home' | 'list' | 'add' | 'details' | 'edit';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (currentView === 'list' || currentView === 'home') {
      setIsLoading(true);
      setError('');
      bookApi.getAllBooks()
        .then(data => setBooks(data))
        .catch(() => setError('Failed to load books.'))
        .finally(() => setIsLoading(false));
    }
  }, [currentView]);

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
      {/* Header & Navigation */}
      <header className="glass sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">BookVault</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => { setCurrentView('home'); setSelectedBook(null); }}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 ${currentView === 'home' ? 'bg-white/10 text-white' : ''}`}
              >
                <Home className="h-5 w-5 mr-2" /> Home
              </button>
              <button
                onClick={() => { setCurrentView('list'); setSelectedBook(null); }}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 ${currentView === 'list' ? 'bg-white/10 text-white' : ''}`}
              >
                <BookIcon className="h-5 w-5 mr-2" /> Library
              </button>
              <button
                onClick={() => setCurrentView('add')}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 ${currentView === 'add' ? 'bg-white/10 text-white' : ''}`}
              >
                <Plus className="h-5 w-5 mr-2" /> Add Book
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {currentView === 'home' && (
          <div className="text-center py-24">
            <div className="inline-flex p-8 glass rounded-3xl mb-8 float">
              <BookIcon className="h-24 w-24 text-white/70" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Welcome to BookVault</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Your personal book management application. Add, view, and organize your book collection with beautiful cover images and details. Powered by MongoDB Atlas and Cloudinary.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setCurrentView('list')}
                className="btn-primary px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Go to Library
              </button>
              <button
                onClick={() => setCurrentView('add')}
                className="glass-dark text-white/80 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-white/20"
              >
                Add a Book
              </button>
            </div>
          </div>
        )}

        {currentView === 'list' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                My Library ({books.length} books)
              </h2>
              <p className="text-white/70 text-lg">
                Manage your book collection with cover images and details.
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-flex p-6 glass rounded-3xl mb-6 float animate-spin">
                  <BookIcon className="h-20 w-20 text-white/60" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Loading books...</h3>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="inline-flex p-6 glass rounded-3xl mb-6 float">
                  <BookIcon className="h-20 w-20 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-3 tracking-tight">{error}</h3>
              </div>
            ) : (
              <BookList books={books} onBookSelect={handleBookSelect} />
            )}
          </div>
        )}

        {currentView === 'add' && (
          <BookForm onSubmit={handleBookSubmit} />
        )}

        {currentView === 'details' && selectedBook && (
          <BookDetails
            book={selectedBook}
            onDelete={async (_idOrId: string) => {
              try {
                await bookApi.deleteBook(_idOrId);
                setBooks(prev => prev.filter(b => (b._id || b.id) !== _idOrId));
                setCurrentView('list');
                setSelectedBook(null);
              } catch {
                alert('Failed to delete book.');
              }
            }}
            onEdit={() => setCurrentView('edit')}
          />
        )}

        {currentView === 'edit' && selectedBook && (
          <BookForm
            onSubmit={async (updatedBook: Book) => {
              setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
              setSelectedBook(updatedBook);
              setCurrentView('details');
            }}
            initialData={selectedBook}
            isEditing={true}
          />
        )}
      </main>
    </div>
  );
}

export default App;