import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, Book as BookIcon, Home, Library } from 'lucide-react';
import { BookForm } from './components/BookForm';
import { BookDetails } from './components/BookDetails';
import { BookList } from './components/BookList';
import { Book } from './types/Book';
import { bookApi } from './services/bookApi';
import { useParams, useNavigate } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-main">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gray-900 rounded-xl">
              <BookIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">BookVault</h1>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Link 
              to="/" 
              className={`nav-link px-4 py-2 flex items-center space-x-2 ${isActive('/') ? 'active' : ''}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/library" 
              className={`nav-link px-4 py-2 flex items-center space-x-2 ${isActive('/library') ? 'active' : ''}`}
            >
              <Library className="h-4 w-4" />
              <span>Library</span>
            </Link>
            <Link 
              to="/add" 
              className={`nav-link px-4 py-2 flex items-center space-x-2 ${isActive('/add') ? 'active' : ''}`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="section-spacing">
      <div className="container-main">
        <div className="text-center max-w-4xl mx-auto fade-in">
          <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-8">
            <BookIcon className="h-16 w-16 text-gray-700" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <br />
            <span className="text-gray-600">Book Collection</span>
          </h1>
          <p className="text-xl text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
            Organize, manage, and showcase your book library with beautiful cover images 
            and detailed information. Built with modern technology for book lovers.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/library" 
              className="btn-primary px-8 py-4 text-lg font-medium inline-flex items-center space-x-2"
            >
              <Library className="h-5 w-5" />
              <span>Browse Library</span>
            </Link>
            <Link 
              to="/add" 
              className="btn-secondary px-8 py-4 text-lg font-medium inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Book</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    setError('');
    bookApi.getAllBooks()
      .then(data => {
        // Sort by createdAt descending (recent first)
        const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBooks(sorted);
      })
      .catch(() => setError('Failed to load books.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleBookSelect = (book: Book) => {
    window.location.href = `/details/${book._id || book.id}`;
  };

  return (
    <div className="section-spacing">
      <div className="container-main">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Library</h1>
          <p className="text-xl text-muted">
            {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-gray-100 rounded-2xl mb-6">
              <BookIcon className="h-12 w-12 text-gray-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading your books...</h3>
            <p className="text-muted">Please wait while we fetch your collection</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-red-50 rounded-2xl mb-6">
              <BookIcon className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Books</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="slide-up">
            <BookList books={books} onBookSelect={handleBookSelect} />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const handleBookSubmit = (newBook: Book) => {
    // Handle book submission
    console.log('Book submitted:', newBook);
  };

  // Book details page with fetch by ID
  function BookDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    useEffect(() => {
      if (id) {
        bookApi.getBook(id).then(setBook);
      }
    }, [id]);
    const navigate = useNavigate();
    const handleEdit = () => {
      navigate(`/edit/${id}`);
    };
    if (!book) return <div>Loading...</div>;
    return <BookDetails book={book} onEdit={handleEdit} />;
  }

  // Book edit page with fetch by ID
  function BookEditPage() {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    useEffect(() => {
      if (id) {
        bookApi.getBook(id).then(setBook);
      }
    }, [id]);
    if (!book) return <div>Loading...</div>;
    return <BookForm onSubmit={handleBookSubmit} isEditing={true} initialData={book} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/add" element={
              <div className="section-spacing">
                <div className="container-main">
                  <BookForm onSubmit={handleBookSubmit} />
                </div>
              </div>
            } />
            <Route path="/details/:id" element={<BookDetailsPage />} />
            <Route path="/edit/:id" element={<BookEditPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;