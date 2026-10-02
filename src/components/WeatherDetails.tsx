import type { Units, WeatherData } from "../types/weather";
import { formatTime, formatVisibility, formatWind } from "../utils/units";

interface Props {
  weather: WeatherData;
  units: Units;
}

export default function WeatherDetails({ weather, units }: Props) {
  const items = [
    { icon: "💧", label: "Humidity", value: `${Math.round(weather.humidity)}%` },
    { icon: "💨", label: "Wind speed", value: formatWind(weather.windKmh, units) },
    { icon: "🧭", label: "Pressure", value: `${Math.round(weather.pressureHpa)} hPa` },
    { icon: "👁️", label: "Visibility", value: formatVisibility(weather.visibilityM, units) },
    { icon: "🌅", label: "Sunrise", value: formatTime(weather.sunrise) },
    { icon: "🌇", label: "Sunset", value: formatTime(weather.sunset) },
  ];

  return (
    <section className="details" aria-label="Weather details">
      {items.map((item) => (
        <div className="detail" key={item.label}>
          <span className="detail-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="detail-label">{item.label}</span>
          <span className="detail-value">{item.value}</span>
        </div>
      ))}
    </section>
  );
}
