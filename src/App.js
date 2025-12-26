import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';

function App() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyCodTPzzRbXcLbOnEMdFMozowirX8opN-8';
  const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

  // Fetch trending videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${YOUTUBE_API_URL}/videos`, {
          params: {
            key: API_KEY,
            part: 'snippet,statistics',
            chart: 'mostPopular',
            regionCode: selectedCountry,
            maxResults: 50,
            fields: 'items(id,snippet(title,thumbnails,channelTitle,publishedAt),statistics(viewCount))'
          }
        });

        const processedVideos = response.data.items.map(item => ({
          videoId: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
          viewCount: item.statistics.viewCount,
          category: detectCategory(item.snippet.title)
        }));

        setVideos(processedVideos);
        applyFilters(processedVideos, selectedCategory, searchTerm);
      } catch (err) {
        console.error('Error details:', err);
        let errorMsg = 'Failed to fetch videos. ';
        
        if (err.response?.status === 403) {
          errorMsg += 'API quota exceeded or API key invalid.';
        } else if (err.response?.status === 400) {
          errorMsg += 'Invalid request parameters.';
        } else if (err.code === 'ERR_NETWORK') {
          errorMsg += 'Network error. Check your internet connection.';
        } else {
          errorMsg += 'Please check your API key and try again.';
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCountry, selectedCategory, searchTerm]);

  // Detect category based on title
  const detectCategory = (title) => {
    const titleLower = title.toLowerCase();
    const categoryKeywords = {
      news: ['news', 'breaking', 'report', 'incident'],
      technology: ['tech', 'software', 'ai', 'coding', 'gadget', 'app'],
      sports: ['sports', 'football', 'cricket', 'basketball', 'match', 'league'],
      entertainment: ['movie', 'music', 'song', 'actor', 'celebrity', 'comedy']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return category;
      }
    }
    return 'all';
  };

  // Apply filters
  const applyFilters = (videoList, category, search) => {
    let filtered = videoList;

    if (category !== 'all') {
      filtered = filtered.filter(v => v.category === category);
    }

    if (search) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.channelTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(videos, category, searchTerm);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(videos, selectedCategory, term);
  };

  // Handle country change
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div className="App">
      <Header selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
      <div className="container-fluid mt-4">
        <SearchBar onSearch={handleSearch} />
        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        
        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && <VideoGrid videos={filteredVideos} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
