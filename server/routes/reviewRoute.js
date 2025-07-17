import express from 'express';
import {
  createReview,
  getReviewsByBook,
  addReply,
  deleteReview,

} from '../controllers/reviewController.js';
import {protect} from '../middleware/auth.js'; // Import protect middleware

const router = express.Router();

// All routes protected
router.post('/:bookId', protect, createReview);
router.get('/:bookId', protect, getReviewsByBook);
router.post('/reply/:reviewId', protect, addReply);
router.delete('/:reviewId', protect, deleteReview);
//router.delete('/reply/:reviewId/:replyId', protect  , deleteReply);

export default router;
