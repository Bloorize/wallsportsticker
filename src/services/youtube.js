const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Search for game highlights on YouTube
 * @param {string} query - Search query (e.g., "Lakers vs Warriors highlights")
 * @param {string} channelId - Optional channel ID to restrict search
 * @returns {Promise<Object|null>} Video search results
 */
export const searchHighlights = async (query, channelId = null) => {
    if (!YOUTUBE_API_KEY) {
        console.warn('YouTube API key not configured');
        return null;
    }

    try {
        const params = new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 5,
            order: 'relevance',
            key: YOUTUBE_API_KEY,
        });

        if (channelId) {
            params.append('channelId', channelId);
        }

        const response = await fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error || !data.items?.length) {
            return [];
        }

        // Get video details to check for embeddability
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const detailsResponse = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=snippet,status&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const detailsData = await detailsResponse.json();

        return detailsData.items?.map(item => ({
            videoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            embeddable: item.status.embeddable // CRITICAL: Check if we can play it
        })) || [];
    } catch (error) {
        console.error('Error searching YouTube highlights:', error);
        return null;
    }
};

/**
 * Get video details by video ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object|null>} Video details
 */
export const getVideoDetails = async (videoId) => {
    if (!YOUTUBE_API_KEY || !videoId) {
        return null;
    }

    try {
        const params = new URLSearchParams({
            part: 'snippet,contentDetails,statistics',
            id: videoId,
            key: YOUTUBE_API_KEY,
        });

        const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error || !data.items?.length) {
            return null;
        }

        const video = data.items[0];
        return {
            videoId: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
            duration: video.contentDetails.duration,
            viewCount: video.statistics.viewCount,
            publishedAt: video.snippet.publishedAt,
        };
    } catch (error) {
        console.error('Error fetching YouTube video details:', error);
        return null;
    }
};

/**
 * Get video details for multiple video IDs (batch)
 * @param {string[]} videoIds - Array of YouTube video IDs
 * @returns {Promise<Object[]>} Array of video details
 */
export const getVideosByIds = async (videoIds) => {
    if (!YOUTUBE_API_KEY || !videoIds || videoIds.length === 0) {
        return [];
    }

    try {
        // YouTube API allows up to 50 IDs per request
        const batchSize = 50;
        const allVideos = [];

        for (let i = 0; i < videoIds.length; i += batchSize) {
            const batch = videoIds.slice(i, i + batchSize);
            const params = new URLSearchParams({
                part: 'snippet,status',
                id: batch.join(','),
                key: YOUTUBE_API_KEY,
            });

            const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error || !data.items?.length) {
                continue;
            }

            const videos = data.items.map(item => ({
                videoId: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
                embeddable: item.status.embeddable, // Check if we can play it
            }));

            allVideos.push(...videos);
        }

        return allVideos;
    } catch (error) {
        console.error('Error fetching YouTube videos by IDs:', error);
        return [];
    }
};

/**
 * Search for game highlights with caching
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {string} date - Game date (YYYY-MM-DD format)
 * @param {string} channelId - Optional channel ID
 * @returns {Promise<Object|null>} Cached or fresh search results
 */
export const searchGameHighlights = async (team1, team2, date, channelId = null) => {
    // Create cache key
    const cacheKey = `youtube_${team1}_${team2}_${date}_${channelId || 'all'}`;
    
    // Check cache (24-hour TTL)
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const cachedData = JSON.parse(cached);
            const cacheTime = new Date(cachedData.timestamp);
            const now = new Date();
            const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                return cachedData.results;
            }
        } catch (e) {
            // Invalid cache, continue to fetch
        }
    }

    // Build search query
    const query = `${team1} vs ${team2} highlights ${date}`;
    
    // Fetch from API
    const results = await searchHighlights(query, channelId);
    
    // Cache results
    if (results) {
        try {
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: new Date().toISOString(),
                results: results,
            }));
        } catch (e) {
            // localStorage may be full or unavailable
            console.warn('Failed to cache YouTube results:', e);
        }
    }
    
    return results;
};
