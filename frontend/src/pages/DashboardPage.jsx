import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { portalApi } from "../api";
import ClubFormModal from "../components/ClubFormModal";
import EventActions from "../components/EventActions";
import EventFormModal from "../components/EventFormModal";
import EventTicket from "../components/EventTicket";
import { EmptyState, ErrorBox } from "../components/Feedback";
import Icon from "../components/Icon";
import NoticeCard from "../components/NoticeCard";
import NoticeFormModal from "../components/NoticeFormModal";
import Spinner from "../components/Spinner";
import { CategoryTag } from "../components/Tags";
import { useAuth } from "../context/AuthContext";
import { categoryColor, greeting } from "../utils/format";
import { useAsync, useNow } from "../utils/useAsync";

function Stats({ stats }) {
  return (
    <div className="stats">
      {stats.map((s, i) => (
        <div key={s.label} className={`stat stat-${i % 4}`}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
          {s.hint && <small>{s.hint}</small>}
        </div>
      ))}
    </div>
  );
}

function Panel({ title, link, linkText = "See all", children }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h2>{title}</h2>
        {link && (
          <Link to={link} className="panel-link">
            {linkText} →
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const now = useNow();
  const dash = useAsync(() => portalApi.dashboard(), []);

  if (!dash.data) {
    return dash.error ? <ErrorBox message={dash.error} onRetry={dash.reload} /> : <Spinner label="Loading your dashboard…" />;
  }
  const d = dash.data;
  const first = user.name.split(" ")[0];

  return isAdmin ? (
    <AdminDashboard d={d} now={now} reload={dash.reload} />
  ) : (
    <div className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">{greeting(new Date(now))}</span>
          <h1>Hi {first}, here's what's happening on campus.</h1>
          <p>
            {d.clubs.length === 0
              ? "You haven't joined a club yet. Find one that fits you."
              : `You're part of ${d.clubs.length} club${d.clubs.length > 1 ? "s" : ""}. ${d.suggestedEvents.length ? "There are open events waiting for you." : ""}`}
          </p>
        </div>
        <Link to="/clubs" className="btn btn-primary">
          Explore clubs
        </Link>
      </section>

      <ErrorBox message={dash.error} onRetry={dash.reload} />
      <Stats stats={d.stats} />

      <div className="dash-grid">
        <div className="stack">
          <Panel title="Your upcoming events" link="/me" linkText="My participation">
            {d.upcomingEvents.length === 0 ? (
              <EmptyState title="No events yet" text="Register for an event and it will show up here." />
            ) : (
              <div className="stack-sm">
                {d.upcomingEvents.map((e) => (
                  <EventTicket key={e.id} event={e} compact actions={<EventActions event={e} onChange={dash.reload} />} />
                ))}
              </div>
            )}
          </Panel>
          <Panel title="Open for registration" link="/events">
            {d.suggestedEvents.length === 0 ? (
              <p className="muted">No open events right now. Check back soon.</p>
            ) : (
              <div className="stack-sm">
                {d.suggestedEvents.map((e) => (
                  <EventTicket key={e.id} event={e} compact actions={<EventActions event={e} onChange={dash.reload} />} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="stack">
          <Panel title="Your clubs" link="/clubs" linkText="Find more">
            {d.clubs.length === 0 ? (
              <p className="muted">Clubs you join will be listed here.</p>
            ) : (
              <ul className="mini-list">
                {d.clubs.map((c) => (
                  <li key={c.id} style={{ "--cat": categoryColor(c.category) }}>
                    <Link to={`/clubs/${c.id}`}>{c.name}</Link>
                    <CategoryTag category={c.category} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Notice board" link="/notices">
            {d.announcements.length === 0 ? (
              <p className="muted">No notices yet.</p>
            ) : (
              <div className="stack-sm">
                {d.announcements.map((n) => (
                  <NoticeCard key={n.id} notice={n} now={now} clamp />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ d, now, reload }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const close = () => setModal(null);

  return (
    <div className="page">
      <section className="hero hero-admin">
        <div>
          <span className="eyebrow">Club office</span>
          <h1>Portal overview</h1>
          <p>Create clubs and events, post notices and keep an eye on participation.</p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setModal("club")}>
            <Icon name="plus" size={16} /> New club
          </button>
          <button className="btn btn-light" onClick={() => setModal("event")}>
            <Icon name="plus" size={16} /> New event
          </button>
          <button className="btn btn-light" onClick={() => setModal("notice")}>
            <Icon name="plus" size={16} /> Post notice
          </button>
        </div>
      </section>

      <Stats stats={d.stats} />

      <div className="dash-grid">
        <div className="stack">
          <Panel title="Coming up" link="/events">
            {d.upcomingEvents.length === 0 ? (
              <EmptyState title="No upcoming events" text="Create one to get students involved." />
            ) : (
              <div className="stack-sm">
                {d.upcomingEvents.map((e) => (
                  <EventTicket key={e.id} event={e} compact actions={<EventActions event={e} onChange={reload} />} />
                ))}
              </div>
            )}
          </Panel>
        </div>
        <div className="stack">
          <Panel title="Most popular clubs" link="/clubs" linkText="All clubs">
            <p className="muted small">Bars show how full each club is.</p>
            <ul className="bar-list">
              {d.clubs.map((c) => (
                <li key={c.id} style={{ "--cat": categoryColor(c.category) }}>
                  <div className="bar-list-label">
                    <Link to={`/clubs/${c.id}`}>{c.name}</Link>
                    <span>
                      {c.memberCount}/{c.maxMembers}
                    </span>
                  </div>
                  <div className="bar-list-bar">
                    <span style={{ width: `${Math.min(100, (c.memberCount / c.maxMembers) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Latest notices" link="/notices">
            <div className="stack-sm">
              {d.announcements.map((n) => (
                <NoticeCard key={n.id} notice={n} now={now} clamp />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {modal === "club" && (
        <ClubFormModal
          onClose={close}
          onSaved={(c) => {
            close();
            navigate(`/clubs/${c.id}`);
          }}
        />
      )}
      {modal === "event" && (
        <EventFormModal
          onClose={close}
          onSaved={() => {
            close();
            reload();
          }}
        />
      )}
      {modal === "notice" && (
        <NoticeFormModal
          onClose={close}
          onSaved={() => {
            close();
            reload();
          }}
        />
      )}
    </div>
  );
}
