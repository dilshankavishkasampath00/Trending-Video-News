import React from 'react';
import '../styles/Header.css';

function Header({ selectedCountry, onCountryChange }) {
  return (
    <nav className="navbar navbar-dark navbar-custom sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          📺 Trending Video News
        </a>
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm country-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="US">United States</option>
            <option value="IN">India</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Header;
