import express from 'express';
import {
  getAllBooks,
  getBook,
  createBook, // <-- ✅ import createBook
  addToReadingList,
  removeFromReadingList
} from '../controllers/bookController.js';

import { protect } from '../controllers/authController.js'; // ✅ import protect middleware

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBook);


router.post('/', protect, createBook); // POST /api/books

router.post('/:bookId/reading-list', protect, addToReadingList);
router.delete('/:bookId/reading-list', protect, removeFromReadingList);

export default router;
