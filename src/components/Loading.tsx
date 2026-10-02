export default function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Getting the latest weather…</p>
    </div>
  );
}
