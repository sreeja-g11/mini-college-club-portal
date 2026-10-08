import { STATUS_LABELS, categoryColor, categoryLabel } from "../utils/format";

export function CategoryTag({ category }) {
  return (
    <span className="cat-tag" style={{ "--cat": categoryColor(category) }}>
      <i aria-hidden="true" />
      {categoryLabel(category)}
    </span>
  );
}

export function StatusPill({ status }) {
  return <span className={`status-pill status-${status.toLowerCase()}`}>{STATUS_LABELS[status] ?? status}</span>;
}

export function SeatMeter({ used, total, label }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const tone = pct >= 100 ? "full" : pct >= 80 ? "warn" : "ok";
  return (
    <div className={`seat-meter seat-${tone}`}>
      <div className="seat-meter-text">
        <span>{label}</span>
        <strong>
          {used}/{total}
        </strong>
      </div>
      <div className="seat-meter-bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
