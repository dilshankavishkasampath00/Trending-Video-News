<?php
/**
 * Trending Video News - Backend API
 * Handles YouTube Data API requests and data processing
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set response header
header('Content-Type: application/json');

// Configuration
$API_KEY = 'AIzaSyCodTPzzRbXcLbOnEMdFMozowirX8opN-8'; // User will enter API key here
$YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Category mapping to YouTube video categories
$CATEGORY_MAP = array(
    'news' => '25',           // News & Politics
    'technology' => '28',     // Science & Technology
    'sports' => '17',         // Sports
    'entertainment' => '24'   // Entertainment
);

// Country codes
$COUNTRY_CODES = array(
    'US' => 'US',
    'IN' => 'IN',
    'GB' => 'GB',
    'CA' => 'CA',
    'AU' => 'AU'
);

/**
 * Main request handler
 */
try {
    $action = isset($_GET['action']) ? sanitize($_GET['action']) : 'trending';
    $country = isset($_GET['country']) ? sanitize($_GET['country']) : 'US';
    
    // Validate country code
    if (!array_key_exists($country, $COUNTRY_CODES)) {
        $country = 'US';
    }
    
    // Check if API key is set
    if (empty($API_KEY)) {
        throw new Exception('YouTube API key not configured. Please set your API key in api.php');
    }
    
    switch ($action) {
        case 'trending':
            getTrendingVideos($country);
            break;
        case 'search':
            searchVideos();
            break;
        default:
            sendError('Invalid action');
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}

/**
 * Get trending videos from YouTube
 */
function getTrendingVideos($country) {
    global $API_KEY, $YOUTUBE_API_URL;
    
    // YouTube API parameters
    $params = array(
        'key' => $API_KEY,
        'part' => 'snippet,statistics',
        'chart' => 'mostPopular',
        'regionCode' => $country,
        'maxResults' => 50,
        'fields' => 'items(id,snippet(title,thumbnails,channelTitle,publishedAt),statistics(viewCount))'
    );
    
    $url = $YOUTUBE_API_URL . '/videos?' . http_build_query($params);
    
    // Make API request
    $response = makeApiRequest($url);
    
    if (!$response) {
        throw new Exception('Failed to fetch data from YouTube API');
    }
    
    // Process and format videos
    $videos = processYouTubeResponse($response);
    
    // Send successful response
    sendSuccess(array(
        'videos' => $videos,
        'count' => count($videos),
        'country' => $country
    ));
}

/**
 * Search videos
 */
function searchVideos() {
    global $API_KEY, $YOUTUBE_API_URL;
    
    $query = isset($_GET['q']) ? sanitize($_GET['q']) : '';
    
    if (empty($query)) {
        throw new Exception('Search query is required');
    }
    
    $params = array(
        'key' => $API_KEY,
        'part' => 'snippet',
        'q' => $query,
        'type' => 'video',
        'maxResults' => 20,
        'order' => 'viewCount'
    );
    
    $url = $YOUTUBE_API_URL . '/search?' . http_build_query($params);
    $response = makeApiRequest($url);
    
    if (!$response) {
        throw new Exception('Search failed');
    }
    
    sendSuccess($response);
}

/**
 * Process YouTube API response
 */
function processYouTubeResponse($response) {
    $videos = array();
    
    if (!isset($response['items']) || !is_array($response['items'])) {
        return $videos;
    }
    
    foreach ($response['items'] as $item) {
        if (!isset($item['snippet']) || !isset($item['id'])) {
            continue;
        }
        
        $video = array(
            'videoId' => $item['id'],
            'title' => isset($item['snippet']['title']) ? $item['snippet']['title'] : 'Untitled',
            'channelTitle' => isset($item['snippet']['channelTitle']) ? $item['snippet']['channelTitle'] : 'Unknown',
            'thumbnail' => isset($item['snippet']['thumbnails']['medium']['url']) 
                ? $item['snippet']['thumbnails']['medium']['url'] 
                : 'https://via.placeholder.com/320x180',
            'publishedAt' => isset($item['snippet']['publishedAt']) ? $item['snippet']['publishedAt'] : date('c'),
            'viewCount' => isset($item['statistics']['viewCount']) ? $item['statistics']['viewCount'] : 0,
            'category' => detectCategory($item['snippet']['title'])
        );
        
        $videos[] = $video;
    }
    
    return $videos;
}

/**
 * Detect video category based on title and keywords
 */
function detectCategory($title) {
    $title_lower = strtolower($title);
    
    $keywords = array(
        'news' => array('news', 'breaking', 'happening', 'report', 'incident', 'event'),
        'technology' => array('tech', 'software', 'hardware', 'coding', 'ai', 'gadget', 'app', 'programming'),
        'sports' => array('sports', 'football', 'cricket', 'basketball', 'match', 'game', 'league', 'tournament'),
        'entertainment' => array('movie', 'music', 'song', 'actor', 'celebrity', 'comedy', 'trailer', 'entertainment')
    );
    
    foreach ($keywords as $category => $terms) {
        foreach ($terms as $term) {
            if (strpos($title_lower, $term) !== false) {
                return $category;
            }
        }
    }
    
    return 'all';
}

/**
 * Make HTTP request to external API
 */
function makeApiRequest($url) {
    // Try using curl if available
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5
        ));
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($http_code !== 200) {
            return null;
        }
        
        return json_decode($response, true);
    }
    
    // Fallback to file_get_contents
    $context = stream_context_create(array(
        'http' => array(
            'timeout' => 10
        )
    ));
    
    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        return null;
    }
    
    return json_decode($response, true);
}

/**
 * Sanitize input string
 */
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Send success response
 */
function sendSuccess($data) {
    $response = array(
        'success' => true,
        'data' => $data
    );
    echo json_encode($response);
    exit;
}

/**
 * Send error response
 */
function sendError($message) {
    http_response_code(400);
    $response = array(
        'success' => false,
        'message' => $message
    );
    echo json_encode($response);
    exit;
}
?>
