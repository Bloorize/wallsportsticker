import React, { useState, useEffect } from 'react';
import HolyWarLayout from '../components/layout/HolyWarLayout';
import HolyWarDashboard from '../components/display/HolyWarDashboard';
import { getScores } from '../services/espn';

/**
 * Holy War Page - Dedicated BYU vs Utah Rivalry Page
 * Styled with BYU brand colors: Navy (#002E5D), Royal (#0047BA), White (#FFFFFF)
 */
function HolyWar() {
    const [currentGame, setCurrentGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Only fetch BYU vs Utah basketball games
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const futureLimit = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days ahead
            const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');
            const apiDateRange = `${formatDate(todayStart)}-${formatDate(futureLimit)}`;
            
            try {
                const data = await getScores('basketball', 'mens-college-basketball', {
                    limit: 250,
                    dates: apiDateRange,
                    groups: 50
                });

                const events = data?.events || [];
                
                // Filter to ONLY BYU vs Utah games
                const byuUtahGames = events.filter(game => {
                    if (!game.competitions?.[0]) return false;
                    const competitors = game.competitions[0].competitors || [];
                    const teamAbbrevs = competitors.map(c => c.team?.abbreviation).filter(Boolean);
                    return (teamAbbrevs.includes('BYU') && teamAbbrevs.includes('UTAH'));
                });

                // Sort games: live first, then by date
                byuUtahGames.sort((a, b) => {
                    const aState = a.status?.type?.state;
                    const bState = b.status?.type?.state;
                    if (aState === 'in' && bState !== 'in') return -1;
                    if (bState === 'in' && aState !== 'in') return 1;
                    return new Date(a.date) - new Date(b.date);
                });

                // Set the current game (live game first, or most recent upcoming)
                setCurrentGame(byuUtahGames[0] || null);
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
        <HolyWarLayout>
            <HolyWarDashboard game={currentGame} loading={loading} />
        </HolyWarLayout>
    );
}

export default HolyWar;
