/**
 * Official YouTube Channel IDs for major sports leagues
 * Used to restrict highlight searches to official league channels
 */

export const YOUTUBE_CHANNELS = {
    // NBA
    NBA: 'UCWJ2lWNubArHWmf3FIHbfcQ', // NBA Official Channel
    
    // NFL
    NFL: 'UCDVYQ4Zhbm3S2dlz7P1GBDg', // NFL Official Channel
    
    // NHL
    NHL: 'UCqFMzb-4AUf6WAIbl132QKA', // NHL Official Channel
    
    // MLB
    MLB: 'UCqNYlwQ3z8o5TzOsu6c8U1g', // MLB Official Channel
    
    // NCAA Basketball
    NCAAM: 'UCqFMzb-4AUf6WAIbl132QKA', // NCAA March Madness (uses NCAA channel)
    
    // NCAA Football
    NCAAF: 'UCqFMzb-4AUf6WAIbl132QKA', // NCAA Football (uses NCAA channel)
    
    // Soccer (multiple leagues)
    SOCCER: null, // No single official channel, search broadly
};

/**
 * Get channel ID for a sport category
 * @param {string} category - Sport category (NBA, NFL, etc.)
 * @returns {string|null} YouTube channel ID or null
 */
export const getChannelId = (category) => {
    return YOUTUBE_CHANNELS[category] || null;
};

/**
 * Get search query for game highlights
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {string} date - Game date
 * @param {string} category - Sport category
 * @returns {string} Search query string
 */
export const buildHighlightQuery = (team1, team2, date, category) => {
    const dateStr = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
    });
    
    return `${team1} vs ${team2} highlights ${dateStr}`;
};
