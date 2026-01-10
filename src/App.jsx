import React, { useState, useEffect } from 'react'
import GlassLayout from './components/layout/GlassLayout'
import Dashboard from './components/display/Dashboard'
import { getScores, getNews, getTransactions, getInjuries } from './services/espn'
import { FAVORITES, POWER_CONFERENCE_GROUPS } from './config/favorites'

const isFavoriteGame = (game) => {
  if (!game.competitions || !game.competitions[0]) return false;
  const competitors = game.competitions[0].competitors;
  const teamAbbrevs = competitors.map(c => c.team.abbreviation);
  const allFavs = [...FAVORITES.football.teams, ...FAVORITES.basketball.leagues.flatMap(l => l.teams)];
  return teamAbbrevs.some(abbr => allFavs.includes(abbr));
};

function App() {
  const [filter, setFilter] = useState('All');
  const [allGames, setAllGames] = useState([]);
  const [tickerData, setTickerData] = useState({ news: [], transactions: [], injuries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const allLeagues = [
        { sport: 'basketball', league: 'mens-college-basketball', id: 'NCAAM' },
        { sport: 'basketball', league: 'nba', id: 'NBA' },
        { sport: 'football', league: 'college-football', id: 'NCAAF' },
        { sport: 'football', league: 'nfl', id: 'NFL' },
        { sport: 'baseball', league: 'mlb', id: 'MLB' },
        { sport: 'hockey', league: 'nhl', id: 'NHL' },
        { sport: 'soccer', league: 'usa.1', id: 'SOCCER' },
        { sport: 'soccer', league: 'eng.1', id: 'SOCCER' },
        { sport: 'soccer', league: 'esp.1', id: 'SOCCER' },
      ];

      // Don't filter by season - let the API return what's available
      // The API will naturally return no games if a sport is out of season
      const leagues = allLeagues;

      // Calculate date ranges
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
      
      // Date range limits for different sports
      const getFutureLimit = (category) => {
        if (category === 'NFL') {
          return new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        }
        // NCAA sports get 3 days ahead to show upcoming games
        if (category === 'NCAAM' || category === 'NCAAF') {
          return new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        }
        // Other sports get today only
        return todayEnd;
      };

      const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');

      const scorePromises = leagues.map(l => {
        // Calculate date range for this specific league
        const futureLimit = getFutureLimit(l.id);
        const apiDateRange = `${formatDate(todayStart)}-${formatDate(futureLimit)}`;
        
        // Increase limit for college sports which often have 100+ games on Saturdays
        const fetchLimit = (l.id === 'NCAAM' || l.id === 'NCAAF') ? 250 : 50;
        const params = { limit: fetchLimit, dates: apiDateRange };
        
        // Use power conference groups for NCAA sports
        if (l.league === 'mens-college-basketball' && POWER_CONFERENCE_GROUPS['mens-college-basketball']) {
            // Use Group 50 (All D1) as primary, others will be deduped
            params.groups = 50;
        } else if (l.league === 'college-football' && POWER_CONFERENCE_GROUPS['college-football']) {
            // Use Group 80 (FBS) as primary
            params.groups = 80;
        }
        
        return getScores(l.sport, l.league, params).then(data => {
          const events = data?.events || [];
          console.log(`[Fetch] ${l.id}: Found ${events.length} games.`, params);
          if (events.length > 0) {
            console.log(`[Fetch] ${l.id} sample game:`, {
              name: events[0].name,
              date: events[0].date,
              status: events[0].status?.type?.state
            });
          }
          return events.map(evt => ({ ...evt, _category: l.id }));
        }).catch(err => {
          console.error(`[Fetch] Error for ${l.id}:`, err);
          return [];
        });
      });

      const newsPromises = leagues.map(l => getNews(l.sport, l.league).then(data =>
        (data?.articles || []).map(a => ({ ...a, _category: l.id }))
      ));

      const transPromises = leagues.map(l => getTransactions(l.sport, l.league).then(data =>
        (data?.transactions || []).map(t => ({ ...t, _category: l.id }))
      ));

      const injuryPromises = leagues.map(l => getInjuries(l.sport, l.league).then(data =>
        (data?.injuries || []).map(i => ({ ...i, _category: l.id }))
      ));

      try {
        const [scores, news, trans, injuries] = await Promise.all([
          Promise.all(scorePromises).then(r => r.flat()),
          Promise.all(newsPromises).then(r => r.flat()),
          Promise.all(transPromises).then(r => r.flat()),
          Promise.all(injuryPromises).then(r => r.flat()),
        ]);

        // Dedup scores
        let combinedScores = Array.from(new Map(scores.map(item => [item.id, item])).values());
        const initialCount = combinedScores.length;

        // Time-based filtering: Only show games that:
        // 1. Finished TODAY (not yesterday or earlier)
        // 2. Will be played within the date range for each sport
        const beforeFilterCounts = {};
        combinedScores.forEach(game => {
          beforeFilterCounts[game._category] = (beforeFilterCounts[game._category] || 0) + 1;
        });
        console.log(`[Filter] Before date filtering:`, beforeFilterCounts);
        
        combinedScores = combinedScores.filter(game => {
          if (!game.date) {
            console.warn(`[Filter] Game missing date:`, game.name);
            return false;
          }
          
          const gameDate = new Date(game.date);
          // Check if date parsing failed
          if (isNaN(gameDate.getTime())) {
            console.warn(`[Filter] Invalid date format: ${game.date} for game ${game.name}`);
            return false;
          }
          
          const gameState = game.status?.type?.state;
          
          // Normalize dates to just the day (remove time component) for comparison
          const gameDay = new Date(gameDate.getFullYear(), gameDate.getMonth(), gameDate.getDate());
          const todayDay = new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate());
          
          // For finished games, only show if they were played today
          if (gameState === 'post' || gameState === 'final') {
            const isToday = gameDay.getTime() === todayDay.getTime();
            if (!isToday && game._category === 'NCAAM') {
              console.log(`[Filter] NCAAM finished game excluded: ${game.name} on ${game.date} (state: ${gameState}, gameDay: ${gameDay.toISOString()}, today: ${todayDay.toISOString()})`);
            }
            return isToday;
          }
          
          // For upcoming/live games, check date range based on sport
          const futureLimit = getFutureLimit(game._category);
          // Compare using full date/time for range check
          const isInRange = gameDate >= todayStart && gameDate <= futureLimit;
          
          if (!isInRange && game._category === 'NCAAM') {
            console.log(`[Filter] NCAAM game excluded: ${game.name} on ${game.date} (gameDate: ${gameDate.toISOString()}, range: ${todayStart.toISOString()} to ${futureLimit.toISOString()})`);
          }
          
          // Allow games from today through the future limit
          return isInRange;
        });
        
        // Log per-category counts for debugging
        const categoryCounts = {};
        combinedScores.forEach(game => {
          categoryCounts[game._category] = (categoryCounts[game._category] || 0) + 1;
        });
        console.log(`[Filter] After date filtering:`, categoryCounts);

        console.log(`[Filter] Removed ${initialCount - combinedScores.length} games outside window.`);
        console.log(`[Filter] Games remaining: ${combinedScores.length}`);

        // Improved Sorting
        combinedScores.sort((a, b) => {
          const getPriority = (g) => {
            const state = g.status?.type?.state;
            if (state === 'in') return 1;
            if (state === 'pre') return 2;
            return 3;
          };

          const pA = getPriority(a);
          const pB = getPriority(b);
          if (pA !== pB) return pA - pB;

          const aFav = isFavoriteGame(a);
          const bFav = isFavoriteGame(b);
          if (aFav !== bFav) return aFav ? -1 : 1;

          return new Date(a.date) - new Date(b.date);
        });

        setAllGames(combinedScores);
        setTickerData({
          news: news.slice(0, 50),
          transactions: trans.slice(0, 50),
          injuries: injuries.slice(0, 50)
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassLayout filter={filter} games={allGames} tickerData={tickerData}>
      <Dashboard
        filter={filter}
        onFilterChange={setFilter}
        allGames={allGames}
        loading={loading}
      />
    </GlassLayout>
  )
}

export default App
