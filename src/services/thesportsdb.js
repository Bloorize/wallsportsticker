const SPORTSDB_API_KEY = import.meta.env.VITE_SPORTSDB_API_KEY || '123'; // Default to free test key
const SPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

/**
 * Search for event highlights
 * @param {string} eventId - TheSportsDB event ID
 * @returns {Promise<Object|null>} Event highlights data
 */
export const getEventHighlights = async (eventId) => {
    if (!eventId) return null;

    try {
        const response = await fetch(
            `${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/eventshighlights.php?i=${eventId}`
        );
        
        if (!response.ok) {
            throw new Error(`TheSportsDB API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.tvhighlights && Array.isArray(data.tvhighlights)) {
            return data.tvhighlights.map(highlight => ({
                id: highlight.idEvent,
                strVideo: highlight.strVideo,
                strThumb: highlight.strThumb,
                strDescription: highlight.strDescription,
            }));
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching TheSportsDB highlights:', error);
        return null;
    }
};

/**
 * Search for team by name
 * @param {string} teamName - Team name to search
 * @param {string} sport - Sport type (optional)
 * @returns {Promise<Object|null>} Team data
 */
export const searchTeam = async (teamName, sport = null) => {
    try {
        let url = `${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/searchteams.php?t=${encodeURIComponent(teamName)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`TheSportsDB API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.teams && data.teams.length > 0) {
            // Filter by sport if provided
            if (sport) {
                const filtered = data.teams.filter(team => 
                    team.strSport?.toLowerCase() === sport.toLowerCase()
                );
                return filtered.length > 0 ? filtered[0] : data.teams[0];
            }
            return data.teams[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error searching TheSportsDB team:', error);
        return null;
    }
};

/**
 * Get team photos (fanart/posters)
 * @param {string} teamName - Team name
 * @param {string} sport - Sport type
 * @returns {Promise<string[]>} Array of image URLs
 */
export const getTeamPhotos = async (teamName, sport = null) => {
    const team = await searchTeam(teamName, sport);
    if (!team) return [];
    
    const photos = [];
    if (team.strFanart1) photos.push(team.strFanart1);
    if (team.strFanart2) photos.push(team.strFanart2);
    if (team.strFanart3) photos.push(team.strFanart3);
    if (team.strFanart4) photos.push(team.strFanart4);
    if (team.strTeamFanart1) photos.push(team.strTeamFanart1);
    
    return photos;
};

/**
 * Search for events by date and teams
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @returns {Promise<Object|null>} Event data
 */
export const searchEvent = async (date, team1, team2) => {
    try {
        // TheSportsDB doesn't have a direct event search by teams and date
        // This would require mapping ESPN event IDs to TheSportsDB event IDs
        // For now, return null - this would need event ID mapping implementation
        return null;
    } catch (error) {
        console.error('Error searching TheSportsDB event:', error);
        return null;
    }
};
