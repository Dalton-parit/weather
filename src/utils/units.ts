import type { Units } from "../types/weather";

export function formatTemp(celsius: number, units: Units): string {
  const value = units === "metric" ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(value)}°${units === "metric" ? "C" : "F"}`;
}

export function formatWind(kmh: number, units: Units): string {
  return units === "metric"
    ? `${Math.round(kmh)} km/h`
    : `${Math.round(kmh * 0.621371)} mph`;
}

export function formatVisibility(metres: number, units: Units): string {
  const km = metres / 1000;
  return units === "metric"
    ? `${km.toFixed(1)} km`
    : `${(km * 0.621371).toFixed(1)} mi`;
}

/** Times from the API are already in the city's local time (no timezone suffix). */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
