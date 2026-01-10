# API Setup Guide

This document explains how to set up the various APIs used in the Wall Sports Ticker application.

## Required API Keys

The application uses several third-party APIs. Some are optional and the app will gracefully degrade if they're not configured.

### 1. YouTube Data API v3 (Recommended)

**Purpose**: Fetch game highlights from official league YouTube channels

**Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Add the key to your `.env` file:
   ```
   VITE_YOUTUBE_API_KEY=your_api_key_here
   ```

**Free Tier**: 10,000 units/day (approximately 100 search requests)

**Documentation**: https://developers.google.com/youtube/v3

---

### 2. Odds API (Optional - Phase 2)

**Purpose**: Fetch betting odds from multiple sportsbooks

**Setup**:
1. Go to [The Odds API](https://the-odds-api.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add the key to your `.env` file:
   ```
   VITE_ODDS_API_KEY=your_api_key_here
   ```

**Free Tier**: 500 requests/month

**Documentation**: https://the-odds-api.com/liveapi/guides/v4/

---

### 3. OpenWeatherMap API (Optional - Phase 3)

**Purpose**: Display weather conditions for outdoor games

**Setup**:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add the key to your `.env` file:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

**Free Tier**: 1,000 calls/day

**Documentation**: https://openweathermap.org/api

---

### 4. TheSportsDB API (Optional - Fallback)

**Purpose**: Additional highlight source and team data

**Setup**:
1. The free test key "123" works for basic functionality
2. For highlights, upgrade to premium ($9/month)
3. Add the key to your `.env` file (optional):
   ```
   VITE_SPORTSDB_API_KEY=123
   ```

**Free Tier**: Limited, uses test key "123" by default

**Documentation**: https://www.thesportsdb.com/api.php

---

## Environment Variables

Create a `.env` file in the root directory with your API keys:

```env
# YouTube Data API v3 Key (Recommended)
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Odds API Key (Optional)
VITE_ODDS_API_KEY=your_odds_api_key_here

# OpenWeatherMap API Key (Optional)
VITE_WEATHER_API_KEY=your_weather_api_key_here

# TheSportsDB API Key (Optional, defaults to "123")
VITE_SPORTSDB_API_KEY=123
```

**Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

---

## Features by API

### Without Any API Keys
- Basic game scores and schedules (ESPN API)
- News, transactions, injuries (ESPN API)
- Basic betting odds (ESPN API)
- Live game stats (ESPN API)

### With YouTube API Key
- ✅ Game highlights for completed games
- ✅ Official league highlight videos
- ✅ Embedded YouTube players

### With Odds API Key
- ✅ Multiple sportsbook odds comparison
- ✅ Best odds across sportsbooks
- ✅ Enhanced betting information

### With Weather API Key
- ✅ Weather conditions for outdoor games
- ✅ Wind speed and direction
- ✅ Temperature and humidity

### With TheSportsDB API Key
- ✅ Additional highlight sources (premium)
- ✅ Team logos and artwork
- ✅ Fallback highlight provider

---

## Rate Limits & Best Practices

1. **Caching**: The app implements client-side caching for API responses
   - YouTube highlights: 24-hour cache
   - Weather data: Cached per game
   - Odds data: Fetched on demand

2. **Error Handling**: All APIs have graceful fallbacks
   - If an API fails, the app continues to function
   - Missing API keys result in features being hidden (not errors)

3. **Performance**: 
   - API calls are debounced and deduplicated
   - Loading states are shown during API calls
   - Failed requests don't break the UI

---

## Troubleshooting

### YouTube API Not Working
- Verify your API key is correct
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Verify you haven't exceeded the daily quota

### Odds API Not Working
- Check your API key is valid
- Verify you haven't exceeded monthly request limit
- Ensure the sport is supported by Odds API

### Weather API Not Working
- Verify your API key is correct
- Check that the venue has coordinates mapped in `venueCoordinates.js`
- Ensure you haven't exceeded daily call limit

---

## Support

For API-specific issues, refer to each API's official documentation:
- YouTube: https://developers.google.com/youtube/v3/docs
- Odds API: https://the-odds-api.com/
- OpenWeatherMap: https://openweathermap.org/api
- TheSportsDB: https://www.thesportsdb.com/api.php
