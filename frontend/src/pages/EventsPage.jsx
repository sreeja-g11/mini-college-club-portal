import { useState } from "react";
import { clubsApi, eventsApi } from "../api";
import EventActions from "../components/EventActions";
import EventFormModal from "../components/EventFormModal";
import EventTicket from "../components/EventTicket";
import { EmptyState, ErrorBox } from "../components/Feedback";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";
import { useAsync } from "../utils/useAsync";

export default function EventsPage() {
  const { isAdmin, isStudent } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [clubId, setClubId] = useState("");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const params = {
    when: tab === "past" ? "past" : "upcoming",
    mine: tab === "mine" || undefined,
    clubId: clubId || undefined,
  };
  const events = useAsync(() => eventsApi.list(params), [tab, clubId]);
  const clubs = useAsync(() => clubsApi.list(), []);

  const q = query.trim().toLowerCase();
  const visible = (events.data ?? []).filter((e) => !q || `${e.title} ${e.venue} ${e.clubName}`.toLowerCase().includes(q));
  const replace = (updated) => events.setData((list) => list.map((e) => (e.id === updated.id ? updated : e)));

  // Group tickets under a date heading.
  const groups = [];
  for (const e of visible) {
    const day = formatDate(e.startsAt);
    if (groups.length === 0 || groups[groups.length - 1].day !== day) groups.push({ day, items: [] });
    groups[groups.length - 1].items.push(e);
  }

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    ...(isStudent ? [{ key: "mine", label: "My registrations" }] : []),
    { key: "past", label: "Past" },
  ];

  return (
    <div className="page">
      <PageHeader eyebrow="Calendar" title="Events" subtitle="Workshops, competitions and meet-ups from every club.">
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={16} /> New event
          </button>
        )}
      </PageHeader>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "tab is-active" : "tab"} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="filters filters-inline">
        <label className="search-box">
          <Icon name="search" size={18} />
          <input placeholder="Search by title, venue or club" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search events" />
        </label>
        <select value={clubId} onChange={(e) => setClubId(e.target.value)} aria-label="Filter by club">
          <option value="">All clubs</option>
          {(clubs.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ErrorBox message={events.error} onRetry={events.reload} />
      {!events.data && events.loading ? (
        <Spinner label="Loading events…" />
      ) : visible.length === 0 ? (
        <EmptyState
          title={tab === "mine" ? "You haven't registered for anything yet" : "No events found"}
          text={tab === "mine" ? "Open the Upcoming tab and grab a seat." : "Try another club or search."}
        />
      ) : (
        <div className={events.loading ? "timeline is-refreshing" : "timeline"}>
          {groups.map((g) => (
            <section key={g.day} className="timeline-day">
              <h2 className="timeline-label">{g.day}</h2>
              <div className="stack-sm">
                {g.items.map((e) => (
                  <EventTicket key={e.id} event={e} actions={<EventActions event={e} onChange={replace} />} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {creating && (
        <EventFormModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            events.reload();
          }}
        />
      )}
    </div>
  );
}
