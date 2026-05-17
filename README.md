# ⛅ WeatherNow — Beautiful Weather App

A stunning weather app with animated backgrounds, built with React, TypeScript, MobX, and Material UI.

🚀 **Live demo:** [weather-app-project-by-merdan.netlify.app](https://weather-app-project-by-merdan.netlify.app/)

## Tech Stack

- **React 18** + **TypeScript**
- **MobX** — reactive weather state, saved cities, unit toggle
- **Material UI v5** — glassmorphism UI, theming
- **Recharts** — temperature area chart
- **React Router v6** — routing
- **Vite** — build tool

## Features

- 🌤️ Dynamic gradient backgrounds that change with weather conditions (13 conditions)
- 🔍 Search across 12 global cities with instant dropdown
- 📊 24h hourly forecast with scrollable pills + area chart
- 📅 7-day forecast with temperature range bars
- 💧 Detailed stats: humidity, wind, UV index, AQI, pressure, dew point, visibility
- 🌆 Save favourite cities with quick-switch cards
- 🌡️ Toggle between °C and °F
- 🌙 Dark / Light theme
- 📱 Fully responsive (glassmorphism design)

## Getting Started

```bash
npm install
npm run dev
```

## MobX Store — weatherStore

- `currentWeather` — full weather object (temp, hourly, daily, details)
- `savedCities` — persisted to localStorage
- `citiesWeather` — weather data for each saved city
- `searchResults` — filtered from 12 preset cities
- `unit` — °C / °F conversion
- `toDisplay(tempC)` — reactive temperature conversion
- `aqiLabel / aqiColor` — computed AQI info

## Cities Available

New York, London, Tokyo, Dubai, Paris, Sydney, Moscow, Singapore, São Paulo, Cairo, Toronto, Berlin

## Project Structure

```
src/
├── stores/          # weatherStore, themeStore
├── components/      # SearchBar, HourlyChart, WeeklyForecast, WeatherDetails, CityCard
├── pages/Home/      # Main dashboard
├── utils/           # weatherData config + mock generator
├── types/           # TypeScript interfaces
└── theme/           # MUI theme (glassmorphism)
```
