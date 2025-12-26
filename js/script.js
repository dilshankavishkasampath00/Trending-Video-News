// YouTube Trending Video News - Frontend JavaScript

// Configuration
const API_ENDPOINT = 'backend/api.php'; // Backend endpoint
let selectedCategory = 'all';
let selectedCountry = 'US';
let allVideos = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadTrendingVideos();
});

// Setup Event Listeners
function setupEventListeners() {
    // Category filter
    document.querySelectorAll('.category-tabs .nav-link').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category-tabs .nav-link').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.getAttribute('data-category');
            filterVideos();
        });
    });

    // Country selector
    document.getElementById('countrySelect').addEventListener('change', function(e) {
        selectedCountry = e.target.value;
        loadTrendingVideos();
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        setTimeout(() => {
            filterVideos();
        }, 300);
    });
}

// Load Trending Videos from Backend
function loadTrendingVideos() {
    showLoadingSpinner(true);
    
    fetch(`${API_ENDPOINT}?action=trending&country=${selectedCountry}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allVideos = data.videos || [];
                displayVideos(allVideos);
            } else {
                showError(data.message || 'Failed to load videos');
            }
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            showError('Error connecting to server. Please try again.');
        })
        .finally(() => {
            showLoadingSpinner(false);
        });
}

// Filter videos based on category and search
function filterVideos() {
    let filtered = allVideos;

    // Apply category filter
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(video => 
            video.category && video.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(video =>
            video.title.toLowerCase().includes(searchTerm) ||
            video.channelTitle.toLowerCase().includes(searchTerm)
        );
    }

    displayVideos(filtered);
}

// Display Videos on the page
function displayVideos(videos) {
    const container = document.getElementById('videosContainer');
    container.innerHTML = '';

    if (videos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted mt-5"><p>No videos found. Try adjusting your filters.</p></div>';
        return;
    }

    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
}

// Create individual video card element
function createVideoCard(video) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6';

    const card = document.createElement('div');
    card.className = 'video-card';
    card.onclick = () => openVideo(video.videoId);

    const thumbnail = document.createElement('div');
    thumbnail.className = 'video-thumbnail';
    thumbnail.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="play-icon">▶</div>
    `;

    const info = document.createElement('div');
    info.className = 'video-info';

    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = video.title;

    const channelInfo = document.createElement('div');
    channelInfo.className = 'channel-info';
    channelInfo.innerHTML = `<span class="channel-name">${video.channelTitle}</span>`;

    const stats = document.createElement('div');
    stats.className = 'video-stats';
    stats.innerHTML = `
        <div class="view-count">
            <span>👁️</span>
            <span>${formatViewCount(video.viewCount)}</span>
        </div>
        <div class="publish-date">${formatDate(video.publishedAt)}</div>
    `;

    info.appendChild(title);
    info.appendChild(channelInfo);
    info.appendChild(stats);

    card.appendChild(thumbnail);
    card.appendChild(info);

    col.appendChild(card);
    return col;
}

// Open video in YouTube
function openVideo(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// Format view count
function formatViewCount(views) {
    const num = parseInt(views);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

// Show/Hide loading spinner
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    const container = document.getElementById('videosContainer');
    container.innerHTML = `
        <div class="col-12 alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>
    `;
}

// Refresh data every 5 minutes
setInterval(() => {
    loadTrendingVideos();
}, 5 * 60 * 1000);
