# Book Management Backend

## File Upload API (Cloudinary)

### Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Start the server:
   ```sh
   npm start
   ```

### API Endpoint
- `POST /api/books/upload-cover`
  - Form field: `cover` (file)
  - Accepts: JPG, PNG (max 5MB)
  - Returns: `{ url: "https://..." }`

### Notes
- Images are uploaded to Cloudinary under the `book_covers` folder.
- Local temp files are deleted after upload.
- Error responses include validation and upload errors.
