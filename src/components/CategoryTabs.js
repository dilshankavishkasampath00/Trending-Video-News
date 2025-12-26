import React from 'react';
import '../styles/CategoryTabs.css';

function CategoryTabs({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'news', label: 'News' },
    { id: 'technology', label: 'Technology' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' }
  ];

  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <div className="category-tabs">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryTabs;
