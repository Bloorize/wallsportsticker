const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object|null>} Weather data
 */
export const getWeather = async (lat, lon) => {
    if (!WEATHER_API_KEY) {
        console.warn('Weather API key not configured');
        return null;
    }

    if (!lat || !lon) {
        return null;
    }

    try {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            appid: WEATHER_API_KEY,
            units: 'imperial', // Use Fahrenheit
        });

        const response = await fetch(`${WEATHER_API_BASE}/weather?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            windDirection: data.wind.deg,
            visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null,
            icon: data.weather[0].icon,
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format wind direction
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Wind direction (N, NE, E, etc.)
 */
export const formatWindDirection = (degrees) => {
    if (degrees === null || degrees === undefined) return '';
    
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};
