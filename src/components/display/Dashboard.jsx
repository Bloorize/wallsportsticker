import React, { useEffect, useState } from 'react';
import SpotlightGame from './SpotlightGame';
import IntelligenceHub from './IntelligenceHub';
import { FAVORITES } from '../../config/favorites';

const isFavoriteGame = (game) => {
    if (!game.competitions || !game.competitions[0]) return false;
    const competitors = game.competitions[0].competitors;
    const teamAbbrevs = competitors.map(c => c.team.abbreviation);
    const allFavs = [...FAVORITES.football.teams, ...FAVORITES.basketball.leagues.flatMap(l => l.teams)];
    return teamAbbrevs.some(abbr => allFavs.includes(abbr));
};

const Dashboard = ({ filter, onFilterChange, allGames, loading }) => {
    const [filteredGames, setFilteredGames] = useState([]);
    const [spotlightIndex, setSpotlightIndex] = useState(0);

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
        setSpotlightIndex(0);
    }, [filter, allGames]);

    // Update rotation timing to 10 seconds (10000ms)
    useEffect(() => {
        if (filteredGames.length <= 1) return;
        const interval = setInterval(() => {
            setSpotlightIndex(prev => (prev + 1) % filteredGames.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [filteredGames.length]);

    return (
        <div className="flex gap-0 h-full overflow-hidden min-h-0 bg-[#0a0a0a]">
            {/* Primary Stage (Left) */}
            <div className="flex-[3] flex flex-col min-w-0 h-full p-8 gap-8">

                {/* ESPN Style Category Header */}
                <div className="flex-none flex items-center bg-[#1a1b1c] border-b-2 border-white/5 shadow-2xl">
                    <div className="bg-red-700 px-6 py-4 flex items-center justify-center min-w-[120px]">
                        <span className="text-xl font-black italic tracking-tighter text-white">
                            {filter === 'All' ? 'SCORE' : filter}
                        </span>
                    </div>
                    <div className="flex gap-8 px-8 overflow-x-auto no-scrollbar py-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                className={`
                                    text-xs font-black uppercase tracking-[0.2em] transition-all min-w-max border-b-4
                                    ${filter === cat.id
                                        ? 'border-red-600 text-white'
                                        : 'border-transparent text-white/40'}
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-grow relative min-h-0 flex flex-col gap-8">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse text-red-600 font-black tracking-widest">LOADING FEED...</div>
                    ) : filteredGames.length > 0 ? (
                        <>
                            <div className="flex-grow">
                                <SpotlightGame key={filteredGames[spotlightIndex]?.id} game={filteredGames[spotlightIndex]} />
                            </div>

                            {/* Horizontal Stepped Marquee */}
                            <div className="flex-none h-48 relative overflow-hidden bg-black/40 border-y border-white/5">
                                <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                                <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                                <div className="h-full flex items-center px-10">
                                    <div
                                        className="flex gap-0 transition-transform duration-700 ease-in-out"
                                        style={{ transform: `translateX(-${spotlightIndex * 320}px)` }} // 320px = w-80 width
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
                                                        flex-none w-80 h-full p-6 border-r border-white/5 transition-colors relative
                                                        ${isActualSelected ? 'bg-red-950/20' : 'bg-transparent'}
                                                    `}
                                                >
                                                    {isActualSelected && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
                                                    )}
                                                    <div className="flex justify-between items-center h-full">
                                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                                            <img src={away.team.logo} className="w-12 h-12 object-contain" alt="" />
                                                            <span className="text-xs font-black text-white/40 uppercase">{away.team.abbreviation}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center flex-grow gap-2">
                                                            <div className="text-2xl font-mono font-black text-white flex gap-3 tabular-nums">
                                                                <span className={parseInt(away.score) > parseInt(home.score) ? 'text-white' : 'text-white/30'}>{away.score}</span>
                                                                <span className="text-white/10">-</span>
                                                                <span className={parseInt(home.score) > parseInt(away.score) ? 'text-white' : 'text-white/30'}>{home.score}</span>
                                                            </div>
                                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{game.status.type.shortDetail}</span>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2 w-1/3">
                                                            <img src={home.team.logo} className="w-12 h-12 object-contain" alt="" />
                                                            <span className="text-xs font-black text-white/40 uppercase">{home.team.abbreviation}</span>
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
            <div className="w-[550px] flex flex-col h-full bg-[#1a1b1c] border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]">
                <IntelligenceHub game={filteredGames[spotlightIndex]} />
            </div>
        </div>
    );
};

export default Dashboard;
