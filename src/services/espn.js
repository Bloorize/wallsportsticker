const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';

/**
 * Fetch Scores/Schedule for any sport/league
 * @param {string} sport - e.g., 'basketball', 'football'
 * @param {string} league - e.g., 'mens-college-basketball', 'nfl', 'nba'
 * @param {object} params - query params like { groups: 8, limit: 10 }
 */
export const getScores = async (sport, league, params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/${sport}/${league}/scoreboard?${query}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching scores for ${sport}/${league}:`, error);
        return null;
    }
};

/**
 * Fetch Rankings
 */
export const getRankings = async (sport, league) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/rankings`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching rankings for ${sport}/${league}:`, error);
        return null;
    }
};
/**
 * Fetch News
 */
export const getNews = async (sport, league) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/news`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching news for ${sport}/${league}:`, error);
        return null;
    }
};

/**
 * Fetch News with Photos for a specific sport/league
 */
export const getNewsWithPhotos = async (sport, league) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/news`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        return data.articles?.map(article => ({
            id: article.id,
            headline: article.headline,
            description: article.description,
            image: article.images?.[0]?.url,
            link: article.links?.web?.href,
            teamId: article.categories?.find(cat => cat.type === 'team')?.teamId
        })) || [];
    } catch (error) {
        console.error(`Error fetching news photos for ${sport}/${league}:`, error);
        return [];
    }
};

/**
 * Fetch Game Summary (includes venue photos)
 */
export const getGameSummary = async (sport, league, eventId) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/summary?event=${eventId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching game summary for ${eventId}:`, error);
        return null;
    }
};

/**
 * Fetch Transactions
 */
export const getTransactions = async (sport, league) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/transactions`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching transactions for ${sport}/${league}:`, error);
        return null;
    }
};

/**
 * Fetch Injuries
 */
export const getInjuries = async (sport, league) => {
    try {
        const response = await fetch(`${BASE_URL}/${sport}/${league}/injuries`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching injuries for ${sport}/${league}:`, error);
        return null;
    }
};
