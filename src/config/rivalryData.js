/**
 * Special rivalry matchup data
 * Custom content for historic rivalries - BYU vs Utah Holy War
 */

export const RIVALRY_DATA = {
    football: {
        title: "Football Rivalry Stats (Holy War)",
        intro: "BYU trails the disputed all-time series but dominates modern eras with a 29-23 edge since 1970, including a 19-2 run from 1972-1992. BYU owns the only undisputed national title (1984) and recent streaks, winning the last three games (2021: 26-17, 2024: 22-21, 2025: 24-21). In 2025, BYU outrushed Utah 193-142 and forced turnovers in a 24-21 win while undefeated at 7-0. BYU's program valuation is $500M vs. Utah's $451M. BYU produced an NCAA passing record (Marc Wilson, 571 yards in 1977 38-8 win).",
        seriesBreakdown: {
            title: "All-Time Series Breakdown (Favoring BYU Eras)",
            headers: ["Era", "BYU Wins", "Utah Wins", "Ties", "Notes"],
            rows: [
                ["1972-1992", 19, 2, 0, "BYU dynasty with blowouts like 56-6 in 1980 and 70-0 in 1977."],
                ["Since 1970 Overall", 29, 23, 0, "BYU flips early dominance; modern edge."],
                ["2021-2025", 3, 0, 0, "BYU's current streak; 2025 win kept them 7-0."],
                ["Big 12 Era (2023-2025)", 2, 0, 0, "BYU undefeated vs Utah in conference."]
            ]
        },
        highlights: {
            title: "BYU's Top Achievements vs Utah",
            items: [
                "1984 National Title: Beat Utah 24-14 en route to 13-0 season.",
                "Recent Wins: 26-17 (2021), 22-21 (2024), 24-21 (2025 with LJ Martin 122 rush yards).",
                "Program Value: $500M (57th nationally) vs Utah's $451M.",
                "Coaching Awards: Kalani Sitake on 2025 Bear Bryant Watch List.",
                "Historical Blowouts: 56-6 (1980), 38-8 (1977 with NCAA record pass yards)."
            ]
        },
        additionalStats: [
            "BYU's 2025 record: 12 wins, Big 12 Championship appearance.",
            "BYU ranks higher in ESPN Prestige (28 vs 45).",
            "BYU has 320 AP Top 25 weeks vs Utah's 192.",
            "BYU 4 weeks at #1 in AP Poll (Utah 0).",
            "BYU 73 Top 10 weeks vs Utah's 30.",
            "BYU 59 Consensus All-Americans vs Utah's 28.",
            "BYU 1 Heisman Winner (Ty Detmer 1990).",
            "BYU 1 Doak Walker Winner (Luke Staley 2001).",
            "BYU 4 Davey O'Brien Winners.",
            "BYU 2 Outland Trophy Winners.",
            "BYU 19 WAC Titles vs Utah's 20 (but BYU's in dynasty era).",
            "BYU 10 Individual NCAA Records vs Utah's 5.",
            "BYU 1 Win vs #1 Opponent (1990 Miami).",
            "BYU 14 11+ Win Seasons vs Utah's 4.",
            "BYU 5 12+ Win Seasons vs Utah's 2.",
            "BYU 2 13+ Win Seasons vs Utah's 1.",
            "BYU 1 14+ Win Season (1996)."
        ]
    },
    mensBasketball: {
        title: "Men's Basketball Rivalry Stats",
        intro: "BYU leads all-time 135-131, with a 10-4 edge since 2006. In 2025-26, BYU is 14-1 (No. 9 ranked) vs Utah's 8-7, on an 11-game win streak entering January 10, 2026 rivalry game (BYU favored by 14 points, 89% win probability). BYU has more modern top rankings and Elite Eight runs.",
        // Optional: Specify specific YouTube video IDs to play (in order)
        // Leave empty array [] to use automatic search instead
        videoIds: [
            '4ZHgBq5WQm0',
            'CNvIN6QRjw8',
            'rV3k5sWP_l0',
            'Az7X0RUOqWY',
            'eBLyzGG-rMg',
            'MabDY6n02mY',
            'EU49HQMI7nE',
            'lkKCkEvkOuQ',
            '5beUYudXFic',
        ],
        seriesBreakdown: {
            title: "Series Breakdown (Favoring BYU)",
            headers: ["Category", "BYU Wins", "Utah Wins", "Notes"],
            rows: [
                ["Overall", 135, 131, "BYU leads historic series."],
                ["Since 2006", 10, 4, "BYU modern dominance."],
                ["Last 10 (2010-2023)", 6, 4, "BYU edges recent thrillers."],
                ["Overtime Games", "Multiple BYU wins", "", "BYU resilient in classics like 113-105 (2OT) 1984."]
            ]
        },
        season2025_2026: {
            title: "2025-2026 Stats (As of Jan 10, 2026)",
            teamComparison: {
                headers: ["Stat", "BYU", "Utah", "BYU Edge"],
                rows: [
                    ["Record", "14-1 (2-0 Big 12)", "8-7 (0-2 Big 12)", "BYU 13-game streak."],
                    ["PPG", 88.2, 80.3, "+7.9 PPG."],
                    ["RPG", 39.9, 35.6, "+4.3 RPG."],
                    ["APG", 15.9, 14.3, "+1.6 APG."],
                    ["SPG", 9.5, 6.2, "+3.3 SPG."],
                    ["BPG", 5.1, 3.7, "+1.4 BPG."],
                    ["FG%", 50.3, 46.5, "+3.8%."],
                    ["3PT%", 37.5, 35.6, "+1.9%."]
                ]
            }
        },
        byuPlayers: [
            "AJ Dybantsa: 23.1 PPG, 7.2 RPG, Wooden Award watch.",
            "Richie Saunders: 19.1 PPG, 41.7% 3PT.",
            "Robert Wright III: 17.0 PPG, 5.4 APG.",
            "Keba Keita: 8.1 RPG, 1.8 BPG.",
            "Kennard Davis Jr.: 7.8 PPG."
        ],
        highlights: [
            "Wins: 98-70 vs #23 Wisconsin, 83-73 at Kansas State.",
            "National Ranking: No. 9, top-10 in both football/basketball simultaneously."
        ],
        additionalStats: [
            "BYU 135-131 all-time lead.",
            "BYU wins: 98-67 (1994), 58-54 (2000), 63-61 (2002).",
            "BYU reached No. 3 nationally (Utah's peaks older)."
        ]
    },
    womensBasketball: {
        title: "Women's Basketball Rivalry Stats",
        intro: "BYU holds edges in recent performances and program achievements, with consistent top-25 finishes and more WNBA draft picks in modern era.",
        additionalStats: [
            "BYU has 2 WNIT titles (2000, 2012) vs Utah's 1 (2006).",
            "BYU all-time series lead in non-conference play post-2011.",
            "BYU ranked higher in 2025-26 preseason polls."
        ]
    },
    mensVolleyball: {
        title: "Men's Volleyball Rivalry Stats",
        intro: "BYU dominates with 3 NCAA titles (1999, 2001, 2004) while Utah does not sponsor men's volleyball at NCAA level.",
        additionalStats: [
            "BYU all-time top-10 program ranking.",
            "BYU multiple AVCA Player of the Year awards.",
            "BYU consistent Final Four appearances."
        ]
    },
    womensVolleyball: {
        title: "Women's Volleyball Rivalry Stats",
        intro: "BYU leads recent series with better Big 12 performances.",
        seriesBreakdown: {
            headers: ["Category", "BYU Wins", "Utah Wins", "Notes"],
            rows: [
                ["Recent Matches", 5, 3, "BYU edges last 8 games."]
            ]
        },
        additionalStats: [
            "BYU reached Elite Eight in 2014, 2018.",
            "BYU more All-Americans in 2010s-2020s."
        ]
    },
    baseball: {
        title: "Baseball Rivalry Stats",
        intro: "BYU holds advantages in historical conference titles.",
        additionalStats: [
            "BYU 4 Mountain West titles vs Utah's 5 (but BYU outright in key years).",
            "BYU more College World Series appearances (2 vs Utah's 1)."
        ]
    },
    softball: {
        title: "Softball Rivalry Stats",
        intro: "BYU excels with more WCWS appearances.",
        additionalStats: [
            "BYU reached WCWS in 2001, 2005, 2007.",
            "BYU higher win percentage in 2020s rivalry games."
        ]
    },
    womensSoccer: {
        title: "Women's Soccer Rivalry Stats",
        intro: "BYU dominates with national runner-up in 2021 and consistent top rankings.",
        additionalStats: [
            "BYU 3 College Cup appearances (1998, 2012, 2021).",
            "BYU leads recent series 7-2 since 2015.",
            "BYU more Hermann Trophy finalists."
        ]
    },
    trackAndField: {
        title: "Track & Field Rivalry Stats",
        intro: "BYU men's team won 1970 NCAA outdoor title; women's strong in distances.",
        additionalStats: [
            "BYU 1 NCAA men's title (1970) vs Utah's 0.",
            "BYU more individual NCAA champions (e.g., miles Aldridge 3 titles).",
            "BYU higher national finishes in 2020s."
        ]
    },
    crossCountry: {
        title: "Cross Country Rivalry Stats",
        intro: "BYU women's team has 4 NCAA titles (1997, 1999, 2001, 2002); men's 2019 title.",
        additionalStats: [
            "BYU women's 4 titles vs Utah's 0.",
            "BYU men's 1 title (2019) vs Utah's 0.",
            "BYU consistent top-3 finishes (women 3rd in 2025)."
        ]
    },
    mensGolf: {
        title: "Men's Golf Rivalry Stats",
        intro: "BYU won 1981 NCAA title.",
        additionalStats: [
            "BYU 1 NCAA title (1981) vs Utah's 0.",
            "BYU more individual champions (e.g., Johnny Miller).",
            "BYU higher rankings in 2025."
        ]
    },
    womensGymnastics: {
        title: "Women's Gymnastics Rivalry Stats",
        intro: "BYU has strong regional performances.",
        additionalStats: [
            "BYU more NCAA qualifiers in 2020s.",
            "BYU higher average team scores vs Utah in dual meets."
        ]
    },
    overall: {
        title: "Overall Athletic Achievements",
        intro: "BYU edges in national titles across sports (11 total vs Utah's 2), more All-Americans, and higher program value.",
        deseretDuel: {
            title: "Deseret First Duel Wins",
            items: ["BYU titles: 2008, 2010, 2011, 2012 (4 vs Utah's 7, but BYU early dominance)."]
        },
        additionalStats: [
            "BYU 11 NCAA team titles vs Utah's 2 (skiing).",
            "BYU higher in Bleacher Report all-time ranking (29 vs 45).",
            "BYU more Olympic medalists from athletic programs.",
            "BYU dual top-10 rankings in football/basketball (2025-26)."
        ]
    }
};

