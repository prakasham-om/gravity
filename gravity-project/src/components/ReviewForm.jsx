import { useForm } from 'react-hook-form';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const ReviewForm = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (initialData) {
      reset({ reviewText: initialData.reviewText });
      setRating(initialData.rating);
    }
  }, [initialData]);

  const submitHandler = (data) => {
    const formData = { ...data, rating };
    if (initialData?._id) {
      onSubmit({ ...formData, _id: initialData._id }); // Update
    } else {
      onSubmit(formData); // Create
    }
    reset();
    setRating(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Review' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="reviewText" className="block text-gray-700 mb-2">
            Review
          </label>
          <textarea
            id="reviewText"
            {...register('reviewText', { maxLength: 1000 })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about this book..."
          ></textarea>
          {errors.reviewText && (
            <p className="text-red-500 text-sm mt-1">
              Review must be less than 1000 characters
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={rating === 0}
          className={`px-4 py-2 rounded-md text-white ${rating === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {initialData ? 'Update Review' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
