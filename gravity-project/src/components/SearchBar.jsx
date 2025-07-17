import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <label htmlFor="search" className="sr-only">
        Search books
      </label>
      <div className="relative rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-100 border border-gray-300 focus-within:border-indigo-500 focus-within:shadow-md transition-all">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search books..."
          className="w-full rounded-lg bg-transparent py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none sm:text-sm"
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </form>
  );
};

export default SearchBar;
