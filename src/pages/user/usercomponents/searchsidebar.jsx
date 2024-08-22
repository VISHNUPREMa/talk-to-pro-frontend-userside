import React, { useState, useContext } from 'react';
import '../../../style/sidebar.css';
import SearchContext from '../context/searchContext';

const SearchSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {  setSearchTerm, setRatingFilter } = useContext(SearchContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;
    
    if (name === 'category') {
      setSearchTerm(checked ? value : '');
    } else if (name === 'ratings') {
      // Add or remove the rating from the filter array
      if (checked) {
        setRatingFilter(value);
      }
    }
  };

  return (
    <div id="mySidebar" className={`sidebar ${isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <label>
          <input 
            type="radio" 
            name="category" 
            value="engineer" 
            onChange={handleCheckboxChange} 
          />
          ENGINEERS
        </label>
        <label>
          <input 
            type="radio" 
            name="category" 
            value="farmer"  
            onChange={handleCheckboxChange}  
          />
          FARMERS
        </label>
        <label>
          <input 
            type="radio" 
            name="category" 
            value="lawyer"  
            onChange={handleCheckboxChange} 
          />
          LAWYERS
        </label>
      </div>

      <div className="filter-section">
  <h4>Ratings</h4>
  <label>
    <input 
      type="radio" 
      name="ratings" 
      value="4" 
      onChange={handleCheckboxChange} 
    />
    4 Stars & Up
  </label>
  <label>
    <input 
      type="radio" 
      name="ratings" 
      value="3" 
      onChange={handleCheckboxChange} 
    />
    3 Stars & Up
  </label>
  <label>
    <input 
      type="radio" 
      name="ratings" 
      value="2" 
      onChange={handleCheckboxChange} 
    />
    2 Stars & Up
  </label>
</div>


    </div>
  );
};

export default SearchSidebar;
