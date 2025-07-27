import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Book from './models/Book.js';
dotenv.config();

const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/to-kill-a-mockingbird.jpg',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/pride-and-prejudice.jpg',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/the-great-gatsby.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://res.cloudinary.com/demo/image/upload/v1690000000/1984.jpg',
  },
];

async function seedBooks() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  for (const book of books) {
    // If you want to upload images to your own Cloudinary, use cloudinary.uploader.upload
    // For demo, we use public demo images
    await Book.create({
      title: book.title,
      author: book.author,
      imageUrl: book.coverUrl,
      createdAt: new Date().toISOString(),
    });
    console.log(`Seeded: ${book.title}`);
  }

  mongoose.disconnect();
  console.log('Seeding complete');
}

seedBooks();
