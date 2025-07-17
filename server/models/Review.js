// models/Review.js
import mongoose from 'mongoose';
import Book from './Book.js';

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const reviewTextSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  reviewTexts: [reviewTextSchema],
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.statics.calculateAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: stats[0].avgRating,
      ratingsCount: stats[0].nRating,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.book);
});

reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.book);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
