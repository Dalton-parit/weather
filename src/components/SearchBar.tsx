import { useState } from "react";
import type { FormEvent } from "react";
import type { Place } from "../types/weather";

interface Props {
  disabled: boolean;
  suggestions: Place[];
  onSearch: (query: string) => void;
  onSelect: (place: Place) => void;
  onUseLocation: () => void;
}

export default function SearchBar({
  disabled,
  suggestions,
  onSearch,
  onSelect,
  onUseLocation,
}: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <div className="search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city, e.g. Nairobi"
          aria-label="City name"
        />
        <button type="submit" className="btn btn-primary" disabled={disabled || !query.trim()}>
          Search
        </button>
        <button type="button" className="btn btn-secondary" disabled={disabled} onClick={onUseLocation}>
          📍 Use My Location
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <p>Several cities match. Choose the one you mean:</p>
          <ul>
            {suggestions.map((place) => (
              <li key={`${place.latitude},${place.longitude}`}>
                <button type="button" onClick={() => onSelect(place)}>
                  <strong>{place.name}</strong>
                  <span>{[place.region, place.country].filter(Boolean).join(", ")}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
