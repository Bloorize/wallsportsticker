import React, { useState, useEffect } from 'react';
import { formatMountainTime } from '../../utils/timeUtils';
import { searchGameHighlights, searchHighlights } from '../../services/youtube';
import { getGameSummary } from '../../services/espn';
import { RIVALRY_DATA } from '../../config/rivalryData';

/**
 * Holy War Dashboard - Proper layout with floating elements
 * NO GRADIENTS - Solid colors only
 * PADDING EVERYWHERE - Text never touches edges
 */

// Stat Avatar Component - Like IntelligenceHub
const StatAvatar = ({ imageUrl, teamAbbrev, isError, onError }) => {
    return (
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white border border-white/10 overflow-hidden rounded-lg relative flex-shrink-0">
            {imageUrl && !isError ? (
                <img 
                    src={imageUrl} 
                    className="w-full h-full object-cover" 
                    alt=""
                    onError={onError}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <span className="text-white/40 text-[8px] md:text-[9px] font-black uppercase">
                        {teamAbbrev || '---'}
                    </span>
                </div>
            )}
        </div>
    );
};

// Live Stats Section Component - With clear HEADING and team logos
const LiveStatsSection = ({ stats, awayTeam, homeTeam }) => {
    const [awayLogoError, setAwayLogoError] = useState(false);
    const [homeLogoError, setHomeLogoError] = useState(false);
    
    if (!stats) return null;
    
    return (
        <div className="bg-[#001428] p-4 md:p-5 lg:p-6">
            {/* HEADING */}
            <div className="border-b border-white/20 pb-3 mb-4 px-4">
                <h3 className="text-white text-base md:text-lg font-bold uppercase tracking-wide mb-2">
                    LIVE STATS
                </h3>
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 text-xs md:text-sm text-white/60">
                    <span className="w-24 md:w-32 text-center">STAT</span>
                    <div className="w-16 md:w-20 flex justify-center">
                        <StatAvatar 
                            imageUrl={awayTeam?.logo} 
                            teamAbbrev={awayTeam?.abbreviation}
                            isError={awayLogoError}
                            onError={() => setAwayLogoError(true)}
                        />
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="w-16 md:w-20 flex justify-center">
                        <StatAvatar 
                            imageUrl={homeTeam?.logo} 
                            teamAbbrev={homeTeam?.abbreviation}
                            isError={homeLogoError}
                            onError={() => setHomeLogoError(true)}
                        />
                    </div>
                </div>
            </div>
            
            {/* Stats Rows */}
            <div className="space-y-2">
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 py-2 px-4 hover:bg-white/5 rounded transition-colors">
                    <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide w-24 md:w-32 text-center">
                        FG%
                    </span>
                    <span className="text-white text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.away.fgPct}%
                    </span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-white/60 text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.home.fgPct}%
                    </span>
                </div>
                
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 py-2 px-4 hover:bg-white/5 rounded transition-colors">
                    <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide w-24 md:w-32 text-center">
                        3PT
                    </span>
                    <span className="text-white text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.away.fg3}
                    </span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-white/60 text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.home.fg3}
                    </span>
                </div>
                
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 py-2 px-4 hover:bg-white/5 rounded transition-colors">
                    <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide w-24 md:w-32 text-center">
                        REB
                    </span>
                    <span className="text-white text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.away.reb}
                    </span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-white/60 text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.home.reb}
                    </span>
                </div>
                
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 py-2 px-4 hover:bg-white/5 rounded transition-colors">
                    <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide w-24 md:w-32 text-center">
                        AST
                    </span>
                    <span className="text-white text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.away.ast}
                    </span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-white/60 text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                        {stats.home.ast}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Season Stats Panel - With clear HEADING and team logos
