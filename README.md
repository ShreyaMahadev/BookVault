# 📚 Full-Stack Book Management Application (BookVault) 📚

A full-stack web app for your personal library! Add, view, edit, and browse books with beautiful cover images. Built with React 🧁 (frontend) and Node.js/Express/MongoDB 🍃 (backend). Book covers are uploaded and stored using Cloudinary ☁️.  

Check out the live project here : **[BookVault](https://bookvault-2.onrender.com/)**

---

## 🗂️ Folder Structure

```
Full-Stack_Book_Management_Application/
│
├── backend/        Server-side magic
│   ├── models/           # Mongoose models (Book.js)
│   ├── routes/           # Express routes (books.js)
│   ├── seedBooks.js      # Seed script for demo books
│   ├── index.js          # Express app entry point
│   ├── package.json      # Backend dependencies & scripts
│   └── ...               # Other backend files
│
├── frontend/        Client-side cuteness
│   ├── src/
│   │   ├── components/   # React components (BookList, BookForm, BookDetails, etc.)
│   │   ├── services/     # API service (bookApi.ts)
│   │   ├── types/        # TypeScript types (Book.ts)
│   │   ├── App.tsx       # Main React app
│   │   └── ...           # Other frontend files
│   ├── vite.config.ts    # Vite config (with proxy for API)
│   ├── package.json      # Frontend dependencies & scripts
│   └── ...               # Other frontend files
│
└── README.md       📝 Project documentation
```

---

## Features

- **Add Book:**  
  - Title, author, and cover image are required.
  - Cover image is uploaded to Cloudinary via `/api/books/upload-cover`.
  - Success modal shown after adding.

- **Edit Book:**  
  - Update book details and cover image.
  - Success modal shown after updating.
  - Redirects to library after operation.

- **View Book:**  
  - See book details including cover image.

- **Library Page:**  
  - Displays all books with cover images.
  - Books are sorted by most recently added first.

- **Image Upload:**  
  - Only JPG/PNG images under 2MB allowed.
  - Error handling for invalid files and upload failures.

- **Backend:**  
  - REST API for books.
  - MongoDB for data storage.
  - Cloudinary for image storage.

- **Frontend:**  
  - React with TypeScript.
  - Vite for fast development.
  - Responsive UI.

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

- Configure your `.env` file with MongoDB and Cloudinary credentials.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Vite proxy forwards `/api` requests to backend.

---

## API Endpoints

- `GET /api/books` — List all books
- `GET /api/books/:id` — Get book by ID
- `POST /api/books` — Add new book
- `PUT /api/books/:id` — Update book
- `POST /api/books/upload-cover` — Upload book cover image

---

## Environment Variables

**Backend (.env):**
```
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## License

MIT

---

## Credits

Developed by ShreyaMahadev✨
## Credits

Developed by ShreyaMahadev✨
