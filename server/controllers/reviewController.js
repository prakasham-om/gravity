import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
export const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, reviewText } = req.body;
    console.log('Creating review:', { bookId, rating, reviewText });

    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      reviewTexts: [{ text: reviewText }],
    });

    const io = req.app.get('io');
    io.emit('newReview', review); 

    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this book.' });
    }
    res.status(500).json({ message: err.message });
  }
};
export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name email')
      .populate('reviewTexts.replies.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addReply = async (req, res) => {
  try {
    const { reviewId, reviewTextId } = req.params; // also pass reviewTextId
    const { text } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const reviewTextEntry = review.reviewTexts.id(reviewTextId);
    if (!reviewTextEntry) return res.status(404).json({ message: 'Review text not found' });

    const reply = { user: req.user._id, text };
    reviewTextEntry.replies.push(reply);
    await review.save();

    const io = req.app.get('io');
    io.emit('newReply', { reviewId, reviewTextId, reply });

    res.status(201).json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    const io = req.app.get('io');
    io.emit('deletedReview', { reviewId });

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
