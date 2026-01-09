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