const SeasonStatsPanel = ({ stats, cycleIndex, awayTeam, homeTeam }) => {
    const statsSet1 = stats.slice(0, 4);
    const statsSet2 = stats.slice(4, 8);
    const currentStats = cycleIndex === 0 ? statsSet1 : statsSet2;
    const [awayLogoError, setAwayLogoError] = useState(false);
    const [homeLogoError, setHomeLogoError] = useState(false);
    
    return (
        <div className="bg-[#001428] h-full flex flex-col shadow-2xl border border-white/10 overflow-hidden">
            {/* Header with HEADING */}
            <div className="px-4 md:px-5 lg:px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-base md:text-lg font-bold uppercase tracking-wide">
                        SEASON STATS
                    </h3>
                    <div className="flex gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${cycleIndex === 0 ? 'bg-white w-2 h-2' : 'bg-white/30'}`} />
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${cycleIndex === 1 ? 'bg-white w-2 h-2' : 'bg-white/30'}`} />
                    </div>
                </div>
                {/* Column Headers with logos */}
                <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 text-xs md:text-sm text-white/60 px-4">
                    <span className="w-24 md:w-32 text-center">STAT</span>
                    <div className="w-16 md:w-20 flex justify-center">
                        <StatAvatar 
                            imageUrl={awayTeam?.logo} 
                            teamAbbrev={awayTeam?.abbreviation}
                            isError={awayLogoError}
                            onError={() => setAwayLogoError(true)}
                        />
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="w-16 md:w-20 flex justify-center">
                        <StatAvatar 
                            imageUrl={homeTeam?.logo} 
                            teamAbbrev={homeTeam?.abbreviation}
                            isError={homeLogoError}
                            onError={() => setHomeLogoError(true)}
                        />
                    </div>
                </div>
            </div>
            
            {/* Stats */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
                {currentStats.length > 0 ? (
                    <div className="space-y-2">
                        {currentStats.map((row, i) => (
                            <div key={i} className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 py-2 px-4 hover:bg-white/5 rounded transition-colors">
                                <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wide w-24 md:w-32 text-center">
                                    {row[0]}
                                </span>
                                <span className="text-white text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                                    {row[1]}
                                </span>
                                <div className="w-px h-4 bg-white/20" />
                                <span className="text-white/60 text-base md:text-lg font-bold tabular-nums w-16 md:w-20 text-center">
                                    {row[2]}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center px-4">
                        <span className="text-white/50 text-xs md:text-sm">Loading stats...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

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

    // Rotate media every 1 minute
    useEffect(() => {
        if (highlights.length === 0) return;
        const interval = setInterval(() => {
            setMediaIndex(prev => (prev + 1) % highlights.length);
        }, 60000);
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
            <div className="w-full h-full flex items-center justify-center bg-[#002E5D] p-4">
                <div className="flex flex-col items-center gap-4 p-4">
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
    const seasonStats = basketballData?.season2025_2026?.teamComparison?.rows || [];

    return (
        <div className="w-full h-full flex flex-col bg-[#002E5D] p-4 md:p-5 lg:p-6 gap-4 md:gap-5 lg:gap-6">
            {/* Top Score Section */}
            <div className="flex-none bg-[#001428] p-6 md:p-8 lg:p-10 rounded-lg border border-white/10">
                {/* THE HOLY WAR text centered above score */}
                <div className="text-center mb-4 px-4">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-none mb-1">
                        THE HOLY WAR
                    </h1>
                    <p className="text-sm md:text-base font-medium text-white/60 uppercase tracking-wider">
                        BYU vs UTAH
                    </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
                    {/* Away Team Logo - CLOSER to score */}
                    <div className="flex flex-col items-center gap-2 md:gap-3 flex-shrink-0 px-4">
                        <img 
                            src={awayTeam.team.logo} 
                            alt={awayTeam.team.displayName}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-2xl"
                        />
                        <span className="text-white text-base md:text-lg lg:text-xl font-black uppercase tracking-wide">
                            {awayTeam.team.abbreviation}
                        </span>
                    </div>

                    {/* Score Display - HUGE */}
                    <div className="flex flex-col items-center justify-center px-4">
                        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
                            <div className={`text-6xl md:text-7xl lg:text-8xl font-black tabular-nums leading-none
                                ${parseInt(awayTeam.score || 0) > parseInt(homeTeam.score || 0) 
                                    ? 'text-white' 
                                    : 'text-white/50'}`}>
                                {awayTeam.score || '0'}
                            </div>
                            
                            <div className="flex flex-col items-center gap-2 px-2">
                                {isLive && (
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
                                )}
                                <span className="text-white/80 text-sm md:text-base font-black uppercase tracking-widest">
                                    {isLive ? 'LIVE' : 'VS'}
                                </span>
                            </div>
                            
                            <div className={`text-6xl md:text-7xl lg:text-8xl font-black tabular-nums leading-none
                                ${parseInt(homeTeam.score || 0) > parseInt(awayTeam.score || 0) 
                                    ? 'text-white' 
                                    : 'text-white/50'}`}>
                                {homeTeam.score || '0'}
                            </div>
                        </div>
                        
                        {/* Game Status Badge */}
                        <div className="mt-4 px-6 py-2 bg-black/40 rounded-full border border-white/20">
                            <span className="text-white/90 text-xs md:text-sm font-bold uppercase tracking-wider">
                                {isLive ? game.status.type.detail : (game.status.type.shortDetail || formatMountainTime(game.date))}
                            </span>
                        </div>
                    </div>

                    {/* Home Team Logo - CLOSER to score, RED */}
                    <div className="flex flex-col items-center gap-2 md:gap-3 flex-shrink-0 px-4">
                        <img 
                            src={homeTeam.team.logo} 
                            alt={homeTeam.team.displayName}
                            className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain drop-shadow-2xl"
                            style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(94%) saturate(7151%) hue-rotate(358deg) brightness(95%) contrast(118%)' }}
                        />
                        <span className="text-white text-base md:text-lg lg:text-xl font-black uppercase tracking-wide">
                            {homeTeam.team.abbreviation}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Area: Video + Stats */}
            <div className="flex-1 flex gap-4 md:gap-5 lg:gap-6 min-h-0">
                {/* Video Section - 16:9 Landscape Container */}
                <div className="flex-[7] flex flex-col min-w-0">
                    <div className="flex-1 bg-[#001428] rounded-lg overflow-hidden shadow-2xl relative">
                        {highlights.length > 0 && highlights[mediaIndex] ? (
                            <>
                                {/* 16:9 aspect ratio container */}
                                <div className="aspect-video w-full">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${highlights[mediaIndex].videoId}?modestbranding=1&rel=0&autoplay=1&mute=1&loop=1&playlist=${highlights[mediaIndex].videoId}`}
                                        title={highlights[mediaIndex].title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                {/* Video indicator dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {highlights.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all
                                                ${idx === mediaIndex ? 'bg-white w-2.5 h-2.5 shadow-lg' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="aspect-video w-full flex items-center justify-center bg-[#001428]">
                                <div className="flex flex-col items-center gap-3 p-4">
                                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span className="text-white/50 text-sm">Loading highlights...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Panel - Right Side */}
                <div className="flex-[3] flex flex-col min-w-0">
                    {isLive && liveStats ? (
                        <LiveStatsSection stats={liveStats} awayTeam={awayTeam.team} homeTeam={homeTeam.team} />
                    ) : (
                        <SeasonStatsPanel stats={seasonStats} cycleIndex={statCycleIndex} awayTeam={awayTeam.team} homeTeam={homeTeam.team} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HolyWarDashboard;
