import React, { createContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter , setRatingFilter] = useState('')

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm ,ratingFilter,setRatingFilter}}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
