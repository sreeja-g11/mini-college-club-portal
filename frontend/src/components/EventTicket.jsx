import { Link } from "react-router-dom";
import { categoryColor, dayNumber, formatDate, formatDateTime, formatTime, monthShort } from "../utils/format";
import { StatusPill } from "./Tags";

/** An event drawn as a ticket stub. `actions` are the buttons on the right side. */
export default function EventTicket({ event, actions, compact = false }) {
  const sameDay = formatDate(event.startsAt) === formatDate(event.endsAt);
  return (
    <article
      className={`ticket${compact ? " ticket-compact" : ""}${event.cancelled ? " is-cancelled" : ""}`}
      style={{ "--cat": categoryColor(event.clubCategory) }}
    >
      <div className="ticket-date" aria-label={formatDate(event.startsAt)}>
        <span className="ticket-month">{monthShort(event.startsAt)}</span>
        <span className="ticket-day">{dayNumber(event.startsAt)}</span>
        <span className="ticket-time">{formatTime(event.startsAt)}</span>
      </div>
      <div className="ticket-body">
        <div className="ticket-top">
          <Link to={`/clubs/${event.clubId}`} className="ticket-club">
            {event.clubName}
          </Link>
          <StatusPill status={event.status} />
          {event.registered && <span className="badge badge-joined">You're registered</span>}
        </div>
        <h3>{event.title}</h3>
        {!compact && event.description && <p className="ticket-desc">{event.description}</p>}
        <ul className="ticket-facts">
          <li>
            <b>Where</b> {event.venue}
          </li>
          <li>
            <b>When</b> {formatDate(event.startsAt)}, {formatTime(event.startsAt)} – {sameDay ? formatTime(event.endsAt) : formatDateTime(event.endsAt)}
          </li>
          {!compact && (
            <li>
              <b>Register by</b> {formatDateTime(event.registrationDeadline)}
            </li>
          )}
        </ul>
      </div>
      <div className="ticket-stub">
        {event.status === "ENDED" ? (
          <div className="ticket-seats">
            <strong>{event.registeredCount}</strong>
            <span>students registered</span>
          </div>
        ) : (
          <div className="ticket-seats">
            <strong>{event.seatsLeft}</strong>
            <span>of {event.capacity} seats left</span>
          </div>
        )}
        {actions && <div className="ticket-actions">{actions}</div>}
      </div>
    </article>
  );
}
