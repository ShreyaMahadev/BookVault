

# 📚 BookVault - Full Stack Book Management Application


![Colorful Book Illustration](https://cdn-icons-png.flaticon.com/512/167/167755.png)

## Overview
BookVault is a modern full-stack application for managing your personal library. Easily add, edit, view, and delete books with cover images. All book data is stored in MongoDB Atlas, and cover images are securely uploaded to Cloudinary.

---

## Features
- 📝 Add, edit, and delete books
- 📷 Upload and preview book cover images
- 🗂️ View your library with beautiful UI
- 🔍 See book details, including cover, author, and date added
- ☁️ Images stored in Cloudinary, data in MongoDB Atlas
- 🛡️ File validation (JPG/PNG, max 2MB)
- 🚦 Progress indicators and error handling
- 🧪 Backend API and frontend UI tests

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, MongoDB Atlas, Cloudinary
- **Other:** Multer (file upload), dotenv

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ShreyaMahadev/Full-Stack_Book_Management_Application.git
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file with your MongoDB and Cloudinary credentials:
  ```env
  MONGO_URI=your_mongodb_atlas_uri
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ```
- Start the backend:
  ```bash
  npm start
  ```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## Usage
- Go to `http://localhost:5173` in your browser.
- Add books with cover images.
- View, edit, and delete books in your library.

---

## API Endpoints
- `POST /api/books/upload-cover` - Upload book cover image
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID

---

## Seeding Example Books
To seed demo books:
```bash
cd backend
node seedBooks.js
```

---

## Testing
- Backend: See `backend/tests/` for API tests
- Frontend: Manual UI testing recommended

---

## Deployment
- Deploy backend to Heroku, Render, or AWS
- Deploy frontend to Vercel or Netlify
- Ensure environment variables are set in production

---

## License
MIT

---

## Author
Made with ❤️ by Shreya Mahadev

---

## Icons
- [Book icon by Freepik - Flaticon](https://www.flaticon.com/free-icons/book)
