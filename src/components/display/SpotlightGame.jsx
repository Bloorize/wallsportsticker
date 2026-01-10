import React from 'react';
import { formatMountainDateTime, formatMountainTime } from '../../utils/timeUtils';

const SpotlightGame = ({ game, isHolyWar = false }) => {
    if (!game) return null;

    const competition = game.competitions[0];
    const home = competition.competitors.find(c => c.homeAway === 'home');
    const away = competition.competitors.find(c => c.homeAway === 'away');

    return (
        <div className={`w-full h-full flex flex-col ${isHolyWar ? 'bg-white border border-[#0047BA]/20' : 'bg-black border border-white/5'} shadow-3xl overflow-hidden`}>
            {/* ESPN Style Banner */}
            <div className={`flex-none ${isHolyWar ? 'bg-[#003a9e]' : 'bg-red-700'} px-4 md:px-8 lg:px-12 py-3 md:py-3.5 lg:py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 pl-2">
                    <span className={`text-base md:text-xl lg:text-2xl font-black italic tracking-tighter ${isHolyWar ? 'text-white' : 'text-white'}`}>LIVE SCOREBOARD</span>
                    <div className={`h-4 md:h-5 lg:h-6 w-px ${isHolyWar ? 'bg-white/30' : 'bg-white/20'}`} />
                    <span className={`text-xs md:text-sm font-black ${isHolyWar ? 'text-white/90' : 'text-white/80'} uppercase tracking-widest`}>{game.status.type.detail}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4 pr-2">
                    <span className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-[0.2em] hidden sm:inline">{competition.venue?.fullName}</span>
                </div>
            </div>

            {/* Main Stage Grid - Responsive Layout */}
            <div className="flex-grow grid grid-cols-[120px_1fr_80px_1fr_120px] md:grid-cols-[200px_1fr_150px_1fr_200px] lg:grid-cols-[300px_1fr_200px_1fr_300px] items-center px-4 md:px-8 lg:px-12 gap-2 md:gap-3 lg:gap-4">

                {/* 1. Away Team Identity */}
                <div className="flex flex-col items-center gap-2 md:gap-4 lg:gap-6 text-center">
                    <img
                        src={away.team.logo}
                        className="w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                        alt={away.team.displayName}
                    />
                    <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
                        <span className="text-sm md:text-xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-tight truncate w-full">
                            {away.team.displayName}
                        </span>
                        <span className="text-[10px] md:text-xs lg:text-sm font-black text-white/40 uppercase tracking-[0.3em]">
                            {away.team.abbreviation}
                        </span>
                    </div>
                </div>

                {/* 2. Away Score */}
                <div className="flex items-center justify-center">
                    <span className={`text-4xl md:text-6xl lg:text-[8rem] font-mono font-black tabular-nums tracking-tighter leading-none transition-all duration-1000 ${parseInt(away.score) > parseInt(home.score) ? 'text-white' : 'text-white/20'}`}>
                        {away.score}
                    </span>
                </div>

                {/* 3. VS / Status Separator */}
                <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
                    <div className="text-sm md:text-xl lg:text-2xl font-black text-red-600 italic">VS</div>
                    <div className="h-12 md:h-18 lg:h-24 w-0.5 bg-white/10" />
                    <div className="bg-[#1a1b1c] border border-red-600/50 px-2 md:px-3 lg:px-4 py-0.5 md:py-1">
                        <span className="text-[9px] md:text-xs lg:text-sm font-black text-red-500 uppercase tracking-[0.3em] whitespace-nowrap">
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
                </div>

                {/* 4. Home Score */}
                <div className="flex items-center justify-center">
                    <span className={`text-4xl md:text-6xl lg:text-[8rem] font-mono font-black tabular-nums tracking-tighter leading-none transition-all duration-1000 ${parseInt(home.score) > parseInt(away.score) ? 'text-white' : 'text-white/20'}`}>
                        {home.score}
                    </span>
                </div>

                {/* 5. Home Team Identity */}
                <div className="flex flex-col items-center gap-2 md:gap-4 lg:gap-6 text-center">
                    <img
                        src={home.team.logo}
                        className="w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                        alt={home.team.displayName}
                    />
                    <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
                        <span className="text-sm md:text-xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-tight truncate w-full">
                            {home.team.displayName}
                        </span>
                        <span className="text-[10px] md:text-xs lg:text-sm font-black text-white/40 uppercase tracking-[0.3em]">
                            {home.team.abbreviation}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom context bar */}
            {competition.situation?.lastPlay && (
                <div className="flex-none bg-[#1a1b1c] p-4 md:p-6 lg:p-8 border-t border-white/5">
                    <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
                        <div className="bg-red-600 px-3 md:px-4 lg:px-5 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black text-white uppercase italic tracking-tighter flex-shrink-0">
                            LATEST PLAY
                        </div>
                        <p className="text-sm md:text-base lg:text-lg font-black text-white/80 leading-snug truncate">
                            {competition.situation.lastPlay.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotlightGame;
