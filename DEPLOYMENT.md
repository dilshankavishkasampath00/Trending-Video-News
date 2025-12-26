# Deployment Guide

## Local Testing

### Using PHP Built-in Server

1. Navigate to project directory:
   ```bash
   cd trending-video-news
   ```

2. Start PHP server:
   ```bash
   php -S localhost:8000
   ```

3. Open browser: `http://localhost:8000`

## Hosting Deployment

### Option 1: Shared Hosting (PHP)

1. **Upload files** to your hosting provider via FTP/SFTP
   - Upload all files to public_html or www directory

2. **Configure API key**:
   - Edit `backend/api.php`
   - Add your YouTube API key

3. **Test the application**:
   - Visit your domain URL
   - Check browser console for errors

### Option 2: Cloud Platforms

#### Heroku (with PHP buildpack)
```bash
heroku login
heroku create your-app-name
git push heroku main
```

#### AWS EC2
1. Launch EC2 instance with PHP support
2. Install Apache/Nginx
3. Configure domain and SSL
4. Upload files

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Deploy

## Production Checklist

- [ ] Add YouTube API key
- [ ] Enable HTTPS/SSL
- [ ] Set DEBUG=false in configuration
- [ ] Configure CORS headers
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Test all features
- [ ] Monitor API quota usage
- [ ] Set up backups
- [ ] Configure CDN for assets

## Environment Variables

Set these on your hosting provider:

```
YOUTUBE_API_KEY=your_key_here
APP_ENV=production
DEBUG=false
```

## Monitoring

- Monitor YouTube API quota usage
- Set up error logging
- Track application performance
- Monitor server resources

## Troubleshooting

### API Not Responding
- Check API key validity
- Verify API is enabled in Google Cloud Console
- Check API quota limits
- Review error logs

### Videos Not Loading
- Check internet connection
- Verify country code
- Check browser console for errors
- Validate API key

### Performance Issues
- Enable caching
- Optimize images
- Use CDN for static assets
- Implement pagination

## Security

- Never expose API keys in code
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Regular security updates

---

For more information, see README.md
