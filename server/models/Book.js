import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  genre: {
    type: String,
    enum: [
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
      'Mystery', 'Thriller', 'Romance', 'Biography', 
      'History', 'Self-Help', 'Poetry', 'Drama'
    ],
    required: true
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year seems invalid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  ratingsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// ✅ ES Module export
const Book = mongoose.model('Book', bookSchema);
export default Book;
