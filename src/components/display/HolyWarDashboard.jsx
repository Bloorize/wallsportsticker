import React, { useState, useEffect } from 'react';
import { formatMountainTime } from '../../utils/timeUtils';
import { searchGameHighlights, searchHighlights } from '../../services/youtube';
import { getGameSummary } from '../../services/espn';
import { RIVALRY_DATA } from '../../config/rivalryData';

/**
 * Holy War TV Dashboard
 * Optimized for 32" TV at 10 feet viewing distance
 * NO RED COLORS - BYU Blue only
 */
const HolyWarDashboard = ({ game, loading }) => {
    const [highlights, setHighlights] = useState([]);
    const [mediaIndex, setMediaIndex] = useState(0);
    const [gameSummary, setGameSummary] = useState(null);
    const [liveStats, setLiveStats] = useState(null);

    // Fetch highlights and media
    useEffect(() => {
        if (!game) return;
        
        const competition = game.competitions?.[0];
        if (!competition) return;

        const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
        const homeTeam = competition.competitors.find(c => c.homeAway === 'home');

        const fetchMedia = async () => {
            try {
                // Try rivalry-specific searches first
                const rivalryQueries = [
                    'BYU Utah Holy War basketball highlights',
                    'BYU vs Utah basketball rivalry',
                    'BYU Utah basketball classic'
                ];
                
                let allVids = [];
                for (const query of rivalryQueries) {
                    const vids = await searchHighlights(query);
                    if (vids && Array.isArray(vids)) {
                        allVids = [...allVids, ...vids.filter(v => v.embeddable)];
                    }
                }
                
                // Also try game-specific search
                const gameVids = await searchGameHighlights(
                    awayTeam.team.abbreviation,
                    homeTeam.team.abbreviation,
                    game.date
                );
                if (gameVids && Array.isArray(gameVids)) {
                    allVids = [...allVids, ...gameVids.filter(v => v.embeddable)];
                }
                
                // Deduplicate and limit
                const uniqueVids = Array.from(new Map(allVids.map(v => [v.videoId, v])).values());
                setHighlights(uniqueVids.slice(0, 5));
            } catch (e) {
                console.error('Error fetching highlights:', e);
            }
        };

        fetchMedia();
    }, [game]);

    // Fetch game summary for live stats
    useEffect(() => {
        if (!game || game.status?.type?.state !== 'in') return;

        const fetchSummary = async () => {
            try {
                const summary = await getGameSummary('basketball', 'mens-college-basketball', game.id);
                if (summary) {
                    setGameSummary(summary);
                    // Extract live box score stats
                    const boxscore = summary.boxscore;
                    if (boxscore?.players) {
                        // Aggregate team stats
                        const awayStats = { fg: 0, fga: 0, fg3: 0, fg3a: 0, reb: 0 };
                        const homeStats = { fg: 0, fga: 0, fg3: 0, fg3a: 0, reb: 0 };
                        
                        boxscore.players.forEach(player => {
                            const stats = player.statistics?.[0];
                            if (!stats) return;
                            
                            const isHome = player.team?.id === game.competitions[0].competitors.find(c => c.homeAway === 'home')?.team?.id;
                            const target = isHome ? homeStats : awayStats;
                            
                            target.fg += stats.fieldGoalsMade || 0;
                            target.fga += stats.fieldGoalsAttempted || 0;
                            target.fg3 += stats.threePointFieldGoalsMade || 0;
                            target.fg3a += stats.threePointFieldGoalsAttempted || 0;
                            target.reb += stats.rebounds || 0;
                        });
                        
                        setLiveStats({
                            away: {
                                fgPct: awayStats.fga > 0 ? ((awayStats.fg / awayStats.fga) * 100).toFixed(1) : '0.0',
                                fg3: awayStats.fg3,
                                reb: awayStats.reb
                            },
                            home: {
                                fgPct: homeStats.fga > 0 ? ((homeStats.fg / homeStats.fga) * 100).toFixed(1) : '0.0',
                                fg3: homeStats.fg3,
                                reb: homeStats.reb
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('Error fetching game summary:', e);
            }
        };

        fetchSummary();
        const interval = setInterval(fetchSummary, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [game]);

    // Rotate media every 15 seconds
    useEffect(() => {
        if (highlights.length === 0) return;
        const interval = setInterval(() => {
            setMediaIndex(prev => (prev + 1) % highlights.length);
        }, 15000);
        return () => clearInterval(interval);
    }, [highlights.length]);

    if (loading || !game) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-[#002E5D] text-4xl font-black uppercase tracking-widest">LOADING...</div>
            </div>
        );
    }

    const competition = game.competitions?.[0];
    if (!competition) return null;

    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const gameState = game.status?.type?.state;
    const isLive = gameState === 'in';

    // Get basketball rivalry data
    const basketballData = RIVALRY_DATA.mensBasketball;

    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
            {/* Score Section - Prominent but compact */}
            <div className="flex-none bg-white border-b-4 border-[#0047BA] py-6 md:py-8 lg:py-10">
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 px-4">
                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <img 
                            src={awayTeam.team.logo} 
                            alt={awayTeam.team.displayName}
                            className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
                        />
                        <div className="text-[#002E5D] text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
                            {awayTeam.team.abbreviation}
                        </div>
                        <div className="text-[#002E5D] text-6xl md:text-7xl lg:text-8xl font-mono font-black tabular-nums">
                            {awayTeam.score || '0'}
                        </div>
                    </div>

                    {/* VS Separator */}
                    <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className="text-[#0047BA] text-3xl md:text-4xl lg:text-5xl font-black italic">VS</div>
                        <div className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-black uppercase tracking-widest">
                            {isLive ? game.status.type.detail : (game.status.type.shortDetail || formatMountainTime(game.date))}
                        </div>
                    </div>

                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                        <img 
                            src={homeTeam.team.logo} 
                            alt={homeTeam.team.displayName}
                            className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
                        />
                        <div className="text-[#002E5D] text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
                            {homeTeam.team.abbreviation}
                        </div>
                        <div className="text-[#002E5D] text-6xl md:text-7xl lg:text-8xl font-mono font-black tabular-nums">
                            {homeTeam.score || '0'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Three-Column Stats Section */}
            <div className="flex-grow flex gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8 min-h-0">
                {/* Left Column: Live Game Stats */}
                <div className="flex-1 flex flex-col bg-white border-2 border-[#0047BA] rounded-lg p-4 md:p-6 lg:p-8">
                    <div className="text-[#0047BA] text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-widest mb-4 md:mb-6">
                        LIVE GAME STATS
                    </div>
                    {isLive && liveStats ? (
                        <div className="flex-grow flex flex-col gap-4 md:gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-black uppercase">FG%</span>
                                <div className="flex gap-4 md:gap-6">
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.away.fgPct}%</span>
                                    <span className="text-[#002E5D]/40 text-xl md:text-2xl lg:text-3xl font-mono">|</span>
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.home.fgPct}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-black uppercase">3PT</span>
                                <div className="flex gap-4 md:gap-6">
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.away.fg3}</span>
                                    <span className="text-[#002E5D]/40 text-xl md:text-2xl lg:text-3xl font-mono">|</span>
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.home.fg3}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-black uppercase">REB</span>
                                <div className="flex gap-4 md:gap-6">
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.away.reb}</span>
                                    <span className="text-[#002E5D]/40 text-xl md:text-2xl lg:text-3xl font-mono">|</span>
                                    <span className="text-[#002E5D] text-xl md:text-2xl lg:text-3xl font-mono font-black">{liveStats.home.reb}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <span className="text-[#002E5D]/60 text-xl md:text-2xl font-black uppercase">
                                {gameState === 'pre' ? 'Stats available at game time' : 'Game completed'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Center Column: Media Area */}
                <div className="flex-1 flex flex-col bg-white border-2 border-[#0047BA] rounded-lg overflow-hidden">
                    <div className="text-[#0047BA] text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-widest p-4 md:p-6 lg:p-8 border-b-2 border-[#0047BA]">
                        HIGHLIGHTS
                    </div>
                    <div className="flex-grow relative bg-[#002E5D]">
                        {highlights.length > 0 ? (
                            <div className="absolute inset-0">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${highlights[mediaIndex]?.videoId}?modestbranding=1&rel=0&autoplay=1&mute=1&loop=1&playlist=${highlights[mediaIndex]?.videoId}`}
                                    title={highlights[mediaIndex]?.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white text-xl md:text-2xl font-black uppercase">
                                    Media Loading...
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Season/Rivalry Comparison */}
                <div className="flex-1 flex flex-col bg-white border-2 border-[#0047BA] rounded-lg p-4 md:p-6 lg:p-8">
                    <div className="text-[#0047BA] text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-widest mb-4 md:mb-6">
                        SEASON COMPARISON
                    </div>
                    {basketballData?.season2025_2026?.teamComparison ? (
                        <div className="flex-grow flex flex-col gap-3 md:gap-4">
                            {basketballData.season2025_2026.teamComparison.rows.slice(0, 5).map((row, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="text-[#002E5D] text-base md:text-lg lg:text-xl font-black uppercase">
                                        {row[0]}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-mono font-black">{row[1]}</span>
                                        <span className="text-[#002E5D]/40 text-lg md:text-xl lg:text-2xl font-mono">|</span>
                                        <span className="text-[#002E5D] text-lg md:text-xl lg:text-2xl font-mono font-black">{row[2]}</span>
                                    </div>
                                    {row[3] && (
                                        <div className="text-[#0047BA] text-sm md:text-base font-bold">
                                            {row[3]}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <span className="text-[#002E5D]/60 text-xl md:text-2xl font-black uppercase">
                                Season Stats
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HolyWarDashboard;
