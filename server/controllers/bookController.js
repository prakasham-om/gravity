import Book from '../models/Book.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Get all books with filtering, sorting, and pagination


// Create a new book
export const createBook = catchAsync(async (req, res, next) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      book,
    },
  });
});



export const getAllBooks = catchAsync(async (req, res, next) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => delete queryObj[field]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Book.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const books = await query;
  const total = await Book.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    status: 'success',
    results: books.length,
    total,
    data: { books }
  });
});

// Get a single book with reviews
export const getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  const reviews = await Review.find({ book: book._id }).populate('user', 'name');

  res.status(200).json({
    status: 'success',
    data: { book, reviews }
  });
});

// Add a book to reading list
export const addToReadingList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { $addToSet: { readingList: req.params.bookId } },
    { new: true }
  ).populate('readingList');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Remove a book from reading list
export const removeFromReadingList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { $pull: { readingList: req.params.bookId } },
    { new: true }
  ).populate('readingList');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
