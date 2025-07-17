import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AddBook = () => {
  const { addBook } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'Fiction',
    publishedYear: '',
    coverImage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(formData);
      setFormData({
        title: '',
        author: '',
        description: '',
        genre: 'Fiction',
        publishedYear: '',
        coverImage: '',
      });
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 px-6 py-8 bg-cream-100 rounded-[20px] shadow-soft shadow-[rgba(0,0,0,0.1)] font-serif" style={{ backgroundColor: '#FAF9F6' }}>
      <h2 className="text-3xl font-bold mb-6 tracking-wide text-gray-700" style={{ fontFamily: "'Merriweather', serif" }}>
        <span role="img" aria-label="books" className="mr-2">📚</span> Add New Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Title <span className="text-amber-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="E.g. The Great Gatsby"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 placeholder:italic
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ lineHeight: '1.5', fontSize: '16px' }}
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Author <span className="text-amber-500">*</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="E.g. F. Scott Fitzgerald"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 placeholder:italic
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ lineHeight: '1.5', fontSize: '16px' }}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Brief description..."
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 placeholder:italic resize-none
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ lineHeight: '1.6', fontSize: '15px' }}
          />
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ fontSize: '16px' }}
          >
            {[
              'Fiction',
              'Non-Fiction',
              'Science Fiction',
              'Fantasy',
              'Mystery',
              'Thriller',
              'Romance',
              'Biography',
              'History',
              'Self-Help',
              'Poetry',
              'Drama',
            ].map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Published Year */}
        <div>
          <label htmlFor="publishedYear" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Published Year
          </label>
          <input
            id="publishedYear"
            name="publishedYear"
            type="number"
            placeholder="e.g. 1925"
            value={formData.publishedYear}
            onChange={handleChange}
            min="0"
            max={new Date().getFullYear()}
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 placeholder:italic
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <label htmlFor="coverImage" className="block mb-1 text-sm font-medium text-gray-600 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Cover Image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full rounded-[12px] border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 placeholder:italic
              focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-shadow transition-colors shadow-inner"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-[20px] bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 font-semibold
            shadow-md hover:from-amber-500 hover:to-amber-700 hover:shadow-lg active:scale-[0.97] transition-all tracking-wide"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          ➕ Add Book
        </button>
      </form>
    </section>
  );
};

export default AddBook;
