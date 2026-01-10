import React, { useState, useEffect } from 'react';
import { formatMountainTime } from '../../utils/timeUtils';
import { searchGameHighlights, searchHighlights } from '../../services/youtube';
import { getGameSummary } from '../../services/espn';
import { RIVALRY_DATA } from '../../config/rivalryData';

/**
 * Holy War TV Dashboard - Modern Apple Glassmorphism
 * Optimized for 32" TV at 10 feet viewing distance
 * BYU Colors: Navy #002E5D, Royal #0047BA
 */

// Card Component - Modern refined design
const GlassCard = ({ children, className = '', accentTop = false, noPadding = false }) => (
    <div className={`
        relative overflow-hidden rounded-3xl
        bg-[#002E5D] 
        border border-white/20
        shadow-xl
        ${className}
    `}>
        {/* Top accent line - subtle Royal Blue */}
        {accentTop && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0047BA]" />
        )}
        {noPadding ? (
            <div className="relative z-10 h-full">
                {children}
            </div>
        ) : (
            <div className="relative z-10 h-full p-8 md:p-10 lg:p-12">
                {children}
            </div>
        )}
    </div>
);

// Stat Row Component - Generous padding, text never touches edges
const StatRow = ({ label, awayValue, homeValue, highlight = false }) => (
    <div className={`
        flex items-center justify-between py-6 md:py-7 px-10 md:px-12
        ${highlight ? 'bg-[#0047BA]' : 'border-b border-white/10 last:border-0'}
        transition-all duration-300 hover:bg-white/5
    `}>
        <span className="text-white text-base md:text-lg lg:text-xl font-semibold uppercase tracking-wider">
            {label}
        </span>
        <div className="flex items-center gap-10 md:gap-12">
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tabular-nums min-w-[90px] text-center">
                {awayValue}
            </span>
            <div className="w-[1px] h-10 bg-white/20" />
            <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tabular-nums min-w-[90px] text-center">
                {homeValue}
            </span>
        </div>
    </div>
);

