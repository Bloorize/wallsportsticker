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

// Glass Card Component
const GlassCard = ({ children, className = '', glow = false, accentTop = false, noPadding = false }) => (
    <div className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.06] backdrop-blur-xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${glow ? 'shadow-[0_0_60px_rgba(0,71,186,0.15)]' : ''}
        ${className}
    `}>
        {/* Top accent line */}
        {accentTop && (
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-[#0047BA]/50" />
        )}
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-white/[0.04] rounded-2xl pointer-events-none" />
        <div className={`relative z-10 h-full ${noPadding ? '' : 'p-6 md:p-8 lg:p-10'}`}>
            {children}
        </div>
    </div>
);

// Stat Row Component - with explicit padding to prevent edge touching
const StatRow = ({ label, awayValue, homeValue, highlight = false }) => (
    <div className={`
        flex items-center justify-between py-4 md:py-5 px-6 md:px-8 lg:px-10
        ${highlight ? 'bg-[#0047BA]/20 rounded-xl' : ''}
        transition-all duration-300 hover:bg-white/[0.05] rounded-lg
    `}>
        <span className="text-white/60 uppercase"
            style={{ 
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em'
            }}>
            {label}
        </span>
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
            <span className="text-white min-w-[70px] text-center"
                style={{ 
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 600
                }}>
                {awayValue}
            </span>
            <div className="w-[2px] h-6 bg-white/20 rounded-full" />
            <span className="text-white min-w-[70px] text-center"
                style={{ 
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 600
                }}>
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
                    <div className="text-white/60"
                        style={{ 
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: '13px',
                            fontWeight: 500
                        }}>
                        Loading...
                    </div>
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
        <div className="w-full h-full flex flex-col p-4 md:p-5 lg:p-6 gap-4 md:gap-5 lg:gap-6">
            {/* Top Score Section */}
            <GlassCard className="flex-none" glow accentTop noPadding>
                <div className="flex items-center justify-center py-8 md:py-10 lg:py-12 px-8 md:px-12 lg:px-16">
                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-3 flex-1">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150" />
                            <img 
                                src={awayTeam.team.logo} 
                                alt={awayTeam.team.displayName}
                                className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain relative z-10 drop-shadow-2xl"
                            />
                        </div>
                        <span className="text-white/70"
                            style={{ 
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '22px',
                                fontWeight: 700,
                                letterSpacing: '0.02em'
                            }}>
                            {awayTeam.team.abbreviation}
                        </span>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center gap-4 md:gap-6 lg:gap-8 mx-4 md:mx-8 lg:mx-12">
                        <div className={`leading-none
                            ${parseInt(awayTeam.score || 0) > parseInt(homeTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}
                            style={{ 
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: '72px',
                                fontWeight: 700
                            }}>
                            {awayTeam.score || '0'}
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <div className="w-1 h-8 md:h-12 bg-[#0047BA] rounded-full" />
                            <span className="text-[#0047BA] uppercase"
                                style={{ 
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    letterSpacing: '0.2em'
                                }}>
                                {isLive ? 'LIVE' : 'VS'}
                            </span>
                            <div className="w-1 h-8 md:h-12 bg-[#0047BA] rounded-full" />
                        </div>
                        
                        <div className={`leading-none
                            ${parseInt(homeTeam.score || 0) > parseInt(awayTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}
                            style={{ 
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: '72px',
                                fontWeight: 700
                            }}>
                            {homeTeam.score || '0'}
                        </div>
                    </div>

                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-3 flex-1">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150" />
                            <img 
                                src={homeTeam.team.logo} 
                                alt={homeTeam.team.displayName}
                                className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain relative z-10 drop-shadow-2xl"
                            />
                        </div>
                        <span className="text-white/70"
                            style={{ 
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '22px',
                                fontWeight: 700,
                                letterSpacing: '0.02em'
                            }}>
                            {homeTeam.team.abbreviation}
                        </span>
                    </div>
                </div>

                {/* Game Status Bar */}
                <div className="px-8 md:px-12 py-5 md:py-6 flex items-center justify-center">
                    <span className="text-[#0047BA]"
                        style={{ 
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: '16px',
                            fontWeight: 500
                        }}>
                        {isLive ? game.status.type.detail : (game.status.type.shortDetail || formatMountainTime(game.date))}
                    </span>
                </div>
            </GlassCard>

            {/* Three-Column Content Section */}
            <div className="flex-grow flex gap-3 md:gap-4 lg:gap-6 min-h-0">
                {/* Left Column: Live/Game Stats */}
                <GlassCard className="flex-1 flex flex-col" accentTop noPadding>
                    <div className="px-8 md:px-10 lg:px-12 pt-6 md:pt-8 pb-4">
                        <div className="flex items-center justify-center gap-3">
                            {isLive && (
                                <div className="w-2.5 h-2.5 bg-[#0047BA] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,71,186,0.8)]" />
                            )}
                        <h3 className="text-white uppercase text-center"
                            style={{ 
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '18px',
                                fontWeight: 700,
                                letterSpacing: '0.12em'
                            }}>
                            {isLive ? 'Live Stats' : 'Game Stats'}
                        </h3>
                        </div>
                    </div>
                    <div className="flex-grow py-4 md:py-6">
                        {isLive && liveStats ? (
                            <div className="space-y-2">
                                <StatRow label="FG %" awayValue={`${liveStats.away.fgPct}%`} homeValue={`${liveStats.home.fgPct}%`} />
                                <StatRow label="3PT" awayValue={liveStats.away.fg3} homeValue={liveStats.home.fg3} />
                                <StatRow label="REB" awayValue={liveStats.away.reb} homeValue={liveStats.home.reb} />
                                <StatRow label="AST" awayValue={liveStats.away.ast} homeValue={liveStats.home.ast} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center px-8 md:px-10 lg:px-12">
                                <span className="text-white/40"
                                    style={{ 
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        fontSize: '13px',
                                        fontWeight: 500
                                    }}>
                                    {gameState === 'pre' ? 'Stats at game time' : 'Final stats'}
                                </span>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Center Column: Media/Highlights */}
                <GlassCard className="flex-1 flex flex-col overflow-hidden" glow noPadding>
                    <div className="px-6 md:px-8 lg:px-10 py-5 md:py-6">
                        <h3 className="text-white uppercase text-center"
                            style={{ 
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '18px',
                                fontWeight: 700,
                                letterSpacing: '0.12em'
                            }}>
                            Highlights
                        </h3>
                    </div>
                    <div className="flex-grow relative min-h-0">
                        {highlights.length > 0 && highlights[mediaIndex] ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${highlights[mediaIndex].videoId}?modestbranding=1&rel=0&autoplay=1&mute=1&loop=1&playlist=${highlights[mediaIndex].videoId}`}
                                    title={highlights[mediaIndex].title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#002E5D]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-2 border-[#0047BA]/40 border-t-[#0047BA] rounded-full animate-spin" />
                                    <span className="text-white/40"
                                        style={{ 
                                            fontFamily: "'IBM Plex Sans', sans-serif",
                                            fontSize: '13px',
                                            fontWeight: 500
                                        }}>
                                        {highlights.length === 0 ? 'No highlights available' : 'Loading media...'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Right Column: Season Comparison */}
                <GlassCard className="flex-1 flex flex-col" accentTop noPadding>
                    <div className="px-8 md:px-10 lg:px-12 pt-6 md:pt-8 pb-4">
                        <div className="flex flex-col items-center">
                            <h3 className="text-white uppercase text-center"
                                style={{ 
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em'
                                }}>
                                Season Stats
                            </h3>
                            {/* Stats cycle indicator */}
                            <div className="flex gap-2 mt-2">
                                <div className={`w-2 h-2 rounded-full transition-all duration-300
                                    ${statCycleIndex === 0 ? 'bg-[#0047BA]' : 'bg-white/20'}`} />
                                <div className={`w-2 h-2 rounded-full transition-all duration-300
                                    ${statCycleIndex === 1 ? 'bg-[#0047BA]' : 'bg-white/20'}`} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow py-4 md:py-6">
                        {currentSeasonStats.length > 0 ? (
                            <div className="space-y-2">
                                {currentSeasonStats.map((row, i) => (
                                    <StatRow 
                                        key={i}
                                        label={row[0]} 
                                        awayValue={row[1]} 
                                        homeValue={row[2]}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center px-8 md:px-10 lg:px-12">
                                <span className="text-white/40"
                                    style={{ 
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        fontSize: '13px',
                                        fontWeight: 500
                                    }}>
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
