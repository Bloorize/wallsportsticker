import React from 'react';

const SpotlightGame = ({ game }) => {
    if (!game) return null;

    const competition = game.competitions[0];
    const home = competition.competitors.find(c => c.homeAway === 'home');
    const away = competition.competitors.find(c => c.homeAway === 'away');

    return (
        <div className="w-full h-full flex flex-col bg-black border border-white/5 shadow-3xl overflow-hidden">
            {/* ESPN Style Banner */}
            <div className="flex-none bg-red-700 px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span className="text-2xl font-black italic tracking-tighter text-white">LIVE SCOREBOARD</span>
                    <div className="h-6 w-px bg-white/20" />
                    <span className="text-sm font-black text-white/80 uppercase tracking-widest">{game.status.type.detail}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">{competition.venue?.fullName}</span>
                </div>
            </div>

            {/* Main Stage Grid - Rigid 5-Column Layout for Stability */}
            <div className="flex-grow grid grid-cols-[300px_1fr_200px_1fr_300px] items-center px-12 gap-4">

                {/* 1. Away Team Identity */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <img
                        src={away.team.logo}
                        className="w-44 h-44 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                        alt={away.team.displayName}
                    />
                    <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
                        <span className="text-3xl font-black text-white uppercase tracking-tighter leading-tight truncate w-full">
                            {away.team.displayName}
                        </span>
                        <span className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">
                            {away.team.abbreviation}
                        </span>
                    </div>
                </div>

                {/* 2. Away Score */}
                <div className="flex items-center justify-center">
                    <span className={`text-[8rem] font-mono font-black tabular-nums tracking-tighter leading-none transition-all duration-1000 ${parseInt(away.score) > parseInt(home.score) ? 'text-white' : 'text-white/20'}`}>
                        {away.score}
                    </span>
                </div>

                {/* 3. VS / Status Separator */}
                <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl font-black text-red-600 italic">VS</div>
                    <div className="h-24 w-0.5 bg-white/10" />
                    <div className="bg-[#1a1b1c] border border-red-600/50 px-4 py-1">
                        <span className="text-sm font-black text-red-500 uppercase tracking-[0.3em] whitespace-nowrap">
                            {game.status.type.shortDetail}
                        </span>
                    </div>
                </div>

                {/* 4. Home Score */}
                <div className="flex items-center justify-center">
                    <span className={`text-[8rem] font-mono font-black tabular-nums tracking-tighter leading-none transition-all duration-1000 ${parseInt(home.score) > parseInt(away.score) ? 'text-white' : 'text-white/20'}`}>
                        {home.score}
                    </span>
                </div>

                {/* 5. Home Team Identity */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <img
                        src={home.team.logo}
                        className="w-44 h-44 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                        alt={home.team.displayName}
                    />
                    <div className="flex flex-col items-center gap-1 w-full overflow-hidden">
                        <span className="text-3xl font-black text-white uppercase tracking-tighter leading-tight truncate w-full">
                            {home.team.displayName}
                        </span>
                        <span className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">
                            {home.team.abbreviation}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom context bar */}
            {competition.situation?.lastPlay && (
                <div className="flex-none bg-[#1a1b1c] p-8 border-t border-white/5">
                    <div className="flex items-center gap-8">
                        <div className="bg-red-600 px-5 py-2 text-[10px] font-black text-white uppercase italic tracking-tighter flex-shrink-0">
                            LATEST PLAY
                        </div>
                        <p className="text-lg font-black text-white/80 leading-snug truncate">
                            {competition.situation.lastPlay.text}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotlightGame;
