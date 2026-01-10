import React, { useState, useEffect } from 'react';
import { formatMountainTime } from '../../utils/timeUtils';
import { searchGameHighlights, searchHighlights } from '../../services/youtube';
import { getGameSummary } from '../../services/espn';
import { RIVALRY_DATA } from '../../config/rivalryData';

/**
 * Holy War TV Dashboard - ESPN-inspired design
 * Clean, modern, professional with BYU colors
 */

// ESPN-style Card - Flat, minimal, clean
const ESPNCard = ({ children, className = '', noPadding = false }) => (
    <div className={`
        bg-[#001a3d] 
        shadow-md
        ${className}
    `}>
        {noPadding ? children : <div className="p-4 md:p-5 lg:p-6">{children}</div>}
    </div>
);

// ESPN-style Stat Row - Clean, readable
const StatRow = ({ label, awayValue, homeValue }) => (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors">
        <span className="text-white/70 text-sm font-medium uppercase tracking-wide">
            {label}
        </span>
        <div className="flex items-center gap-8">
            <span className="text-white text-xl font-bold tabular-nums w-16 text-right">
                {awayValue}
            </span>
            <div className="w-px h-6 bg-white/20" />
            <span className="text-white/60 text-xl font-bold tabular-nums w-16 text-left">
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
            setStatCycleIndex(prev => (prev + 1) % 2);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !game) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#002E5D]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    <div className="text-white/60 text-sm font-medium uppercase">Loading...</div>
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
        <div className="w-full h-full flex flex-col p-3 gap-3 bg-[#002E5D]">
            {/* Top Score Section - ESPN style */}
            <ESPNCard className="flex-none" noPadding>
                <div className="flex items-center justify-center py-8 px-6">
                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <img 
                            src={awayTeam.team.logo} 
                            alt={awayTeam.team.displayName}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                        <span className="text-white text-sm font-bold uppercase">
                            {awayTeam.team.abbreviation}
                        </span>
                    </div>

                    {/* Score Display - ESPN style */}
                    <div className="flex items-center gap-6 mx-6">
                        <div className={`text-5xl md:text-6xl font-black tabular-nums leading-none
                            ${parseInt(awayTeam.score || 0) > parseInt(homeTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}>
                            {awayTeam.score || '0'}
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                            {isLive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                            <span className="text-white/60 text-xs font-bold uppercase">
                                {isLive ? 'LIVE' : 'VS'}
                            </span>
                        </div>
                        
                        <div className={`text-5xl md:text-6xl font-black tabular-nums leading-none
                            ${parseInt(homeTeam.score || 0) > parseInt(awayTeam.score || 0) 
                                ? 'text-white' 
                                : 'text-white/40'}`}>
                            {homeTeam.score || '0'}
                        </div>
                    </div>

                    {/* Home Team - Grayscale Utah */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <img 
                            src={homeTeam.team.logo} 
                            alt={homeTeam.team.displayName}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                            style={{ filter: 'grayscale(100%) brightness(1.5)' }}
                        />
                        <span className="text-white text-sm font-bold uppercase">
                            {homeTeam.team.abbreviation}
                        </span>
                    </div>
                </div>

                {/* Game Status Bar - thin divider */}
                <div className="border-t border-white/10 px-6 py-3 bg-black/20">
                    <div className="text-white/80 text-xs font-medium uppercase tracking-wide text-center">
                        {isLive ? game.status.type.detail : (game.status.type.shortDetail || formatMountainTime(game.date))}
                    </div>
                </div>
            </ESPNCard>

            {/* Three-Column Content Section */}
            <div className="flex-grow flex gap-3 min-h-0">
                {/* Left Column: Live/Game Stats */}
                <ESPNCard className="flex-1 flex flex-col min-w-0" noPadding>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            {isLive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">
                                {isLive ? 'Live Stats' : 'Game Stats'}
                            </h3>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-grow overflow-y-auto">
                        {isLive && liveStats ? (
                            <div>
                                <StatRow label="FG %" awayValue={`${liveStats.away.fgPct}%`} homeValue={`${liveStats.home.fgPct}%`} />
                                <StatRow label="3PT" awayValue={liveStats.away.fg3} homeValue={liveStats.home.fg3} />
                                <StatRow label="REB" awayValue={liveStats.away.reb} homeValue={liveStats.home.reb} />
                                <StatRow label="AST" awayValue={liveStats.away.ast} homeValue={liveStats.home.ast} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-4">
                                <span className="text-white/50 text-sm">
                                    {gameState === 'pre' ? 'Stats available at game time' : 'Final stats'}
                                </span>
                            </div>
                        )}
                    </div>
                </ESPNCard>

                {/* Center Column: Media/Highlights */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#001a3d] shadow-md">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/10">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wide">
                            Highlights
                        </h3>
                    </div>
                    {/* Video */}
                    <div className="flex-grow relative bg-black">
                        {highlights.length > 0 && highlights[mediaIndex] ? (
                            <>
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${highlights[mediaIndex].videoId}?modestbranding=1&rel=0&autoplay=1&mute=1&loop=1&playlist=${highlights[mediaIndex].videoId}`}
                                    title={highlights[mediaIndex].title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                {/* Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                    {highlights.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all
                                                ${idx === mediaIndex ? 'bg-white w-2 h-2' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span className="text-white/50 text-xs">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Season Comparison */}
                <ESPNCard className="flex-1 flex flex-col min-w-0" noPadding>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">
                                Season Stats
                            </h3>
                            {/* Cycle dots */}
                            <div className="flex gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full transition-all
                                    ${statCycleIndex === 0 ? 'bg-white w-2 h-2' : 'bg-white/30'}`} />
                                <div className={`w-1.5 h-1.5 rounded-full transition-all
                                    ${statCycleIndex === 1 ? 'bg-white w-2 h-2' : 'bg-white/30'}`} />
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-grow overflow-y-auto">
                        {currentSeasonStats.length > 0 ? (
                            <>
                                {/* Team Labels */}
                                <div className="flex items-center justify-between py-2 px-4 bg-white/5 sticky top-0">
                                    <span className="text-white/50 text-xs font-bold uppercase">Stat</span>
                                    <div className="flex items-center gap-8">
                                        <span className="text-white text-xs font-bold uppercase w-16 text-right">BYU</span>
                                        <div className="w-px h-4 bg-white/20" />
                                        <span className="text-white/60 text-xs font-bold uppercase w-16 text-left">UTAH</span>
                                    </div>
                                </div>
                                {/* Stats */}
                                <div>
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
                            <div className="h-full flex items-center justify-center p-4">
                                <span className="text-white/50 text-sm">Loading stats...</span>
                            </div>
                        )}
                    </div>
                </ESPNCard>
            </div>
        </div>
    );
};

export default HolyWarDashboard;
