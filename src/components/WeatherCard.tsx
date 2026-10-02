import type { Units, WeatherData } from "../types/weather";
import { formatDateTime, formatTemp } from "../utils/units";

interface Props {
  weather: WeatherData;
  units: Units;
}

export default function WeatherCard({ weather, units }: Props) {
  const { place } = weather;
  const location = [place.region, place.country].filter(Boolean).join(", ");

  return (
    <section className={`weather-card ${weather.isDay ? "day" : "night"}`}>
      <div className="card-top">
        <div>
          <h2>{place.name}</h2>
          <p className="location">{location}</p>
        </div>
        <span className="weather-icon" aria-hidden="true">
          {weather.icon}
        </span>
      </div>

      <div className="temperature">{formatTemp(weather.temperatureC, units)}</div>
      <p className="condition">{weather.condition}</p>
      <p className="feels-like">Feels like {formatTemp(weather.feelsLikeC, units)}</p>

      <p className="updated">
        Last updated {formatDateTime(weather.updatedAt)} (local time in {place.name})
      </p>
    </section>
  );
}
