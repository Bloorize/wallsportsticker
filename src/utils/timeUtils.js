/**
 * Convert a date to Mountain Time format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted time string (e.g., "7:00 PM MT")
 */
export const formatMountainTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const timeStr = dateObj.toLocaleString('en-US', {
        timeZone: 'America/Denver',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return `${timeStr} MT`;
};

/**
 * Format full date and time in Mountain Time
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date/time string
 */
export const formatMountainDateTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const dateStr = dateObj.toLocaleDateString('en-US', {
        timeZone: 'America/Denver',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    
    const timeStr = dateObj.toLocaleTimeString('en-US', {
        timeZone: 'America/Denver',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return `${dateStr} at ${timeStr} MT`;
};

/**
 * Get league logo URL
 * @param {string} category - Category ID (NBA, NFL, NHL, MLB, NCAAM, NCAAF, SOCCER)
 * @returns {string} Logo URL
 */
export const getLeagueLogo = (category) => {
    const leagueMap = {
        'NBA': 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
        'NFL': 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
        'NHL': 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
        'MLB': 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
        // NCAA logos - ESPN may not have separate league logos, so return null to use text badges
        'NCAAM': null,
        'NCAAF': null,
        'SOCCER': 'https://a.espncdn.com/i/teamlogos/leagues/500/soccer.png',
    };
    
    return leagueMap[category] !== undefined ? leagueMap[category] : null;
};