const HolyWarDashboard = ({ game, loading }) => {
    const [highlights, setHighlights] = useState([]);
    const [mediaIndex, setMediaIndex] = useState(0);
    const [gameSummary, setGameSummary] = useState(null);
    const [liveStats, setLiveStats] = useState(null);
    const [statCycleIndex, setStatCycleIndex] = useState(0);

    // Fetch highlights and media
    useEffect(() => {
        if (!game) return;
        
        const competition = game.competitions?.[0];
        if (!competition) return;

        const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
        const homeTeam = competition.competitors.find(c => c.homeAway === 'home');

        const fetchMedia = async () => {
            try {
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
                
                const gameVids = await searchGameHighlights(
                    awayTeam.team.abbreviation,
                    homeTeam.team.abbreviation,
                    game.date
                );
                if (gameVids && Array.isArray(gameVids)) {
                    allVids = [...allVids, ...gameVids.filter(v => v.embeddable)];
                }
                
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
                    const boxscore = summary.boxscore;
                    if (boxscore?.players) {
                        const awayStats = { fg: 0, fga: 0, fg3: 0, fg3a: 0, reb: 0, ast: 0 };
                        const homeStats = { fg: 0, fga: 0, fg3: 0, fg3a: 0, reb: 0, ast: 0 };
                        
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
                            target.ast += stats.assists || 0;
                        });
                        
                        setLiveStats({
                            away: {
                                fgPct: awayStats.fga > 0 ? ((awayStats.fg / awayStats.fga) * 100).toFixed(1) : '0.0',
                                fg3: awayStats.fg3,
                                reb: awayStats.reb,
                                ast: awayStats.ast
                            },
                            home: {
                                fgPct: homeStats.fga > 0 ? ((homeStats.fg / homeStats.fga) * 100).toFixed(1) : '0.0',
                                fg3: homeStats.fg3,
                                reb: homeStats.reb,
                                ast: homeStats.ast
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('Error fetching game summary:', e);
            }
        };

        fetchSummary();
        const interval = setInterval(fetchSummary, 30000);
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

    // Cycle through season stats every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setStatCycleIndex(prev => (prev + 1) % 2); // Toggle between sets
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !game) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#0047BA]/30 border-t-[#0047BA] rounded-full animate-spin" />
                    <div className="text-white/60 text-xl font-semibold uppercase tracking-widest">Loading...</div>
                </div>
            </div>
        );
    }

    const competition = game.competitions?.[0];
    if (!competition) return null;

    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
    const gameState = game.status?.type?.state;
    const isLive = gameState === 'in';
    const basketballData = RIVALRY_DATA.mensBasketball;

    // Get season comparison stats in two sets
    const seasonStats = basketballData?.season2025_2026?.teamComparison?.rows || [];
    const statsSet1 = seasonStats.slice(0, 4);
    const statsSet2 = seasonStats.slice(4, 8);
    const currentSeasonStats = statCycleIndex === 0 ? statsSet1 : statsSet2;

    return (
        <div className="w-full h-full flex flex-col p-6 md:p-8 lg:p-10 gap-5 md:gap-6 lg:gap-8 bg-[#002E5D]">
            {/* Top Score Section */}
            <GlassCard className="flex-none" accentTop noPadding>
                <div className="flex items-center justify-center py-12 md:py-14 lg:py-16 px-12 md:px-16 lg:px-20">
                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-4 md:gap-5 flex-1">
                        <img 
                            src={awayTeam.team.logo} 
                            alt={awayTeam.team.displayName}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
                        />
                        <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
                            {awayTeam.team.abbreviation}
                        </span>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center gap-8 md:gap-12 lg:gap-16 mx-8 md:mx-12 lg:mx-16">
                        <div className={`text-6xl md:text-8xl lg:text-9xl font-black tabular-nums leading-none
                            ${parseInt(awayTeam.score || 0) > parseInt(homeTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}
                            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            {awayTeam.score || '0'}
                        </div>
                        
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-[1px] h-12 md:h-16 bg-white/30" />
                            <span className="text-white text-sm md:text-base font-bold uppercase tracking-widest opacity-80">
                                {isLive ? 'LIVE' : 'VS'}
                            </span>
                            <div className="w-[1px] h-12 md:h-16 bg-white/30" />
                        </div>
                        
                        <div className={`text-6xl md:text-8xl lg:text-9xl font-black tabular-nums leading-none
                            ${parseInt(homeTeam.score || 0) > parseInt(awayTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}
                            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                            {homeTeam.score || '0'}
                        </div>
                    </div>

                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-4 md:gap-5 flex-1">
                        <img 
                            src={homeTeam.team.logo} 
                            alt={homeTeam.team.displayName}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
                        />
                        <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
                            {homeTeam.team.abbreviation}
                        </span>
                    </div>
                </div>

                {/* Game Status Bar */}
                <div className="border-t border-white/10 px-12 md:px-16 py-7 md:py-8 flex items-center justify-center">
                    <span className="text-white text-base md:text-lg lg:text-xl font-semibold uppercase tracking-[0.2em] opacity-90">
                        {isLive ? game.status.type.detail : (game.status.type.shortDetail || formatMountainTime(game.date))}
                    </span>
                </div>
            </GlassCard>

            {/* Three-Column Content Section */}
            <div className="flex-grow flex gap-5 md:gap-6 lg:gap-8 min-h-0">
                {/* Left Column: Live/Game Stats */}
                <GlassCard className="flex-1 flex flex-col" accentTop noPadding>
                    <div className="px-12 md:px-14 lg:px-16 pt-10 md:pt-12 pb-8 border-b border-white/10">
                        <div className="flex items-center justify-center gap-3">
                            {isLive && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                            )}
                            <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-center">
                                {isLive ? 'Live Stats' : 'Game Stats'}
                            </h3>
                        </div>
                    </div>
                    <div className="flex-grow py-8 md:py-10 px-6 md:px-8">
                        {isLive && liveStats ? (
                            <div className="space-y-1">
                                <StatRow label="FG %" awayValue={`${liveStats.away.fgPct}%`} homeValue={`${liveStats.home.fgPct}%`} />
                                <StatRow label="3PT" awayValue={liveStats.away.fg3} homeValue={liveStats.home.fg3} />
                                <StatRow label="REB" awayValue={liveStats.away.reb} homeValue={liveStats.home.reb} />
                                <StatRow label="AST" awayValue={liveStats.away.ast} homeValue={liveStats.home.ast} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-white text-lg md:text-xl font-medium opacity-70">
                                    {gameState === 'pre' ? 'Stats at game time' : 'Final stats'}
                                </span>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Center Column: Media/Highlights */}
                <div className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-white/20 shadow-xl bg-[#002E5D]">
                    <div className="px-10 md:px-12 lg:px-14 py-7 md:py-8 border-b border-white/10">
                        <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-center">
                            Highlights
                        </h3>
                    </div>
                    <div className="flex-grow relative min-h-0 bg-[#002E5D]">
                        {highlights.length > 0 && highlights[mediaIndex] ? (
                            <>
                                <iframe
                                    className="absolute inset-0 w-full h-full border-0"
                                    src={`https://www.youtube.com/embed/${highlights[mediaIndex].videoId}?modestbranding=1&rel=0&autoplay=1&mute=1&loop=1&playlist=${highlights[mediaIndex].videoId}`}
                                    title={highlights[mediaIndex].title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                {/* Video indicator dots */}
                                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {highlights.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                                ${idx === mediaIndex 
                                                    ? 'bg-white scale-125' 
                                                    : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#002E5D]">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-14 h-14 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="text-white text-base font-medium opacity-70">Loading media...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Season Comparison */}
                <GlassCard className="flex-1 flex flex-col" accentTop noPadding>
                    <div className="px-12 md:px-14 lg:px-16 pt-10 md:pt-12 pb-8 border-b border-white/10">
                        <div className="flex flex-col items-center">
                            <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-center">
                                Season Stats
                            </h3>
                            {/* Stats cycle indicator */}
                            <div className="flex gap-2 mt-4">
                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                    ${statCycleIndex === 0 ? 'bg-white' : 'bg-white/30'}`} />
                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                    ${statCycleIndex === 1 ? 'bg-white' : 'bg-white/30'}`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow py-8 md:py-10 px-6 md:px-8">
                        {currentSeasonStats.length > 0 ? (
                            <>
                                {/* Team Labels Header */}
                                <div className="flex items-center justify-between py-5 px-10 md:px-12 border-b border-white/15 mb-3">
                                    <span className="text-white text-sm md:text-base font-bold uppercase tracking-widest opacity-70">
                                        Stat
                                    </span>
                                    <div className="flex items-center gap-10 md:gap-12">
                                        <span className="text-white text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide min-w-[90px] text-center">
                                            BYU
                                        </span>
                                        <div className="w-[1px] h-6 bg-white/20" />
                                        <span className="text-white text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide min-w-[90px] text-center opacity-80">
                                            UTAH
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {currentSeasonStats.map((row, i) => (
                                        <StatRow 
                                            key={i}
                                            label={row[0]} 
                                            awayValue={row[1]} 
                                            homeValue={row[2]}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-white text-lg md:text-xl font-medium opacity-70">
                                    Season data loading...
                                </span>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default HolyWarDashboard;
