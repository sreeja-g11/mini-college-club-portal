export default function Spinner({ label = "Loading…", full = false }) {
  return (
    <div className={full ? "spinner-wrap spinner-full" : "spinner-wrap"} role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
