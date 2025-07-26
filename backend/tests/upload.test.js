import request from 'supertest';
import app from '../index.js';
import path from 'path';

describe('POST /api/books/upload-cover', () => {
  it('should upload a valid image and return a URL', async () => {
    const res = await request(app)
      .post('/api/books/upload-cover')
      .attach('cover', path.join(__dirname, 'test-image.jpg'));
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
  });

  it('should reject invalid file type', async () => {
    const res = await request(app)
      .post('/api/books/upload-cover')
      .attach('cover', path.join(__dirname, 'test.txt'));
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Only JPG and PNG images are allowed/);
  });
});
