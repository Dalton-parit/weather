/** "metric" = °C, km/h, km.  "imperial" = °F, mph, miles. */
export type Units = "metric" | "imperial";

/** A city the user can pick. */
export interface Place {
  name: string;
  country: string;
  region?: string; // state / province, helps tell same-named cities apart
  latitude: number;
  longitude: number;
}

/* ---------- Raw API responses (Open-Meteo & BigDataCloud) ---------- */

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface ForecastResponse {
  current: {
    time: string; // local time at the city, e.g. "2026-10-02T14:15"
    temperature_2m: number; // °C
    apparent_temperature: number; // °C
    relative_humidity_2m: number; // %
    surface_pressure: number; // hPa
    wind_speed_10m: number; // km/h
    visibility: number; // metres
    weather_code: number; // WMO code
    is_day: number; // 1 = day, 0 = night
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
}

export interface ReverseGeocodeResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

/* ---------- Clean data the UI uses ---------- */

export interface WeatherData {
  place: Place;
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  icon: string;
  isDay: boolean;
  humidity: number;
  windKmh: number;
  pressureHpa: number;
  visibilityM: number;
  sunrise: string;
  sunset: string;
  updatedAt: string;
}
