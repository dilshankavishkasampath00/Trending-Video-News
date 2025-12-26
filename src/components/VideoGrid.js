import React from 'react';
import moment from 'moment';
import '../styles/VideoGrid.css';

function VideoGrid({ videos }) {
  const formatViewCount = (views) => {
    const num = parseInt(views);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const openVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (videos.length === 0) {
    return (
      <div className="video-grid">
        <div className="empty-state">
          <p>No videos found. Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-grid">
      {videos.map(video => (
        <div 
          key={video.videoId} 
          className="video-card"
          onClick={() => openVideo(video.videoId)}
        >
          <div className="video-thumbnail">
            <img src={video.thumbnail} alt={video.title} />
            <div className="play-icon">▶</div>
          </div>
          <div className="video-info">
            <h6 className="video-title">{video.title}</h6>
            <div className="channel-info">
              <span>{video.channelTitle}</span>
            </div>
            <div className="video-stats">
              <div>👁️ {formatViewCount(video.viewCount)}</div>
              <div>{moment(video.publishedAt).fromNow()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
