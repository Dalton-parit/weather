import type { Units } from "../types/weather";

interface Props {
  units: Units;
  onChange: (units: Units) => void;
}

export default function UnitToggle({ units, onChange }: Props) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      <button
        type="button"
        className={units === "metric" ? "active" : ""}
        aria-pressed={units === "metric"}
        onClick={() => onChange("metric")}
      >
        °C
      </button>
      <button
        type="button"
        className={units === "imperial" ? "active" : ""}
        aria-pressed={units === "imperial"}
        onClick={() => onChange("imperial")}
      >
        °F
      </button>
    </div>
  );
}
