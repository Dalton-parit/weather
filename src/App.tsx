import { useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import UnitToggle from "./components/UnitToggle";
import Loading from "./components/Loading";
import {
  ApiError,
  getPlaceFromCoordinates,
  getWeather,
  searchCities,
} from "./services/weatherApi";
import type { Place, Units, WeatherData } from "./types/weather";

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
}

export default function App() {
  const [units, setUnits] = useState<Units>("metric");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [matches, setMatches] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Used to ignore results from an older request if the user starts a new one.
  const latestRequest = useRef(0);

  function startRequest(): number {
    latestRequest.current += 1;
    setLoading(true);
    setError(null);
    setMatches([]);
    return latestRequest.current;
  }

  async function loadWeather(place: Place, requestId: number) {
    try {
      const data = await getWeather(place);
      if (requestId === latestRequest.current) setWeather(data);
    } catch (err) {
      if (requestId === latestRequest.current) setError(errorMessage(err));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }

  async function handleSearch(query: string) {
    const requestId = startRequest();
    try {
      const places = await searchCities(query);
      if (requestId !== latestRequest.current) return;

      if (places.length === 0) {
        setWeather(null);
        setError(`We couldn't find a city called "${query}". Check the spelling and try again.`);
        setLoading(false);
      } else if (places.length === 1) {
        await loadWeather(places[0], requestId);
      } else {
        setMatches(places); // let the user choose the right one
        setLoading(false);
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError(errorMessage(err));
        setLoading(false);
      }
    }
  }

  function handleSelect(place: Place) {
    const requestId = startRequest();
    void loadWeather(place, requestId);
  }

  function handleUseLocation() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location. Please search for a city instead.");
      return;
    }
    const requestId = startRequest();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const place = await getPlaceFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
        await loadWeather(place, requestId);
      },
      (geoError) => {
        if (requestId !== latestRequest.current) return;
        setLoading(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission was denied. You can still search for any city above."
            : "We couldn't detect your location. Please search for a city instead."
        );
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Weather Check</h1>
        <UnitToggle units={units} onChange={setUnits} />
      </header>

      <SearchBar
        disabled={loading}
        suggestions={matches}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onUseLocation={handleUseLocation}
      />

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {loading && <Loading />}

      {!loading && weather && (
        <main className="results">
          <WeatherCard weather={weather} units={units} />
          <WeatherDetails weather={weather} units={units} />
        </main>
      )}

      {!loading && !weather && !error && matches.length === 0 && (
        <p className="empty">Search for any city in the world, or use your location.</p>
      )}

      <footer className="footer">
        Weather data by <a href="https://open-meteo.com/">Open-Meteo</a>
      </footer>
    </div>
  );
}