// Legacy export for backward compatibility
export const RIVALRY_MATCHUPS = {
    'BYU-UTAH': {
        name: 'The Holy War',
        description: 'One of college basketball\'s most intense rivalries',
        historicStats: [
            {
                label: 'ALL-TIME SERIES',
                value: 'BYU leads 135-131',
                description: 'Most played rivalry in college basketball history'
            },
            {
                label: 'LAST MEETING',
                value: 'BYU 82-75',
                description: 'March 2024 - Mountain West Tournament'
            },
            {
                label: 'LONGEST WIN STREAK',
                value: 'BYU: 13 games',
                description: 'Current streak (2025-26)'
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
            subtitle: '263rd Meeting | BYU Leads 135-131',
            accentColor: '#0047BA' // BYU Royal Blue - NO RED
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

/**
 * Get all rivalry ticker items for scrolling display
 * Returns array of formatted strings for ticker
 */
export const getRivalryTickerItems = () => {
    const items = [];
    
    // Football
    if (RIVALRY_DATA.football) {
        items.push(`FOOTBALL: ${RIVALRY_DATA.football.intro.split('.')[0]}`);
        RIVALRY_DATA.football.highlights.items.forEach(h => {
            items.push(`FOOTBALL: ${h}`);
        });
        RIVALRY_DATA.football.additionalStats.slice(0, 5).forEach(stat => {
            items.push(`FOOTBALL: ${stat}`);
        });
    }
    
    // Men's Basketball
    if (RIVALRY_DATA.mensBasketball) {
        items.push(`BASKETBALL: ${RIVALRY_DATA.mensBasketball.intro.split('.')[0]}`);
        items.push(`BASKETBALL: BYU leads all-time ${RIVALRY_DATA.mensBasketball.seriesBreakdown.rows[0][1]}-${RIVALRY_DATA.mensBasketball.seriesBreakdown.rows[0][2]}`);
        RIVALRY_DATA.mensBasketball.highlights.forEach(h => {
            items.push(`BASKETBALL: ${h}`);
        });
    }
    
    // Other sports
    const otherSports = ['womensBasketball', 'mensVolleyball', 'womensVolleyball', 'baseball', 'softball', 'womensSoccer', 'trackAndField', 'crossCountry', 'mensGolf', 'womensGymnastics'];
    otherSports.forEach(sportKey => {
        const sport = RIVALRY_DATA[sportKey];
        if (sport && sport.title) {
            items.push(`${sport.title.toUpperCase()}: ${sport.intro.split('.')[0]}`);
            if (sport.additionalStats) {
                sport.additionalStats.slice(0, 2).forEach(stat => {
                    items.push(`${sport.title.toUpperCase()}: ${stat}`);
                });
            }
        }
    });
    
    // Overall
    if (RIVALRY_DATA.overall) {
        RIVALRY_DATA.overall.additionalStats.slice(0, 3).forEach(stat => {
            items.push(`OVERALL: ${stat}`);
        });
    }
    
    return items;
};
