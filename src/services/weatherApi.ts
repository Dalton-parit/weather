import type {
  ForecastResponse,
  GeocodingResponse,
  Place,
  ReverseGeocodeResponse,
  WeatherData,
} from "../types/weather";

// Open-Meteo is a free, real weather API that needs NO API key.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
// Free reverse geocoding (coordinates -> city name) for "Use My Location".
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

/** An error whose message is safe to show to the user. */
export class ApiError extends Error {}

async function request<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError(
      navigator.onLine
        ? "Could not reach the weather service. Please try again in a moment."
        : "No internet connection. Check your network and try again."
    );
  }
  if (!response.ok) {
    throw new ApiError(
      `The weather service returned an error (${response.status}). Please try again later.`
    );
  }
  return (await response.json()) as T;
}

/** Find cities matching a name. Returns an empty array if none are found. */
export async function searchCities(query: string): Promise<Place[]> {
  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
  });
  const data = await request<GeocodingResponse>(`${GEOCODING_URL}?${params}`);
  return (data.results ?? []).map((r) => ({
    name: r.name,
    country: r.country ?? "Unknown country",
    region: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/** Turn browser coordinates into a Place. Falls back to a generic name if lookup fails. */
export async function getPlaceFromCoordinates(
  latitude: number,
  longitude: number
): Promise<Place> {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: "en",
    });
    const data = await request<ReverseGeocodeResponse>(`${REVERSE_URL}?${params}`);
    return {
      name: data.city || data.locality || "Your location",
      country: data.countryName || "",
      region: data.principalSubdivision,
      latitude,
      longitude,
    };
  } catch {
    return { name: "Your location", country: "", latitude, longitude };
  }
}

/** Get current weather for a place. Values are always metric; the UI converts them. */
export async function getWeather(place: Place): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "surface_pressure",
      "wind_speed_10m",
      "visibility",
      "weather_code",
      "is_day",
    ].join(","),
    daily: "sunrise,sunset",
    timezone: "auto",
    forecast_days: "1",
  });
  const data = await request<ForecastResponse>(`${FORECAST_URL}?${params}`);
  const c = data.current;
  const isDay = c.is_day === 1;
  const { label, icon } = describeWeather(c.weather_code, isDay);

  return {
    place,
    temperatureC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    condition: label,
    icon,
    isDay,
    humidity: c.relative_humidity_2m,
    windKmh: c.wind_speed_10m,
    pressureHpa: c.surface_pressure,
    visibilityM: c.visibility,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    updatedAt: c.time,
  };
}

/* ---------- WMO weather codes -> text + icon ---------- */

interface CodeInfo {
  label: string;
  icon: string;
  nightIcon?: string;
}

const CODES: Record<number, CodeInfo> = {
  0: { label: "Clear sky", icon: "☀️", nightIcon: "🌙" },
  1: { label: "Mainly clear", icon: "🌤️", nightIcon: "🌙" },
  2: { label: "Partly cloudy", icon: "⛅", nightIcon: "☁️" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Freezing fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Light rain showers", icon: "🌦️" },
  81: { label: "Rain showers", icon: "🌧️" },
  82: { label: "Violent rain showers", icon: "⛈️" },
  85: { label: "Light snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm with hail", icon: "⛈️" },
};

function describeWeather(code: number, isDay: boolean): { label: string; icon: string } {
  const info = CODES[code] ?? { label: "Unknown conditions", icon: "🌡️" };
  return {
    label: info.label,
    icon: !isDay && info.nightIcon ? info.nightIcon : info.icon,
  };
}
