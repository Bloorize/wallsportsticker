import React, { useState, useEffect } from 'react';
import { formatMountainDateTime, formatMountainTime } from '../../utils/timeUtils';
import { searchGameHighlights, searchHighlights } from '../../services/youtube';
import { getChannelId } from '../../config/youtubeChannels';
import OddsComparison from './OddsComparison';
import { getWeather, getWeatherIconUrl, formatWindDirection } from '../../services/weather';
import { getVenueCoordinates, isOutdoorSport } from '../../utils/venueCoordinates';
import { getRivalryData } from '../../config/rivalryData';

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

import { getNewsWithPhotos, getGameSummary } from '../../services/espn';
import { getTeamPhotos } from '../../services/thesportsdb';

const IntelligenceMedia = ({ game, gameState, cycleIndex = 0 }) => {
    const [media, setMedia] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!game || !game.competitions?.[0]) {
                setLoading(false);
                return;
            }

            const competition = game.competitions[0];
            const competitors = competition.competitors || [];
            const category = game._category;
            
            const getPath = (cat) => {
                switch (cat) {
                    case 'NBA': return { s: 'basketball', l: 'nba' };
                    case 'NFL': return { s: 'football', l: 'nfl' };
                    case 'NCAAM': return { s: 'basketball', l: 'mens-college-basketball' };
                    case 'NCAAF': return { s: 'football', l: 'college-football' };
                    case 'MLB': return { s: 'baseball', l: 'mlb' };
                    case 'NHL': return { s: 'hockey', l: 'nhl' };
                    case 'SOCCER': return { s: 'soccer', l: 'eng.1' };
                    default: return { s: 'basketball', l: 'nba' };
                }
            };
            const path = getPath(category);

            setLoading(true);
            try {
                const team1 = competitors[0].team?.displayName || '';
                const team2 = competitors[1].team?.displayName || '';
                const team1Abbr = competitors[0].team?.abbreviation || '';
                const team2Abbr = competitors[1].team?.abbreviation || '';
                
                // Check for special rivalry matchup
                const rivalryData = getRivalryData(team1Abbr, team2Abbr);
                const isBYUUtahRivalry = rivalryData !== null;

                // 1. Fetch Highlights (Smart Check)
                let youtubeResults = [];
                if (isBYUUtahRivalry) {
                    // Special rivalry search - look for "BYU Utah rivalry" or "Holy War"
                    const rivalryQueries = [
                        `${team1} vs ${team2} rivalry highlights`,
                        `${team1} ${team2} Holy War`,
                        `BYU Utah basketball rivalry`
                    ];
                    for (const query of rivalryQueries) {
                        const results = await searchHighlights(query, null);
                        if (results && results.length > 0) {
                            youtubeResults = results;
                            break;
                        }
                    }
                } else {
                    const gameDate = gameState === 'post' ? (game.date ? new Date(game.date).toISOString().split('T')[0] : '') : '';
                    const channelId = getChannelId(category);
                    youtubeResults = await searchGameHighlights(team1, team2, gameDate, channelId);
                }
                
                // Only keep highlights that are explicitly embeddable
                const playable = youtubeResults?.filter(vid => vid.embeddable) || [];
                setHighlights(playable.slice(0, 1)); // Only show the top 1 highlight

                // 2. Fetch Media Gallery (Photos)
                const mediaItems = [];

                // Special rivalry content
                if (isBYUUtahRivalry && rivalryData) {
                    // Use rivalry-specific YouTube queries
                    for (const searchQuery of rivalryData.youtubeQueries) {
                        const results = await searchHighlights(searchQuery, null);
                        if (results && results.length > 0) {
                            results.forEach(vid => {
                                if (vid.thumbnail) {
                                    mediaItems.push({
                                        url: vid.thumbnail,
                                        title: vid.title,
                                        type: 'RIVALRY',
                                        videoId: vid.videoId
                                    });
                                }
                            });
                        }
                    }
                }

                // Venue Photos
                const summary = await getGameSummary(path.s, path.l, game.id);
                if (summary?.gameInfo?.venue?.images) {
                    summary.gameInfo.venue.images.forEach(img => {
                        mediaItems.push({ url: img.href, title: `VENUE: ${summary.gameInfo.venue.fullName}`, type: 'STADIUM' });
                    });
                }

                // Team Photos
                for (const competitor of competitors) {
                    const teamName = competitor.team?.displayName;
                    if (teamName) {
                        const teamPhotos = await getTeamPhotos(teamName, category);
                        teamPhotos.forEach(url => {
                            mediaItems.push({ url, title: `${teamName.toUpperCase()} ACTION`, type: 'MATCHUP' });
                        });
                    }
                }

                // News Photos
                const news = await getNewsWithPhotos(path.s, path.l);
                const teamIds = competitors.map(c => c.team.id);
                const relevantNews = news.filter(n => teamIds.includes(n.teamId));
                (relevantNews.length > 0 ? relevantNews : news).forEach(article => {
                    if (article.image) {
                        mediaItems.push({ url: article.image, title: article.headline, type: 'NEWS' });
                    }
                });

                const uniqueMedia = Array.from(new Map(mediaItems.map(item => [item.url, item])).values());
                setMedia(uniqueMedia);
            } catch (err) {
                console.error('Error fetching intelligence media:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [game, gameState]);

    if (loading) return (
        <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
        </div>
    );

    // Cycle photos 2 at a time based on cycleIndex
    const displayedMedia = media.length > 2
        ? [...media, ...media].slice((cycleIndex % Math.ceil(media.length / 2)) * 2, ((cycleIndex % Math.ceil(media.length / 2)) * 2) + 2)
        : media;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Highlights Section - Only if playable videos exist */}
            {highlights.length > 0 ? (
                <section className="space-y-4">
                    <div className={`flex items-center gap-2 md:gap-3 border-l-4 ${borderColor} pl-3 md:pl-4 mb-2`}>
                        <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Game Footage</h3>
                    </div>
                    <div className="space-y-3">
                        {highlights.map((vid, i) => (
                            <div key={i} className="bg-white/5 border border-white/8 rounded-xl overflow-hidden shadow-2xl">
                                <div className="relative aspect-video">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${vid.videoId}?modestbranding=1&rel=0&autoplay=1&mute=1`}
                                        title={vid.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-3 bg-black/40">
                                    <p className="text-[10px] md:text-xs font-black text-white/90 uppercase tracking-tight line-clamp-1">
                                        {vid.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                /* Visual Intel Section (Photos) - ONLY if no video */
                displayedMedia.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-2 md:gap-3 border-l-4 ${borderColor} pl-3 md:pl-4 mb-2`}>
                                <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Visual Intel</h3>
                            </div>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mr-2">
                                {media.length > 2 && `Slide ${(cycleIndex % Math.ceil(media.length / 2)) + 1} / ${Math.ceil(media.length / 2)}`}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {displayedMedia.map((item, index) => {
                                const content = (
                                    <div className="relative aspect-video bg-white/5 border border-white/8 rounded-xl overflow-hidden group">
                                        <img 
                                            src={item.url} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 md:p-3">
                                            <span className={`text-[7px] md:text-[8px] font-black ${accentColor} uppercase tracking-[0.2em] mb-1`}>{item.type}</span>
                                            <p className="text-[9px] md:text-[10px] font-black text-white line-clamp-2 uppercase leading-tight tracking-tighter">
                                                {item.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                                
                                // If it's a rivalry video thumbnail, make it clickable
                                if (item.videoId) {
                                    return (
                                        <a
                                            key={index}
                                            href={`https://www.youtube.com/watch?v=${item.videoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            {content}
                                        </a>
                                    );
                                }
                                
                                return <div key={index}>{content}</div>;
                            })}
                        </div>
                    </section>
                )
            )}
        </div>
    );
};

const WeatherSection = ({ game }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!game || !game.competitions?.[0]) {
                setLoading(false);
                return;
            }

            const venueName = game.competitions[0].venue?.fullName;
            if (!venueName) {
                setLoading(false);
                return;
            }

            const coords = getVenueCoordinates(venueName);
            if (!coords) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const weatherData = await getWeather(coords.lat, coords.lon);
                setWeather(weatherData);
            } catch (err) {
                console.error('Error fetching weather:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [game]);

    if (loading) {
        return (
            <section className="space-y-4 md:space-y-5">
                <div className="flex items-center gap-2 md:gap-3 border-l-4 border-red-600 pl-3 md:pl-4 lg:pl-5 mb-2">
                    <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Game Conditions</h3>
                </div>
                <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                    <div className="flex items-center justify-center py-4">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (!weather) {
        return null; // Don't show section if no weather data
    }

    return (
        <section className="space-y-4 md:space-y-5">
            <div className="flex items-center gap-2 md:gap-3 border-l-4 border-red-600 pl-3 md:pl-4 lg:pl-5 mb-2">
                <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Game Conditions</h3>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        {weather.icon && (
                            <img 
                                src={getWeatherIconUrl(weather.icon)} 
                                alt={weather.condition}
                                className="w-12 h-12 md:w-16 md:h-16"
                            />
                        )}
                        <div>
                            <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums">
                                {weather.temperature}°F
                            </div>
                            <div className="text-[9px] md:text-[10px] font-black text-white/60 uppercase tracking-widest">
                                {weather.description}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                            Feels Like
                        </div>
                        <div className="text-lg md:text-xl font-mono font-black text-white/80 tabular-nums">
                            {weather.feelsLike}°F
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4 border-t border-white/5">
                    <div>
                        <div className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                            Wind
                        </div>
                        <div className="text-sm md:text-base font-black text-white">
                            {weather.windSpeed} mph {formatWindDirection(weather.windDirection)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                            Humidity
                        </div>
                        <div className="text-sm md:text-base font-black text-white">
                            {weather.humidity}%
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatAvatar = ({ leader }) => {
    const [isError, setIsError] = useState(false);
    const athlete = leader?.athlete;
    const team = leader?.team;

    // Use team logo if it's a team-level stat (no athlete)
    const displayImage = athlete?.headshot || team?.logo;

    return (
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-black/40 overflow-hidden rounded-lg border border-white/10 relative flex-shrink-0">
            {displayImage && !isError ? (
                <img 
                    src={displayImage} 
                    className="w-full h-full object-cover" 
                    alt=""
                    onError={() => setIsError(true)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <span className="text-white/20 text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase">
                        {team?.abbreviation || '---'}
                    </span>
                </div>
            )}
        </div>
    );
};

const IntelligenceHub = ({ game, isHolyWar = false }) => {
    const [subMode, setSubMode] = useState(0); // 0: Stats, 1: Media, 2: Feed/Field
    const [statPage, setStatPage] = useState(0);
    const [fullSummary, setFullSummary] = useState(null);

    // Sub-mode and Stat rotation every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setStatPage(prev => prev + 1);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Fetch full summary for more stats - refetch when game goes live
    useEffect(() => {
        const fetchSummary = async () => {
            if (!game) return;
            const category = game._category;
            const getPath = (cat) => {
                switch (cat) {
                    case 'NBA': return { s: 'basketball', l: 'nba' };
                    case 'NFL': return { s: 'football', l: 'nfl' };
                    case 'NCAAM': return { s: 'basketball', l: 'mens-college-basketball' };
                    case 'NCAAF': return { s: 'football', l: 'college-football' };
                    case 'MLB': return { s: 'baseball', l: 'mlb' };
                    case 'NHL': return { s: 'hockey', l: 'nhl' };
                    case 'SOCCER': return { s: 'soccer', l: 'eng.1' };
                    default: return { s: 'basketball', l: 'nba' };
                }
            };
            const path = getPath(category);
            const summary = await getGameSummary(path.s, path.l, game.id);
            setFullSummary(summary);
        };
        fetchSummary();
        
        // If game is live, refetch every 2 minutes for updated stats (reduced from 30s to prevent flicker)
        if (game?.status?.type?.state === 'in') {
            const interval = setInterval(fetchSummary, 120000);
            return () => clearInterval(interval);
        }
    }, [game]);

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
    
    // Check for rivalry matchup
    const competitors = competition.competitors || [];
    const team1Abbr = competitors[0]?.team?.abbreviation || '';
    const team2Abbr = competitors[1]?.team?.abbreviation || '';
    const rivalryData = getRivalryData(team1Abbr, team2Abbr);
    
    // Get stats based on game state
    const getStats = () => {
        const stats = [];
        const category = game._category;
        
        // Accurate ESPN headshot path mapping
        const getSportPath = (cat) => {
            switch (cat) {
                case 'NBA': return 'nba';
                case 'NFL': return 'nfl';
                case 'NCAAM': return 'mens-college-basketball';
                case 'NCAAF': return 'college-football';
                case 'MLB': return 'mlb';
                case 'NHL': return 'nhl';
                case 'SOCCER': return 'soccer';
                default: return 'nba';
            }
        };
        const sportPath = getSportPath(category);
        
        // 1. Add Leaders from game object (Season leaders - usually have images)
        if (competition.leaders && competition.leaders.length > 0) {
            competition.leaders.forEach(leaderCat => {
                const processedCat = {
                    ...leaderCat,
                    leaders: leaderCat.leaders?.map(l => ({
                        ...l,
                        athlete: {
                            ...l.athlete,
                            headshot: l.athlete?.headshot || `https://a.espncdn.com/i/headshots/${sportPath}/players/full/${l.athlete?.id}.png`
                        }
                    }))
                };
                stats.push(processedCat);
            });
        } else if (gameState === 'pre' && stats.length === 0) {
            // Special rivalry historic stats
            if (rivalryData && rivalryData.historicStats) {
                rivalryData.historicStats.forEach((stat, idx) => {
                    stats.push({
                        name: `rivalry_${idx}`,
                        displayName: stat.label,
                        isRivalryStat: true,
                        leaders: [{
                            athlete: {
                                displayName: stat.value,
                                headshot: null
                            },
                            team: { abbreviation: 'HISTORY' },
                            displayValue: stat.value,
                            value: stat.value,
                            description: stat.description
                        }]
                    });
                });
            } else {
                // Fallback: Show team records/rankings for upcoming games without leaders
                // Only show once per team, avoid duplicates
                const seenTeams = new Set();
                competition.competitors?.forEach(competitor => {
                    const team = competitor.team;
                    if (!team || seenTeams.has(team.id)) return; // Skip duplicates and null teams
                    seenTeams.add(team.id);
                    
                    const record = competitor.records?.[0]?.summary || 'N/A';
                    const rank = team.rank || null;
                    
                    stats.push({
                        name: `teamRecord_${team.id}`,
                        displayName: rank ? `#${rank} ${team.displayName}` : team.displayName,
                        isTeamRecord: true,
                        leaders: [{
                            athlete: {
                                displayName: team.displayName,
                                headshot: null
                            },
                            team: team,
                            displayValue: record,
                            value: record
                        }]
                    });
                });
            }
        }

        // 2. Add Box Score Stats if available (from fullSummary)
        if (fullSummary?.boxscore?.players) {
            fullSummary.boxscore.players.forEach(teamData => {
                const team = teamData.team;
                // Only process the first few relevant categories to avoid bloat
                teamData.statistics?.forEach(statCat => {
                    statCat.athletes?.forEach(athleteStat => {
                        // Only add if they actually have a stat value
                        if (athleteStat.stats?.[0] && athleteStat.stats[0] !== '0') {
                            stats.push({
                                name: statCat.name,
                                displayName: statCat.labels?.[0] || statCat.name,
                                leaders: [{
                                    athlete: {
                                        ...athleteStat.athlete,
                                        headshot: athleteStat.athlete?.headshot || `https://a.espncdn.com/i/headshots/${sportPath}/players/full/${athleteStat.athlete?.id}.png`
                                    },
                                    team: team,
                                    displayValue: athleteStat.stats[0],
                                    value: athleteStat.stats[0]
                                }]
                            });
                        }
                    });
                });
            });
        }
        
        // 3. Add Situation leaders (In-game performers & team stats)
        if (gameState === 'in') {
            competition.competitors?.forEach(competitor => {
                const teamStats = competitor.statistics || [];
                teamStats.forEach(stat => {
                    // Only add if it's a "team" level stat (no athlete associated)
                    // and clean up the label (e.g. fieldGoalsMade -> FG Made)
                    const cleanLabel = stat.displayName || stat.name
                        .replace(/([A-Z])/g, ' $1') // Add space before capitals
                        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                        .replace('Pct', '%')
                        .trim();

                    stats.push({
                        name: stat.name,
                        displayName: `TEAM ${cleanLabel}`,
                        isTeamStat: true,
                        leaders: [{
                            athlete: {
                                ...competitor.athlete,
                                displayName: competitor.athlete?.displayName || competitor.team?.displayName,
                                headshot: competitor.athlete?.headshot || (competitor.athlete?.id ? `https://a.espncdn.com/i/headshots/${sportPath}/players/full/${competitor.athlete?.id}.png` : null)
                            },
                            team: competitor.team,
                            displayValue: stat.displayValue || stat.value,
                            value: stat.value
                        }]
                    });
                });
            });
        }

        return stats;
    };
    
    const allStats = getStats();
    // Cycle through stats 3 at a time - much larger pool now
    const displayStats = allStats.length > 0
        ? [...allStats, ...allStats].slice((statPage % Math.max(1, Math.ceil(allStats.length / 3))) * 3, ((statPage % Math.max(1, Math.ceil(allStats.length / 3))) * 3) + 3)
        : [];
    
    // Get game status badge
    const getStatusBadge = () => {
        if (gameState === 'in') return { text: 'LIVE', color: isHolyWar ? 'bg-[#0047BA]' : 'bg-red-600' };
        if (gameState === 'pre') return { text: 'UPCOMING', color: 'bg-white/20' };
        return { text: 'FINAL', color: 'bg-white/10' };
    };
    
    const statusBadge = getStatusBadge();
    const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
    const homeTeam = competition.competitors.find(c => c.homeAway === 'home');

    // BYU colors for Holy War page
    const borderColor = isHolyWar ? 'border-[#0047BA]' : 'border-red-600';
    const accentColor = isHolyWar ? 'text-[#0047BA]' : 'text-red-500';
    const accentBg = isHolyWar ? 'bg-[#0047BA]' : 'bg-red-600';
    const accentBg700 = isHolyWar ? 'bg-[#003a9e]' : 'bg-red-700';
    const bgColor = isHolyWar ? 'bg-[#001a3d]' : 'bg-black';
    const headerBg = isHolyWar ? 'bg-[#001a3d]' : 'bg-black';

    return (
        <div className={`flex-grow flex flex-col overflow-y-auto no-scrollbar ${isHolyWar ? 'bg-white' : 'bg-[#1a1b1c]'}`}>
            {/* Compact Header */}
            <div className={`flex-none p-4 md:p-6 lg:p-8 ${isHolyWar ? 'bg-white border-b-4 border-[#0047BA]' : `${headerBg} border-b-4 ${borderColor}`}`}>
                <div className="flex items-center justify-between mb-3 md:mb-3.5 lg:mb-4">
                    <div className="flex items-center gap-2 md:gap-3 lg:gap-4 pl-2">
                        <div className={`${statusBadge.color} px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest`}>
                            {statusBadge.text}
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-[0.3em]">Game Intelligence</span>
                    </div>
                    <div className={`px-3 md:px-3.5 lg:px-4 py-1 md:py-1.5 ${isHolyWar ? 'bg-[#002E5D] text-white' : 'bg-white text-black'} text-[9px] md:text-[10px] font-black uppercase tracking-tighter italic mr-2`}>
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
                    <div className={`flex items-center gap-2 md:gap-3 border-l-4 ${borderColor} pl-3 md:pl-4 lg:pl-5 mb-2`}>
                        <h3 className={`text-xs md:text-sm font-black ${isHolyWar ? 'text-[#002E5D]/70' : 'text-white/60'} uppercase tracking-[0.3em]`}>Market Dynamics</h3>
                    </div>

                    {/* Try Odds API first, fallback to ESPN odds */}
                    <OddsComparison game={game} />
                    
                    {/* Fallback to ESPN odds if Odds API not available */}
                    {!import.meta.env.VITE_ODDS_API_KEY && (
                        <>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {/* Spread Card */}
                                <div className={`${isHolyWar ? 'bg-white border border-[#0047BA]' : 'bg-white/5 border border-white/8'} rounded-xl p-4 md:p-5 lg:p-6`}>
                                    <div className={`text-[8px] md:text-[9px] font-black ${accentColor} uppercase tracking-widest mb-2 md:mb-3`}>Spread</div>
                                    <div className={`text-2xl md:text-3xl font-mono font-black ${isHolyWar ? 'text-[#002E5D]' : 'text-white'} tabular-nums tracking-tighter mb-2 md:mb-3`}>
                                {odds?.details || 'EVEN'}
                            </div>
                                    {odds?.details && (
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <div className={`${accentBg} px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black text-white uppercase`}>
                                                {odds.details.includes(awayTeam.team.abbreviation) ? awayTeam.team.abbreviation : homeTeam.team.abbreviation}
                                            </div>
                                            <span className="text-[8px] md:text-[9px] text-white/40 uppercase">Favorite</span>
                                        </div>
                                    )}
                        </div>
                                
                                {/* Total Card */}
                                <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                                    <div className={`text-[8px] md:text-[9px] font-black ${accentColor} uppercase tracking-widest mb-2 md:mb-3`}>Total</div>
                                    <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums tracking-tighter">
                                {odds?.overUnder || '--'}
                            </div>
                        </div>
                    </div>
                        </>
                    )}

                    {/* Win Probability Bar */}
                    {situation?.lastPlay?.probability && (
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="flex justify-between items-center mb-2 md:mb-3">
                                <span className={`text-[8px] md:text-[9px] font-black ${isHolyWar ? 'text-[#002E5D]/60' : 'text-white/40'} uppercase tracking-widest`}>{awayTeam.team.abbreviation}</span>
                                <span className={`text-[8px] md:text-[9px] font-black ${accentColor} uppercase tracking-widest`}>Win Probability</span>
                                <span className={`text-[8px] md:text-[9px] font-black ${isHolyWar ? 'text-[#002E5D]/60' : 'text-white/40'} uppercase tracking-widest`}>{homeTeam.team.abbreviation}</span>
                            </div>
                            <div className="h-5 md:h-6 bg-white/5 rounded-full overflow-hidden flex relative">
                                <div
                                    className="h-full bg-white transition-all duration-1000 flex items-center justify-start pl-2 md:pl-3"
                                    style={{ width: `${situation.lastPlay.probability.awayWinPercentage * 100}%` }}
                                >
                                    <span className="text-[9px] md:text-[10px] font-black text-black">{Math.round(situation.lastPlay.probability.awayWinPercentage * 100)}%</span>
                                </div>
                                <div
                                    className={`h-full ${accentBg} transition-all duration-1000 flex items-center justify-end pr-2 md:pr-3`}
                                    style={{ width: `${situation.lastPlay.probability.homeWinPercentage * 100}%` }}
                                >
                                    <span className="text-[9px] md:text-[10px] font-black text-white">{Math.round(situation.lastPlay.probability.homeWinPercentage * 100)}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. WEATHER - Show for outdoor sports in pre-game */}
                {gameState === 'pre' && isOutdoorSport(game._category) && (
                    <WeatherSection game={game} />
                )}

                {/* 3. STATS SECTION */}
                <section className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2 md:gap-3 border-l-4 border-white/40 pl-3 md:pl-4 lg:pl-5 mb-2">
                        <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">
                            {rivalryData && rivalryData.specialContent?.header ? (
                                <span className="text-red-600">{rivalryData.specialContent.header}</span>
                            ) : (
                                gameState === 'in' ? 'Live Game Stats' : gameState === 'pre' ? (displayStats.some(s => s.isTeamRecord) ? 'Team Records' : (displayStats.some(s => s.isRivalryStat) ? 'Rivalry History' : 'Season Leaders')) : 'Final Stats'
                            )}
                        </h3>
                        {rivalryData && rivalryData.specialContent?.subtitle && (
                            <span className={`text-[8px] md:text-[9px] font-black ${isHolyWar ? 'text-[#002E5D]/50' : 'text-white/40'} uppercase tracking-widest ml-2`}>
                                {rivalryData.specialContent.subtitle}
                            </span>
                        )}
                    </div>

                    {displayStats.length > 0 ? (
                        <div className="space-y-3 md:space-y-4">
                            {displayStats.slice(0, 3).map((cat, i) => (
                                <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                                    <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
                                        <div className="relative flex-shrink-0">
                                            <StatAvatar leader={cat.leaders?.[0]} />
                                            <div className={`absolute -top-1 -right-1 ${accentBg} text-white px-1.5 md:px-2 py-0.5 text-[7px] md:text-[8px] font-black uppercase rounded`}>
                                            {cat.leaders?.[0]?.team?.abbreviation || '---'}
                                        </div>
                                    </div>
                                        <div className="flex-grow min-w-0">
                                            <div className={`text-[8px] md:text-[9px] font-black ${accentColor} uppercase tracking-widest mb-1 md:mb-2`}>
                                            {cat.displayName}
                                        </div>
                                            <div className={`text-sm md:text-base font-black ${isHolyWar ? 'text-[#002E5D]' : 'text-white'} uppercase tracking-tighter truncate`}>
                                                {cat.isTeamStat ? (cat.leaders?.[0]?.team?.displayName || 'TEAM') : (cat.leaders?.[0]?.athlete?.displayName || 'N/A')}
                                            </div>
                                            {cat.leaders?.[0]?.description && (
                                                <div className={`text-[9px] md:text-[10px] font-bold ${isHolyWar ? 'text-[#002E5D]/60' : 'text-white/40'} uppercase tracking-tight mt-1 line-clamp-1`}>
                                                    {cat.leaders[0].description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1 md:gap-2 flex-shrink-0">
                                            <div className={`text-xl md:text-2xl font-mono font-black ${isHolyWar ? 'text-[#002E5D]' : 'text-white'} tabular-nums`}>
                                                {cat.leaders?.[0]?.displayValue || '0'}
                                            </div>
                                            <div className={`text-[7px] md:text-[8px] font-bold ${isHolyWar ? 'text-[#002E5D]/40' : 'text-white/20'} uppercase tracking-widest`}>
                                                {cat.isRivalryStat ? 'HISTORY' : (gameState === 'in' ? 'Game' : 'Season')}
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

                {/* 4. FIELD / COURT VISUALIZATION - Only show for live games (Below fold) */}
                {gameState === 'in' && (
                    <section className="space-y-3 md:space-y-4">
                        <div className={`flex items-center gap-2 md:gap-3 border-l-4 ${borderColor} pl-3 md:pl-4 lg:pl-5 mb-2`}>
                            <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">Live Field View</h3>
                        </div>
                        <FieldVisualization game={game} gameState={gameState} />
                    </section>
                )}

                {/* 5. LIVE FEED - Show for live and post games (Below fold) */}
                {(gameState === 'in' || gameState === 'post') && (
                    <section className="space-y-4 md:space-y-5">
                        <div className={`flex items-center gap-2 md:gap-3 border-l-4 ${borderColor} pl-3 md:pl-4 lg:pl-5 mb-2`}>
                            <h3 className="text-xs md:text-sm font-black text-white/60 uppercase tracking-[0.3em]">
                                {gameState === 'in' ? 'Live Feed' : 'Last Play'}
                            </h3>
                    </div>

                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${accentBg}`} />
                            <p className="text-xs md:text-sm font-black text-white leading-relaxed italic tracking-tight opacity-90 pl-3 md:pl-4">
                                "{situation?.lastPlay?.text || (gameState === 'in' ? "Synchronizing live stadium data feed..." : "Game completed")}"
                        </p>
                    </div>
                </section>
                )}

                {/* 6. INTELLIGENCE MEDIA - Videos (if playable) + Photos */}
                {(gameState === 'post' || gameState === 'pre') && (
                    <IntelligenceMedia game={game} gameState={gameState} cycleIndex={statPage} />
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
