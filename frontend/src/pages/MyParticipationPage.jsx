import { Link } from "react-router-dom";
import { portalApi } from "../api";
import ClubCard from "../components/ClubCard";
import ClubJoinButton from "../components/ClubJoinButton";
import EventActions from "../components/EventActions";
import EventTicket from "../components/EventTicket";
import { EmptyState, ErrorBox } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { yearLabel } from "../utils/format";
import { useAsync } from "../utils/useAsync";

export default function MyParticipationPage() {
  const { user } = useAuth();
  const activity = useAsync(() => portalApi.activity(), []);

  if (!activity.data) {
    return activity.error ? <ErrorBox message={activity.error} onRetry={activity.reload} /> : <Spinner label="Loading your activity…" />;
  }
  const { clubs, upcomingEvents, pastEvents } = activity.data;
  const attended = pastEvents.filter((e) => !e.cancelled).length;

  return (
    <div className="page">
      <PageHeader eyebrow="Your record" title="My participation" subtitle={[user.department, yearLabel(user.year)].filter(Boolean).join(" · ") || user.email} />

      <div className="stats">
        <div className="stat stat-0">
          <span className="stat-value">{clubs.length}</span>
          <span className="stat-label">Clubs joined</span>
        </div>
        <div className="stat stat-1">
          <span className="stat-value">{upcomingEvents.filter((e) => !e.cancelled).length}</span>
          <span className="stat-label">Upcoming registrations</span>
        </div>
        <div className="stat stat-2">
          <span className="stat-value">{attended}</span>
          <span className="stat-label">Past events</span>
        </div>
      </div>

      <section className="panel">
        <header className="panel-head">
          <h2>My clubs</h2>
          <Link to="/clubs" className="panel-link">
            Find more →
          </Link>
        </header>
        {clubs.length === 0 ? (
          <EmptyState title="No clubs yet" text="Join a club to start participating.">
            <Link to="/clubs" className="btn btn-primary">
              Explore clubs
            </Link>
          </EmptyState>
        ) : (
          <div className="card-grid">
            {clubs.map((c) => (
              <ClubCard key={c.id} club={c} action={<ClubJoinButton club={c} onChange={activity.reload} />} />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Upcoming registrations</h2>
        {upcomingEvents.length === 0 ? (
          <p className="muted">
            Nothing booked. <Link to="/events">See upcoming events</Link>
          </p>
        ) : (
          <div className="stack-sm">
            {upcomingEvents.map((e) => (
              <EventTicket key={e.id} event={e} actions={<EventActions event={e} onChange={activity.reload} />} />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Event history</h2>
        {pastEvents.length === 0 ? (
          <p className="muted">Events you attend will be listed here.</p>
        ) : (
          <div className="stack-sm">
            {pastEvents.map((e) => (
              <EventTicket key={e.id} event={e} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
