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
