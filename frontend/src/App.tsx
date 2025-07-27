import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Plus, Book as BookIcon, Home } from 'lucide-react';
import { BookForm } from './components/BookForm';
import { BookDetails } from './components/BookDetails';
import { BookList } from './components/BookList';
import { Book } from './types/Book';
import { bookApi } from './services/bookApi';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    setError('');
    bookApi.getAllBooks()
      .then(data => setBooks(data))
      .catch(() => setError('Failed to load books.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleBookSubmit = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
  };

  return (
    <Router>
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
                <a href="/" className="inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <Home className="h-5 w-5 mr-2" /> Home
                </a>
                <a href="/library" className="inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <BookIcon className="h-5 w-5 mr-2" /> Library
                </a>
                <a href="/add" className="inline-flex items-center px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" /> Add Book
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-24">
                <div className="inline-flex p-8 glass rounded-3xl mb-8 float">
                  <BookIcon className="h-24 w-24 text-white/70" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Welcome to BookVault</h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                  Your personal book management application. Add, view, and organize your book collection with beautiful cover images and details. Powered by MongoDB Atlas and Cloudinary.
                </p>
                <div className="flex justify-center space-x-6">
                  <a href="/library" className="btn-primary px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transform hover:scale-105 transition-all duration-300">Go to Library</a>
                  <a href="/add" className="glass-dark text-white/80 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-white/20">Add a Book</a>
                </div>
              </div>
            } />
            <Route path="/library" element={
              <div>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">My Library ({books.length} books)</h2>
                  <p className="text-white/70 text-lg">Manage your book collection with cover images and details.</p>
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
                  <BookList books={books} onBookSelect={book => window.location.href = `/details/${book._id || book.id}`} />
                )}
              </div>
            } />
            <Route path="/add" element={<BookForm onSubmit={handleBookSubmit} />} />
            <Route path="/details/:id" element={<BookDetails book={selectedBook || {}} />} />
            <Route path="/edit/:id" element={<BookForm onSubmit={handleBookSubmit} isEditing={true} initialData={selectedBook || {}} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}



export default App;