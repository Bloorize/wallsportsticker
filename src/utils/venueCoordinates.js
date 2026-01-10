/**
 * Venue coordinates mapping for major sports venues
 * Used to fetch weather data for outdoor games
 */

export const VENUE_COORDINATES = {
    // NFL Stadiums (sample - can be expanded)
    'MetLife Stadium': { lat: 40.8136, lon: -74.0745 },
    'Lambeau Field': { lat: 44.5013, lon: -88.0622 },
    'Arrowhead Stadium': { lat: 39.0489, lon: -94.4839 },
    'AT&T Stadium': { lat: 32.7473, lon: -97.0945 },
    'SoFi Stadium': { lat: 33.9533, lon: -118.3387 },
    
    // MLB Stadiums (sample)
    'Yankee Stadium': { lat: 40.8296, lon: -73.9262 },
    'Fenway Park': { lat: 42.3467, lon: -71.0972 },
    'Wrigley Field': { lat: 41.9484, lon: -87.6553 },
    'Dodger Stadium': { lat: 34.0739, lon: -118.2400 },
    
    // NCAA Football (sample)
    'Michigan Stadium': { lat: 42.2658, lon: -83.7481 },
    'Ohio Stadium': { lat: 40.0016, lon: -83.0197 },
    'Rose Bowl': { lat: 34.1614, lon: -118.1676 },
    
    // Soccer (sample)
    'Mercedes-Benz Stadium': { lat: 33.7555, lon: -84.4013 },
    'BMO Stadium': { lat: 34.1419, lon: -118.2433 },
};

/**
 * Get coordinates for a venue name
 * @param {string} venueName - Venue name
 * @returns {Object|null} Coordinates object with lat/lon or null
 */
export const getVenueCoordinates = (venueName) => {
    if (!venueName) return null;
    
    // Try exact match first
    if (VENUE_COORDINATES[venueName]) {
        return VENUE_COORDINATES[venueName];
    }
    
    // Try partial match
    const normalizedName = venueName.toLowerCase();
    for (const [key, coords] of Object.entries(VENUE_COORDINATES)) {
        if (normalizedName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedName)) {
            return coords;
        }
    }
    
    return null;
};

/**
 * Check if sport is outdoor (needs weather data)
 * @param {string} category - Sport category
 * @returns {boolean} True if outdoor sport
 */
export const isOutdoorSport = (category) => {
    const outdoorSports = ['NFL', 'MLB', 'NCAAF', 'SOCCER'];
    return outdoorSports.includes(category);
};
