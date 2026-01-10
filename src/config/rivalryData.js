/**
 * Special rivalry matchup data
 * Custom content for historic rivalries
 */

export const RIVALRY_MATCHUPS = {
    'BYU-UTAH': {
        name: 'The Holy War',
        description: 'One of college basketball\'s most intense rivalries',
        historicStats: [
            {
                label: 'ALL-TIME SERIES',
                value: 'Utah leads 129-128',
                description: 'Most played rivalry in college basketball history'
            },
            {
                label: 'LAST MEETING',
                value: 'BYU 82-75',
                description: 'March 2024 - Mountain West Tournament'
            },
            {
                label: 'LONGEST WIN STREAK',
                value: 'Utah: 8 games',
                description: '1991-1994'
            },
            {
                label: 'BIGGEST COMEBACK',
                value: 'BYU: 25 points',
                description: 'February 2005'
            }
        ],
        youtubeQueries: [
            'BYU Utah Holy War basketball highlights',
            'BYU vs Utah rivalry moments',
            'BYU Utah basketball classic games',
            'BYU Utah buzzer beater',
            'BYU Utah overtime thriller'
        ],
        specialContent: {
            header: 'THE HOLY WAR',
            subtitle: '257th Meeting',
            accentColor: '#FF0000' // Red for intensity
        }
    }
};

/**
 * Check if a game is a special rivalry matchup
 */
export const getRivalryData = (team1Abbr, team2Abbr) => {
    const key1 = `${team1Abbr}-${team2Abbr}`;
    const key2 = `${team2Abbr}-${team1Abbr}`;
    return RIVALRY_MATCHUPS[key1] || RIVALRY_MATCHUPS[key2] || null;
};
