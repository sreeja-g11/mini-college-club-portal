import { Link } from "react-router-dom";
import { categoryColor } from "../utils/format";
import { CategoryTag, SeatMeter } from "./Tags";

export default function ClubCard({ club, action }) {
  return (
    <article className={club.active ? "club-card" : "club-card is-archived"} style={{ "--cat": categoryColor(club.category) }}>
      <div className="club-card-top">
        <CategoryTag category={club.category} />
        {club.joined && <span className="badge badge-joined">Joined</span>}
        {!club.active && <span className="badge badge-muted">Archived</span>}
      </div>
      <h3>
        <Link to={`/clubs/${club.id}`}>{club.name}</Link>
      </h3>
      <p className="club-card-tagline">{club.tagline}</p>
      <dl className="club-card-meta">
        {club.clubHead && (
          <div>
            <dt>Head</dt>
            <dd>{club.clubHead}</dd>
          </div>
        )}
        {club.meetingInfo && (
          <div>
            <dt>Meets</dt>
            <dd>{club.meetingInfo}</dd>
          </div>
        )}
      </dl>
      <SeatMeter used={club.memberCount} total={club.maxMembers} label="Members" />
      <div className="club-card-foot">
        <span className="muted small">
          {club.upcomingEvents === 0 ? "No upcoming events" : `${club.upcomingEvents} upcoming event${club.upcomingEvents > 1 ? "s" : ""}`}
        </span>
        {action}
      </div>
    </article>
  );
}
