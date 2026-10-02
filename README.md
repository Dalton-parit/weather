# Weather Check

A React + TypeScript + Vite app that shows current weather for any city in the world.

## 1. Requirements
- Node.js 18 or newer (check with `node -v`)

## 2. Install and run
```bash
cd weather-check
npm install
npm run dev
```
Open the address shown in the terminal (usually http://localhost:5173).

## 3. API key
**None needed.** The app uses [Open-Meteo](https://open-meteo.com/) (weather + city search),
which is free and keyless for non-commercial use, plus BigDataCloud's free client
reverse-geocoding endpoint to name your city when you use "Use My Location".

## 4. Build for production
```bash
npm run build
npm run preview
```

## Creating the project from scratch (optional)
```bash
npm create vite@latest weather-check -- --template react-ts
cd weather-check
npm install
```
Then replace `index.html`, `package.json` dependencies if needed, and the whole `src/` folder with the files in this project.

## Structure
- `src/services/weatherApi.ts` – all API requests + weather code → text/icon
- `src/types/weather.ts` – TypeScript types for API responses and app data
- `src/components/` – SearchBar, WeatherCard, WeatherDetails, UnitToggle, Loading
- `src/utils/units.ts` – °C/°F, km/h↔mph, km↔mi, and time formatting
- `src/App.tsx` – state and page layout
