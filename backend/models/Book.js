import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: Number,
  genre: String,
  description: String,
  imageUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
