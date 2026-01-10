import React, { useState, useEffect } from 'react';
import HolyWarLayout from '../components/layout/HolyWarLayout';
import Dashboard from '../components/display/Dashboard';
import { getScores, getNews, getTransactions, getInjuries } from '../services/espn';
import { POWER_CONFERENCE_GROUPS } from '../config/favorites';

/**
 * Holy War Page - Dedicated BYU vs Utah Rivalry Page
 * Styled with BYU brand colors: Navy (#002E5D), Royal (#0047BA), White (#FFFFFF)
 */
function HolyWar() {
    const [allGames, setAllGames] = useState([]);
    const [tickerData, setTickerData] = useState({ news: [], transactions: [], injuries: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Only fetch BYU and Utah games from basketball and football
            const leagues = [
                { sport: 'basketball', league: 'mens-college-basketball', id: 'NCAAM' },
                { sport: 'football', league: 'college-football', id: 'NCAAF' },
            ];

            // Extended date range to capture more rivalry history
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const futureLimit = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days ahead
            
            const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');

            const scorePromises = leagues.map(l => {
                const apiDateRange = `${formatDate(todayStart)}-${formatDate(futureLimit)}`;
                const params = { 
                    limit: 250, 
                    dates: apiDateRange,
                    groups: l.league === 'mens-college-basketball' ? 50 : 80
                };
                
                return getScores(l.sport, l.league, params).then(data => {
                    const events = data?.events || [];
                    return events.map(evt => ({ ...evt, _category: l.id }));
                }).catch(err => {
                    console.error(`[HolyWar] Error for ${l.id}:`, err);
                    return [];
                });
            });

            // Fetch news only for BYU/Utah related content
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

                // Filter to ONLY BYU vs Utah games
                let byuUtahGames = scores.filter(game => {
                    if (!game.competitions?.[0]) return false;
                    const competitors = game.competitions[0].competitors || [];
                    const teamAbbrevs = competitors.map(c => c.team?.abbreviation).filter(Boolean);
                    return (teamAbbrevs.includes('BYU') && teamAbbrevs.includes('UTAH'));
                });

                // Filter news/transactions/injuries to BYU/Utah only
                const byuUtahNews = news.filter(article => {
                    const headline = article.headline?.toUpperCase() || '';
                    return headline.includes('BYU') || headline.includes('UTAH') || headline.includes('UTAH UTE') || headline.includes('COUGAR');
                });

                const byuUtahTrans = trans.filter(t => {
                    const desc = t.description?.toUpperCase() || '';
                    return desc.includes('BYU') || desc.includes('UTAH');
                });

                const byuUtahInjuries = injuries.filter(i => {
                    const teamName = i.displayName?.toUpperCase() || '';
                    return teamName.includes('BYU') || teamName.includes('UTAH');
                });

                // Sort games: live first, then by date
                byuUtahGames.sort((a, b) => {
                    const aState = a.status?.type?.state;
                    const bState = b.status?.type?.state;
                    if (aState === 'in' && bState !== 'in') return -1;
                    if (bState === 'in' && aState !== 'in') return 1;
                    return new Date(a.date) - new Date(b.date);
                });

                setAllGames(byuUtahGames);
                setTickerData({
                    news: byuUtahNews.slice(0, 50),
                    transactions: byuUtahTrans.slice(0, 50),
                    injuries: byuUtahInjuries.slice(0, 50)
                });
            } catch (e) { 
                console.error('[HolyWar] Error:', e); 
            }
            setLoading(false);
        };

        fetchData();
        const interval = setInterval(fetchData, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <HolyWarLayout 
            filter="HOLY WAR" 
            games={allGames} 
            tickerData={tickerData}
        >
            <Dashboard
                filter="HOLY WAR"
                onFilterChange={() => {}} // No filter changes on Holy War page
                allGames={allGames}
                loading={loading}
                isHolyWar={true}
            />
        </HolyWarLayout>
    );
}

export default HolyWar;
