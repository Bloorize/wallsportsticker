import React, { useEffect, useState } from 'react';
import SpotlightGame from './SpotlightGame';
import IntelligenceHub from './IntelligenceHub';
import { FAVORITES } from '../../config/favorites';
import { formatMountainTime } from '../../utils/timeUtils';

const isFavoriteGame = (game) => {
    if (!game.competitions || !game.competitions[0]) return false;
    const competitors = game.competitions[0].competitors;
    const teamAbbrevs = competitors.map(c => c.team.abbreviation);
    const allFavs = [...FAVORITES.football.teams, ...FAVORITES.basketball.leagues.flatMap(l => l.teams)];
    return teamAbbrevs.some(abbr => allFavs.includes(abbr));
};

const Dashboard = ({ filter, onFilterChange, allGames, loading, isHolyWar = false }) => {
    const [filteredGames, setFilteredGames] = useState([]);
    const [spotlightIndex, setSpotlightIndex] = useState(0);
    const [marqueeOffset, setMarqueeOffset] = useState(280);
    const [isPaused, setIsPaused] = useState(false);

    const CATEGORIES = [
        { id: 'All', label: 'Scoreboard' },
        { id: 'NCAAM', label: 'NCAA Basketball' },
        { id: 'NCAAF', label: 'NCAA Football' },
        { id: 'NFL', label: 'NFL' },
        { id: 'NBA', label: 'NBA' },
        { id: 'MLB', label: 'MLB' },
        { id: 'NHL', label: 'NHL' },
        { id: 'SOCCER', label: 'Soccer' },
    ];

    useEffect(() => {
        if (filter === 'All') {
            setFilteredGames(allGames);
        } else {
            setFilteredGames(allGames.filter(g => g._category === filter));
        }
        // Only reset spotlight index if not paused and games actually changed
        if (!isPaused) {
            setSpotlightIndex(0);
        }
    }, [filter, allGames, isPaused]);

    // Update rotation timing to 10 seconds (10000ms)
    useEffect(() => {
        if (filteredGames.length <= 1 || isPaused) return;
        const interval = setInterval(() => {
            setSpotlightIndex(prev => (prev + 1) % filteredGames.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [filteredGames.length, isPaused]);

    const handleNext = () => {
        if (filteredGames.length <= 1) return;
        setSpotlightIndex(prev => (prev + 1) % filteredGames.length);
    };

    // Calculate marquee offset based on screen size
    useEffect(() => {
        const updateMarqueeOffset = () => {
            if (window.innerWidth >= 1024) {
                setMarqueeOffset(320); // lg: w-80 = 320px
            } else if (window.innerWidth >= 768) {
                setMarqueeOffset(300); // md: w-[300px]
            } else {
                setMarqueeOffset(280); // default: w-[280px]
            }
        };
        
        updateMarqueeOffset();
        window.addEventListener('resize', updateMarqueeOffset);
        return () => window.removeEventListener('resize', updateMarqueeOffset);
    }, []);

    return (
        <div className={`flex flex-col lg:flex-row gap-0 h-full overflow-hidden min-h-0 ${isHolyWar ? 'bg-white' : 'bg-[#0a0a0a]'}`}>
            {/* Primary Stage (Left) */}
            <div className="flex-1 lg:flex-[3] flex flex-col min-w-0 h-full p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8">

                {/* ESPN Style Category Header */}
                <div className="flex-none flex items-center bg-[#1a1b1c] border-b-2 border-white/5 shadow-2xl">
                    <div className="bg-red-700 px-4 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4 flex items-center justify-center min-w-[80px] md:min-w-[100px] lg:min-w-[120px]">
                        <span className="text-base md:text-lg lg:text-xl font-black italic tracking-tighter text-white">
                            {filter === 'All' ? 'SCORE' : filter}
                        </span>
                    </div>
                    <div className="flex gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-10 overflow-x-auto no-scrollbar py-3 md:py-3.5 lg:py-4 flex-grow">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                    className={`
                                    text-xs font-black uppercase tracking-[0.2em] transition-all min-w-max border-b-4 px-2 py-2 md:py-1
                                    ${filter === cat.id
                                        ? (isHolyWar ? 'border-[#0047BA] text-white' : 'border-red-600 text-white')
                                        : 'border-transparent text-white/40'}
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Minimal Controls */}
                    <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 lg:px-8 h-full border-l border-white/10 bg-white/5">
                        <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className="flex items-center gap-2 group outline-none"
                            title={isPaused ? "Resume Rotation" : "Pause Rotation"}
                        >
                            <div className={`w-2 h-2 rounded-full ${isPaused ? (isHolyWar ? 'bg-[#0047BA] shadow-[0_0_10px_rgba(0,71,186,1)]' : 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,1)]') : 'bg-green-500 animate-pulse'} transition-all`} />
                            <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${isPaused ? (isHolyWar ? 'text-[#0047BA]' : 'text-red-500') : 'text-white/40 group-hover:text-white'}`}>
                                {isPaused ? 'Paused' : 'Live'}
                            </span>
                        </button>
                        <button 
                            onClick={handleNext}
                            className="group flex items-center gap-2 outline-none border-l border-white/5 pl-4 md:pl-6"
                            title="Next Game"
                        >
                            <span className="text-[10px] md:text-xs font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] transition-colors">Next</span>
                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white/40 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                                <path d="M5 3l14 9-14 9V3z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-grow relative min-h-0 flex flex-col gap-4 md:gap-6 lg:gap-8">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse text-red-600 font-black tracking-widest">LOADING FEED...</div>
                    ) : filteredGames.length > 0 ? (
                        <>
                            <div className="flex-grow">
                                <SpotlightGame key={filteredGames[spotlightIndex]?.id} game={filteredGames[spotlightIndex]} isHolyWar={isHolyWar} />
                            </div>

                            {/* Horizontal Stepped Marquee */}
                            <div className={`flex-none h-32 md:h-40 lg:h-48 relative overflow-hidden ${isHolyWar ? 'bg-white border-y border-[#0047BA]' : 'bg-black/40 border-y border-white/5'}`}>
                                <div className={`absolute top-0 left-0 bottom-0 w-16 md:w-24 lg:w-32 ${isHolyWar ? 'bg-white' : 'bg-black'} z-10 pointer-events-none opacity-50`} />
                                <div className={`absolute top-0 right-0 bottom-0 w-16 md:w-24 lg:w-32 ${isHolyWar ? 'bg-white' : 'bg-black'} z-10 pointer-events-none opacity-50`} />

                                <div className="h-full flex items-center px-4 md:px-6 lg:px-10">
                                    <div
                                        className="flex gap-0 transition-transform duration-700 ease-in-out"
                                        style={{ transform: `translateX(-${spotlightIndex * marqueeOffset}px)` }}
                                    >
                                        {filteredGames.map((game, idx) => {
                                            const competition = game.competitions?.[0];
                                            if (!competition) return null;
                                            const home = competition.competitors.find(c => c.homeAway === 'home');
                                            const away = competition.competitors.find(c => c.homeAway === 'away');
                                            const isActualSelected = idx === spotlightIndex;

                                            return (
                                                <div
                                                    key={`${game.id}-${idx}`}
                                                    className={`
                                                        flex-none w-[280px] md:w-[300px] lg:w-80 h-full p-4 md:p-5 lg:p-6 border-r border-white/5 transition-colors relative
                                                        ${isActualSelected ? (isHolyWar ? 'bg-[#0047BA]/20' : 'bg-red-950/20') : 'bg-transparent'}
                                                    `}
                                                >
                                                    {isActualSelected && (
                                                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isHolyWar ? 'bg-[#0047BA]' : 'bg-red-600'}`} />
                                                    )}
                                                    <div className="flex justify-between items-center h-full">
                                                        <div className="flex flex-col items-center gap-1 md:gap-2 w-1/3">
                                                            <img src={away.team.logo} className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain" alt="" />
                                                            <span className="text-[10px] md:text-xs font-black text-white/40 uppercase">{away.team.abbreviation}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center flex-grow gap-1 md:gap-2">
                                                            <div className="text-lg md:text-xl lg:text-2xl font-mono font-black text-white flex gap-2 md:gap-3 tabular-nums">
                                                                <span className={parseInt(away.score) > parseInt(home.score) ? 'text-white' : 'text-white/30'}>{away.score}</span>
                                                                <span className="text-white/10">-</span>
                                                                <span className={parseInt(home.score) > parseInt(away.score) ? 'text-white' : 'text-white/30'}>{home.score}</span>
                                                            </div>
                                                            <span className={`text-[9px] md:text-[10px] font-black ${isHolyWar ? 'text-[#0047BA]' : 'text-red-500'} uppercase tracking-widest`}>
                                                                {(() => {
                                                                    // Format date and time in Mountain Time
                                                                    if (!game.date) return game.status.type.shortDetail;
                                                                    const gameDate = new Date(game.date);
                                                                    if (isNaN(gameDate.getTime())) return game.status.type.shortDetail;
                                                                    
                                                                    const dateStr = gameDate.toLocaleDateString('en-US', {
                                                                        timeZone: 'America/Denver',
                                                                        month: 'numeric',
                                                                        day: 'numeric'
                                                                    });
                                                                    const timeStr = formatMountainTime(game.date);
                                                                    return `${dateStr} - ${timeStr}`;
                                                                })()}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1 md:gap-2 w-1/3">
                                                            <img src={home.team.logo} className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain" alt="" />
                                                            <span className="text-[10px] md:text-xs font-black text-white/40 uppercase">{home.team.abbreviation}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 bg-black/20 border border-white/5">
                            <span className="text-2xl font-black text-white/60">NO STREAMS AVAILABLE</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Rail (Right) - Intelligence Hub */}
            <div className="w-full lg:w-[550px] md:w-[400px] flex flex-col h-auto lg:h-full bg-[#1a1b1c] border-t lg:border-t-0 lg:border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
                <IntelligenceHub game={filteredGames[spotlightIndex]} />
            </div>
        </div>
    );
};

export default Dashboard;
