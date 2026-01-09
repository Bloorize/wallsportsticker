import React, { useState, useEffect } from 'react'
import GlassLayout from './components/layout/GlassLayout'
import Dashboard from './components/display/Dashboard'
import { getScores, getNews, getTransactions, getInjuries } from './services/espn'
import { FAVORITES } from './config/favorites'

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

      const leagues = [
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

      // Calculate date range for API and filtering
      const now = new Date();
      const pastLimit = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      const futureLimit = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

      const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');
      const apiDateRange = `${formatDate(pastLimit)}-${formatDate(futureLimit)}`;

      const scorePromises = leagues.map(l => {
        const params = { limit: 50, dates: apiDateRange };
        if (l.league === 'mens-college-basketball') {
          params.groups = 50;
        }
        return getScores(l.sport, l.league, params).then(data => {
          const events = data?.events || [];
          console.log(`[Fetch] ${l.id}: Found ${events.length} games.`);
          if (l.id === 'NHL') {
            events.forEach(evt => console.log(`[Fetch] NHL Game: ${evt.name} on ${evt.date}`));
          }
          if (events.length > 0 && l.id !== 'NHL') {
            console.log(`[Fetch] ${l.id} first game date: ${events[0].date}`);
          }
          return events.map(evt => ({ ...evt, _category: l.id }));
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

        console.log(`[Filter] API Range: ${apiDateRange}`);
        console.log(`[Filter] Window: ${pastLimit.toISOString()} to ${futureLimit.toISOString()}`);

        // Filtering
        combinedScores = combinedScores.filter(game => {
          const gameDate = new Date(game.date);
          const isWithin = gameDate >= pastLimit && gameDate <= futureLimit;
          if (!isWithin && game._category === 'NHL') {
            console.log(`[Filter] NHL Game excluded: ${game.name} on ${game.date}`);
          }
          return isWithin;
        });

        console.log(`[Filter] Removed ${initialCount - combinedScores.length} games outside window.`);
        console.log(`[Filter] NHL games remaining: ${combinedScores.filter(g => g._category === 'NHL').length}`);

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
