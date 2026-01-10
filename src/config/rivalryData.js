/**
 * Special rivalry matchup data
 * Custom content for historic rivalries
 */

export const RIVALRY_MATCHUPS = {
    'BYU-UTAH': {
        name: 'The Holy War',
        description: 'One of college basketball\'s most intense rivalries',
        historicStats: [
            // Basketball Series Stats
            {
                label: 'ALL-TIME SERIES',
                value: 'BYU 135-131',
                description: '263+ meetings, BYU leads historic rivalry'
            },
            {
                label: '2025-26 RECORD',
                value: 'BYU 14-1',
                description: 'Utah 8-7 | BYU ranked #9-10'
            },
            {
                label: 'BIG 12 STANDINGS',
                value: 'BYU 2-0',
                description: 'Utah 0-2 | BYU atop conference'
            },
            {
                label: 'CURRENT STREAK',
                value: 'BYU: 13 wins',
                description: 'Only loss to #3 UConn'
            },
            {
                label: 'LAST 10 GAMES',
                value: 'BYU 6-4',
                description: 'BYU edges recent matchups'
            },
            {
                label: 'POINTS PER GAME',
                value: 'BYU 88.2',
                description: 'Utah 80.3 | +7.9 PPG edge'
            },
            {
                label: 'REBOUNDS PER GAME',
                value: 'BYU 39.9',
                description: 'Utah 35.6 | +4.3 RPG advantage'
            },
            {
                label: 'FIELD GOAL %',
                value: 'BYU 50.3%',
                description: 'Utah 46.5% | +3.8% efficiency'
            },
            {
                label: 'THREE-POINT %',
                value: 'BYU 37.5%',
                description: 'Utah 35.6% | Long-range edge'
            },
            {
                label: 'STEALS PER GAME',
                value: 'BYU 9.5',
                description: 'Utah 6.2 | +3.3 SPG defense'
            },
            {
                label: 'BLOCKS PER GAME',
                value: 'BYU 5.1',
                description: 'Utah 3.7 | Interior defense'
            },
            // Top Players
            {
                label: 'TOP SCORER',
                value: 'AJ Dybantsa',
                description: '23.1 PPG, 7.2 RPG | Wooden watch'
            },
            {
                label: 'SCORING LEADER',
                value: 'Richie Saunders',
                description: '19.1 PPG, 41.7% 3PT | 31 vs ASU'
            },
            {
                label: 'ASSIST LEADER',
                value: 'Robert Wright III',
                description: '17.0 PPG, 5.4 APG | 12 ast vs CBU'
            },
            {
                label: 'REBOUND LEADER',
                value: 'Keba Keita',
                description: '8.1 RPG, 1.8 BPG | 23/12 vs CBU'
            },
            {
                label: 'UTAH TOP SCORER',
                value: 'Terrence Brown',
                description: '21.4 PPG, 4.0 APG | 36 vs Weber'
            },
            {
                label: 'UTAH SECONDARY',
                value: 'Don McHenry',
                description: '18.5 PPG, 42.6% 3PT | 29 vs Miss St'
            },
            // Season Highlights
            {
                label: 'BEST WIN',
                value: 'BYU 98-70',
                description: 'vs #23 Wisconsin | Dominated ranked'
            },
            {
                label: 'ONLY LOSS',
                value: 'BYU 84-86',
                description: 'vs #3 UConn | Competitive vs top-5'
            },
            {
                label: 'BIG 12 ROAD WIN',
                value: 'BYU 83-73',
                description: 'at Kansas State | Strong conference'
            },
            {
                label: 'OFFENSIVE EXPLOSION',
                value: 'BYU 104-76',
                description: 'vs Arizona State | High-powered'
            },
            {
                label: 'HIGH SCORING',
                value: 'BYU 109-81',
                description: 'vs Eastern Washington | Blowout'
            },
            // Historical Context
            {
                label: '1972-1992 ERA',
                value: 'BYU 19-2',
                description: 'Golden era dominance streak'
            },
            {
                label: 'SINCE 1970',
                value: 'BYU 29-23',
                description: 'Modern football favors BYU'
            },
            {
                label: 'LAST 3 FOOTBALL',
                value: 'BYU 3-0',
                description: '2021, 2024, 2025 wins'
            },
            {
                label: '1984 TITLE',
                value: 'BYU 24-14',
                description: 'Perfect season vs Utah'
            },
            {
                label: 'RECORD WIN',
                value: 'BYU 70-0',
                description: '1977 football blowout'
            },
            {
                label: 'NATIONAL RANK',
                value: 'BYU #9-10',
                description: 'Utah unranked | Top-10 status'
            },
            {
                label: 'PROGRAM VALUE',
                value: '$500M',
                description: 'BYU athletics valuation'
            },
            {
                label: 'BIG 12 ENTRY',
                value: '2023',
                description: 'BYU\'s biggest achievement'
            }
        ],
        youtubeQueries: [
            'BYU Utah Holy War basketball highlights',
            'BYU vs Utah rivalry moments',
            'BYU Utah basketball classic games',
            'BYU Utah buzzer beater',
            'BYU Utah overtime thriller',
            'BYU Utah 2025 highlights',
            'BYU Utah triple overtime',
            'AJ Dybantsa BYU highlights'
        ],
        specialContent: {
            header: 'THE HOLY WAR',
            subtitle: '263rd Meeting | BYU Leads 135-131',
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
