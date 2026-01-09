import React from 'react';
import { formatMountainDateTime, formatMountainTime } from '../../utils/timeUtils';

const FieldVisualization = ({ game, gameState }) => {
    // Only show field visualization for live games
    if (gameState !== 'in') return null;
    
    const category = game._category;
    const situation = game.competitions?.[0]?.situation;
    if (!situation && category !== 'SOCCER') return null;

    // Football Field (NFL/NCAAF)
    if (category === 'NFL' || category === 'NCAAF') {
        const yardLine = situation.yardLine || 50;
        const down = situation.down || 1;
        const distance = situation.distance || 10;

        return (
            <div className="w-full space-y-2 md:space-y-3 lg:space-y-4">
                <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Field View</span>
                        <span className="text-sm md:text-lg lg:text-xl font-black text-white uppercase tracking-tighter">
                            {situation.possessionText || 'Midfield'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 bg-red-600 px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2">
                        <span className="text-sm md:text-base lg:text-lg font-mono font-black text-white">{down} & {distance}</span>
                    </div>
                </div>
                <div className="h-20 md:h-24 lg:h-28 bg-[#1a3a2a] relative overflow-hidden border border-white/10 shadow-inner">
                    {/* Yard Lines */}
                    <div className="absolute inset-x-2 md:inset-x-3 lg:inset-x-4 inset-y-0 flex justify-between opacity-30">
                        {[...Array(11)].map((_, i) => (
                            <div key={i} className="w-px h-full bg-white relative">
                                <span className="absolute bottom-1 md:bottom-1.5 lg:bottom-2 left-1/2 -translate-x-1/2 text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/60 font-mono">
                                    {(Math.abs(5 - i) * 10) || '50'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Ball Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-1 md:w-1.5 bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.8)] transition-all duration-1000 z-20 flex flex-col items-center justify-center translate-x-2 md:translate-x-3 lg:translate-x-4"
                        style={{ left: `${yardLine}%` }}
                    >
                        <div className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-red-500 rotate-45" />
                    </div>
                    {/* Endzones */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 lg:w-12 bg-black/60 flex items-center justify-center border-r border-white/10">
                        <div className="rotate-90 text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/40 tracking-widest">VISITOR</div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-10 lg:w-12 bg-red-700/40 flex items-center justify-center border-l border-white/10">
                        <div className="-rotate-90 text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/40 tracking-widest uppercase text-white/80">HOME</div>
                    </div>
                </div>
            </div>
        );
    }

    // Basketball Court (NBA/NCAAM)
    if (category === 'NBA' || category === 'NCAAM') {
        return (
            <div className="w-full space-y-2 md:space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] md:text-[9px] lg:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Active Court Tracking</span>
                    <div className="flex items-center gap-1.5 md:gap-2 bg-red-600 px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[8px] md:text-[9px] lg:text-[10px] font-black text-white uppercase">Live Play</span>
                    </div>
                </div>
                <div className="h-28 md:h-32 lg:h-40 bg-[#3d2b1d] relative border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 flex justify-center items-center opacity-20">
                        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border-2 border-white rounded-full" />
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-red-600 rounded-full shadow-[0_0_40px_rgba(255,0,0,0.6)] animate-bounce ring-2 md:ring-3 lg:ring-4 ring-black/40">
                        <div className="text-[7px] md:text-[8px] lg:text-[10px] font-black text-white">BALL</div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const IntelligenceHub = ({ game }) => {
    if (!game) return (
        <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-600 rounded-full animate-spin" />
            <span className="text-sm font-black uppercase tracking-[0.4em]">Optimizing Intel</span>
        </div>
    );

    const competition = game.competitions[0];
    const odds = competition.odds?.[0];
    const situation = competition.situation;
    const gameState = game.status?.type?.state; // 'pre', 'in', 'post'
    
    // Get stats based on game state
    const getStats = () => {
        if (gameState === 'in') {
            // Live game: Use box score stats from competitors
            const stats = [];
            competition.competitors?.forEach(competitor => {
                const teamStats = competitor.statistics || [];
                teamStats.forEach(stat => {
                    // Find or create stat category
                    let category = stats.find(s => s.name === stat.name);
                    if (!category) {
                        category = { name: stat.name, displayName: stat.displayName || stat.name, leaders: [] };
                        stats.push(category);
                    }
                    // Add this competitor's stat value
                    category.leaders.push({
                        athlete: competitor.athlete || { displayName: competitor.team?.displayName },
                        team: competitor.team,
                        displayValue: stat.displayValue || stat.value,
                        value: stat.value
                    });
                });
            });
            // Sort by value and take top performers
            return stats.map(cat => ({
                ...cat,
                leaders: cat.leaders.sort((a, b) => parseFloat(b.value || 0) - parseFloat(a.value || 0)).slice(0, 1)
            })).slice(0, 3);
        } else {
            // Pregame or post-game: Use season leaders
            return competition.leaders?.slice(0, 3) || [];
        }
    };
    
    const displayStats = getStats();

    // Get game status badge
    const getStatusBadge = () => {
        if (gameState === 'in') return { text: 'LIVE', color: 'bg-red-600' };
        if (gameState === 'pre') return { text: 'UPCOMING', color: 'bg-white/20' };
        return { text: 'FINAL', color: 'bg-white/10' };
    };
    
    const statusBadge = getStatusBadge();
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');

    return (
        <div className="flex-grow flex flex-col overflow-y-auto no-scrollbar bg-[#1a1b1c]">
            {/* Compact Header */}
            <div className="flex-none p-4 md:p-6 lg:p-8 bg-black border-b-4 border-red-600">
                <div className="flex items-center justify-between mb-3 md:mb-3.5 lg:mb-4">
                    <div className="flex items-center gap-2 md:gap-3 lg:gap-4 pl-2">
                        <div className={`${statusBadge.color} px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest`}>
                            {statusBadge.text}
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-[0.3em]">Game Intelligence</span>
                    </div>
                    <div className="px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-tighter italic mr-2">
                        ESPN ANALYTICS
                    </div>
                </div>
                <div className="text-[10px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-2 md:gap-3 pl-2 pr-2">
                    <span className="truncate">{formatMountainDateTime(game.date)}</span>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <span className="text-white/40 truncate hidden sm:inline">{competition.venue?.fullName}</span>
                </div>
            </div>

            <div className="flex-grow p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8">
                {/* 1. BETTING ODDS CARDS */}
                <section className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2 md:gap-3 border-l-4 border-red-600 pl-3 md:pl-4 lg:pl-5 mb-2">
                        <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Market Dynamics</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {/* Spread Card */}
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 md:mb-3">Spread</div>
                            <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums tracking-tighter mb-2 md:mb-3">
                                {odds?.details || 'EVEN'}
                            </div>
                            {odds?.details && (
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <div className="bg-red-600 px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black text-white uppercase">
                                        {odds.details.includes(awayTeam.team.abbreviation) ? awayTeam.team.abbreviation : homeTeam.team.abbreviation}
                                    </div>
                                    <span className="text-[8px] md:text-[9px] text-white/40 uppercase">Favorite</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Total Card */}
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 md:mb-3">Total</div>
                            <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums tracking-tighter">
                                {odds?.overUnder || '--'}
                            </div>
                        </div>
                    </div>

                    {/* Win Probability Bar */}
                    {situation?.lastPlay?.probability && (
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="flex justify-between items-center mb-2 md:mb-3">
                                <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{awayTeam.team.abbreviation}</span>
                                <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest">Win Probability</span>
                                <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest">{homeTeam.team.abbreviation}</span>
                            </div>
                            <div className="h-5 md:h-6 bg-white/5 rounded-full overflow-hidden flex relative">
                                <div
                                    className="h-full bg-white transition-all duration-1000 flex items-center justify-start pl-2 md:pl-3"
                                    style={{ width: `${situation.lastPlay.probability.awayWinPercentage * 100}%` }}
                                >
                                    <span className="text-[9px] md:text-[10px] font-black text-black">{Math.round(situation.lastPlay.probability.awayWinPercentage * 100)}%</span>
                                </div>
                                <div
                                    className="h-full bg-red-600 transition-all duration-1000 flex items-center justify-end pr-2 md:pr-3"
                                    style={{ width: `${situation.lastPlay.probability.homeWinPercentage * 100}%` }}
                                >
                                    <span className="text-[9px] md:text-[10px] font-black text-white">{Math.round(situation.lastPlay.probability.homeWinPercentage * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. STATS SECTION */}
                <section className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2 md:gap-3 border-l-4 border-white/40 pl-3 md:pl-4 lg:pl-5 mb-2">
                        <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">
                            {gameState === 'in' ? 'Live Game Stats' : gameState === 'pre' ? 'Season Leaders' : 'Final Stats'}
                        </h3>
                    </div>

                    {displayStats.length > 0 ? (
                        <div className="space-y-3 md:space-y-4">
                            {displayStats.slice(0, 3).map((cat, i) => (
                                <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                                    <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-black/40 overflow-hidden rounded-lg border border-white/10">
                                                {cat.leaders?.[0]?.athlete?.headshot ? (
                                                    <img src={cat.leaders[0].athlete.headshot} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <span className="text-white/20 text-[8px] md:text-[9px] lg:text-[10px] font-black">{cat.leaders?.[0]?.team?.abbreviation || '---'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-red-600 text-white px-1.5 md:px-2 py-0.5 text-[7px] md:text-[8px] font-black uppercase rounded">
                                                {cat.leaders?.[0]?.team?.abbreviation || '---'}
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 md:mb-2">
                                                {cat.displayName}
                                            </div>
                                            <div className="text-sm md:text-base font-black text-white uppercase tracking-tighter truncate">
                                                {cat.leaders?.[0]?.athlete?.displayName || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 md:gap-2 flex-shrink-0">
                                            <div className="text-xl md:text-2xl font-mono font-black text-white tabular-nums">
                                                {cat.leaders?.[0]?.displayValue || '0'}
                                            </div>
                                            <div className="text-[7px] md:text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                                {gameState === 'in' ? 'Game' : 'Season'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/8 rounded-xl p-6 md:p-7 lg:p-8 text-center">
                            <span className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                {gameState === 'pre' ? 'Stats available at game time' : 'No stats available'}
                            </span>
                        </div>
                    )}
                </section>

                {/* 3. FIELD / COURT VISUALIZATION - Only show for live games (Below fold) */}
                {gameState === 'in' && (
                    <section className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3 border-l-4 border-red-600 pl-3 md:pl-4 lg:pl-5 mb-2">
                            <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Live Field View</h3>
                        </div>
                        <FieldVisualization game={game} gameState={gameState} />
                    </section>
                )}

                {/* 4. LIVE FEED - Show for live and post games (Below fold) */}
                {(gameState === 'in' || gameState === 'post') && (
                    <section className="space-y-4 md:space-y-5">
                        <div className="flex items-center gap-2 md:gap-3 border-l-4 border-red-600 pl-3 md:pl-4 lg:pl-5 mb-2">
                            <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">
                                {gameState === 'in' ? 'Live Feed' : 'Last Play'}
                            </h3>
                        </div>

                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                            <p className="text-xs md:text-sm font-black text-white leading-relaxed italic tracking-tight opacity-90 pl-3 md:pl-4">
                                "{situation?.lastPlay?.text || (gameState === 'in' ? "Synchronizing live stadium data feed..." : "Game completed")}"
                            </p>
                        </div>
                    </section>
                )}
            </div>

            {/* Compact Footer */}
            <div className="flex-none p-4 md:p-5 lg:p-6 bg-black border-t border-white/5">
                <div className="flex justify-between items-center opacity-40">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 animate-pulse rounded-full" />
                            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">Signal Active</span>
                        </div>
                    </div>
                    <div className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] italic">ESPN COMPANION v3.0</div>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceHub;
