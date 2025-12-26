# Trending Video News Website

A modern, real-time web application that displays trending YouTube videos in a category-based format with search functionality.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Features](#features)
- [Technologies](#technologies)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)

## 📁 Project Structure

```
trending-video-news/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Styling
├── js/
│   └── script.js           # Frontend JavaScript
├── backend/
│   └── api.php             # Backend API handler
├── images/                 # Asset folder
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites

- PHP 7.2 or higher
- Web Server (Apache, Nginx, or PHP built-in server)
- YouTube Data API v3 key
- Modern web browser

### Installation Steps

1. **Clone/Download the project**
   ```bash
   cd trending-video-news
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Add your YouTube API key**
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Open `backend/api.php`
   - Replace `$API_KEY = ''` with your actual API key

4. **Run the application**

   **Using PHP built-in server:**
   ```bash
   php -S localhost:8000
   ```
   Then open `http://localhost:8000` in your browser

   **Using Apache/Nginx:**
   - Point your document root to the `trending-video-news` directory
   - Access through your configured domain

## ⚙️ Configuration

### YouTube API Key Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create an API key in the Credentials section
5. Add the key to `backend/api.php`:
   ```php
   $API_KEY = 'YOUR_API_KEY_HERE';
   ```

### Supported Countries

- US (United States)
- IN (India)
- GB (United Kingdom)
- CA (Canada)
- AU (Australia)

Add more by editing the `$COUNTRY_CODES` array in `backend/api.php`

## ✨ Features

- 🔥 **Real-time Trending Videos**: Get the latest trending videos instantly
- 🗂 **Category Filtering**: Filter videos by News, Technology, Sports, and Entertainment
- 🔍 **Search Functionality**: Search for videos by keyword or channel name
- 📊 **Video Statistics**: View counts and publication dates
- 📱 **Mobile Responsive**: Works on all devices
- 🌍 **Multi-Country Support**: View trending videos from different regions
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and animations
- **JavaScript**: Interactive features and API communication
- **Bootstrap 5**: Responsive grid system

### Backend
- **PHP 7.2+**: Server-side logic
- **YouTube Data API v3**: Video data source
- **cURL/file_get_contents**: HTTP requests

### Data Format
- **JSON**: Data interchange format

## 📖 Usage

### Starting the Application

1. Open your browser to the application URL
2. Select your country from the dropdown
3. Browse trending videos or search by keyword
4. Click on any video card to watch on YouTube
5. Use category tabs to filter content

### API Endpoints

#### Get Trending Videos
```
GET /backend/api.php?action=trending&country=US
```

Response:
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "count": 50,
    "country": "US"
  }
}
```

#### Search Videos
```
GET /backend/api.php?action=search&q=technology
```

## 🔮 Future Enhancements

- [ ] User authentication and login system
- [ ] Personalized recommendations based on viewing history
- [ ] Integration with News API for text summaries
- [ ] Save/bookmark favorite videos
- [ ] Admin dashboard for content management
- [ ] Video comments and ratings
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Email notifications for trending videos
- [ ] Advanced analytics dashboard

## 🔐 Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate and sanitize all user inputs
- Rate limit API requests to avoid quota issues
- Use HTTPS in production
- Implement CORS headers properly

## 📝 License

This project is intended for educational and learning purposes.

## 💬 Support

For issues, questions, or suggestions, please refer to the documentation or the project comments.

## 👥 Contributing

Contributions are welcome! Feel free to fork, modify, and submit pull requests.

---

**Built for learning and demonstrating API integration skills**

Last Updated: December 26, 2025
