export const FAVORITES = {
    football: {
        league: 'nfl',
        teams: ['CHI', 'SEA', 'SF'] // Bears, Seahawks, 49ers
    },
    basketball: {
        leagues: [
            {
                name: 'nba',
                teams: ['UTA'] // Utah Jazz
            },
            {
                name: 'mens-college-basketball',
                teams: ['BYU'] // BYU Cougars (Also focusing on Big 12 generally)
            }
        ]
    }
};

export const PRIORITY_LEAGUES = [
    { sport: 'basketball', league: 'mens-college-basketball', group: 8 }, // Big 12
    { sport: 'football', league: 'nfl' },
    { sport: 'basketball', league: 'nba' }
];

// Season date ranges for off-season detection
// Format: { startMonth, startDay, endMonth, endDay }
export const SEASON_DATES = {
    NFL: { startMonth: 8, startDay: 1, endMonth: 1, endDay: 15 }, // Sept 1 - Feb 15
    NBA: { startMonth: 9, startDay: 15, endMonth: 5, endDay: 30 }, // Oct 15 - June 30
    MLB: { startMonth: 2, startDay: 20, endMonth: 10, endDay: 5 }, // March 20 - Nov 5
    NHL: { startMonth: 9, startDay: 1, endMonth: 5, endDay: 30 }, // Oct 1 - June 30
    NCAAF: { startMonth: 7, startDay: 24, endMonth: 0, endDay: 20 }, // Aug 24 - Jan 20
    NCAAM: { startMonth: 10, startDay: 1, endMonth: 3, endDay: 10 }, // Nov 1 - April 10
    SOCCER: null // Year-round
};

// ESPN API group IDs for Power Conferences
// Power conferences for college football and basketball
export const POWER_CONFERENCE_GROUPS = {
    'college-football': [80, 8, 7, 2, 23, 9, 4], // FBS, Big 12, Big Ten, ACC, SEC, Pac-12, Big East
    'mens-college-basketball': [50, 8, 7, 2, 23, 9, 4] // D1, Big 12, Big Ten, ACC, SEC, Pac-12, Big East
};

/**
 * Check if a sport is currently in season
 * @param {string} sportId - Sport ID (NFL, NBA, MLB, NHL, NCAAF, NCAAM, SOCCER)
 * @returns {boolean}
 */
export const isInSeason = (sportId) => {
    const season = SEASON_DATES[sportId];
    if (!season) return true; // Year-round sports
    
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentDay = now.getDate();
    
    const seasonStart = new Date(now.getFullYear(), season.startMonth, season.startDay);
    let seasonEnd = new Date(now.getFullYear(), season.endMonth, season.endDay);
    
    // Handle seasons that span across year boundary (e.g., NFL Sept -> Feb)
    if (season.endMonth < season.startMonth) {
        seasonEnd = new Date(now.getFullYear() + 1, season.endMonth, season.endDay);
    }
    
    const currentDate = new Date(now.getFullYear(), currentMonth, currentDay);
    
    return currentDate >= seasonStart && currentDate <= seasonEnd;
};
