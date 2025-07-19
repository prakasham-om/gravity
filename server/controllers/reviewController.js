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
    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: 'Reply text required' });

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const reply = { text, user: req.user._id };
    review.replies.push(reply);
    await review.save();

    const populatedReview = await Review.findById(reviewId).populate('replies.user');

    // Emit to all clients
    req.io.emit('new-reply', {
      reviewId,
      reply: populatedReview.replies.at(-1)
    });

    res.status(201).json({ message: 'Reply added', reply: populatedReview.replies.at(-1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
