import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch }) {
  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="search-container">
          <input 
            type="text" 
            className="form-control search-bar"
            placeholder="🔍 Search trending videos by keyword..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
