const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';

/**
 * Get betting odds for a specific sport
 * @param {string} sport - Sport key (e.g., 'basketball_nba', 'americanfootball_nfl')
 * @param {string} regions - Comma-separated regions (e.g., 'us', 'us2')
 * @param {string} markets - Comma-separated markets (e.g., 'h2h,spreads,totals')
 * @returns {Promise<Object|null>} Odds data
 */
export const getOdds = async (sport, regions = 'us', markets = 'h2h,spreads,totals') => {
    if (!ODDS_API_KEY) {
        console.warn('Odds API key not configured');
        return null;
    }

    try {
        const params = new URLSearchParams({
            apiKey: ODDS_API_KEY,
            regions: regions,
            markets: markets,
        });

        const response = await fetch(`${ODDS_API_BASE}/sports/${sport}/odds?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Odds API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching odds:', error);
        return null;
    }
};

/**
 * Get odds for a specific game by team names
 * @param {string} sport - Sport key
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {string} regions - Regions to fetch from
 * @returns {Promise<Object|null>} Game odds data
 */
export const getGameOdds = async (sport, team1, team2, regions = 'us') => {
    const allOdds = await getOdds(sport, regions);
    
    if (!allOdds || !Array.isArray(allOdds)) {
        return null;
    }

    // Find game matching both teams
    const game = allOdds.find(event => {
        const homeTeam = event.home_team?.toLowerCase() || '';
        const awayTeam = event.away_team?.toLowerCase() || '';
        const team1Lower = team1.toLowerCase();
        const team2Lower = team2.toLowerCase();
        
        return (homeTeam.includes(team1Lower) || awayTeam.includes(team1Lower)) &&
               (homeTeam.includes(team2Lower) || awayTeam.includes(team2Lower));
    });

    return game || null;
};

/**
 * Map sport category to Odds API sport key
 * @param {string} category - Sport category (NBA, NFL, etc.)
 * @returns {string|null} Odds API sport key
 */
export const mapCategoryToSport = (category) => {
    const mapping = {
        'NBA': 'basketball_nba',
        'NFL': 'americanfootball_nfl',
        'NHL': 'icehockey_nhl',
        'MLB': 'baseball_mlb',
        'NCAAM': 'basketball_ncaab',
        'NCAAF': 'americanfootball_ncaaf',
        'SOCCER': 'soccer_usa_mls', // Default to MLS, can be expanded
    };
    
    return mapping[category] || null;
};

/**
 * Format odds data for display
 * @param {Object} oddsData - Raw odds data from API
 * @returns {Object} Formatted odds data
 */
export const formatOdds = (oddsData) => {
    if (!oddsData || !oddsData.bookmakers) {
        return null;
    }

    const formatted = {
        spreads: [],
        totals: [],
        moneylines: [],
    };

    oddsData.bookmakers.forEach(bookmaker => {
        bookmaker.markets.forEach(market => {
            if (market.key === 'spreads') {
                market.outcomes.forEach(outcome => {
                    formatted.spreads.push({
                        bookmaker: bookmaker.title,
                        team: outcome.name,
                        point: outcome.point,
                        price: outcome.price,
                    });
                });
            } else if (market.key === 'totals') {
                market.outcomes.forEach(outcome => {
                    formatted.totals.push({
                        bookmaker: bookmaker.title,
                        over: outcome.name === 'Over' ? outcome.point : null,
                        under: outcome.name === 'Under' ? outcome.point : null,
                        price: outcome.price,
                    });
                });
            } else if (market.key === 'h2h') {
                market.outcomes.forEach(outcome => {
                    formatted.moneylines.push({
                        bookmaker: bookmaker.title,
                        team: outcome.name,
                        price: outcome.price,
                    });
                });
            }
        });
    });

    return formatted;
};

/**
 * Get best odds across all sportsbooks
 * @param {Object} formattedOdds - Formatted odds data
 * @returns {Object} Best odds summary
 */
export const getBestOdds = (formattedOdds) => {
    if (!formattedOdds) return null;

    const best = {
        spread: null,
        total: null,
        moneyline: null,
    };

    // Find best spread (closest to 0 or most favorable)
    if (formattedOdds.spreads.length > 0) {
        best.spread = formattedOdds.spreads.reduce((prev, current) => {
            return Math.abs(current.point) < Math.abs(prev.point) ? current : prev;
        });
    }

    // Find best total (most common)
    if (formattedOdds.totals.length > 0) {
        const totalsMap = {};
        formattedOdds.totals.forEach(t => {
            const key = t.over || t.under;
            if (!totalsMap[key]) totalsMap[key] = [];
            totalsMap[key].push(t);
        });
        const mostCommon = Object.keys(totalsMap).reduce((a, b) => 
            totalsMap[a].length > totalsMap[b].length ? a : b
        );
        best.total = totalsMap[mostCommon][0];
    }

    // Find best moneyline (highest price)
    if (formattedOdds.moneylines.length > 0) {
        best.moneyline = formattedOdds.moneylines.reduce((prev, current) => {
            return current.price > prev.price ? current : prev;
        });
    }

    return best;
};
