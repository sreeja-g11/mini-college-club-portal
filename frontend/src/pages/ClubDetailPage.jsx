import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { clubsApi } from "../api";
import ClubFormModal from "../components/ClubFormModal";
import ClubJoinButton from "../components/ClubJoinButton";
import EventActions from "../components/EventActions";
import EventFormModal from "../components/EventFormModal";
import EventTicket from "../components/EventTicket";
import { EmptyState, ErrorBox } from "../components/Feedback";
import NoticeCard from "../components/NoticeCard";
import NoticeFormModal from "../components/NoticeFormModal";
import PeopleModal from "../components/PeopleModal";
import Spinner from "../components/Spinner";
import { CategoryTag, SeatMeter } from "../components/Tags";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { categoryColor, formatFullDate } from "../utils/format";
import { useAsync, useNow } from "../utils/useAsync";

export default function ClubDetailPage() {
  const { id } = useParams();
  const { isAdmin, isStudent } = useAuth();
  const toast = useToast();
  const now = useNow();
  const club = useAsync(() => clubsApi.get(id), [id]);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const close = () => setModal(null);

  if (!club.data) {
    if (club.error) {
      return (
        <div className="page">
          <ErrorBox message={club.error} onRetry={club.reload} />
          <Link to="/clubs" className="btn btn-ghost">
            ← All clubs
          </Link>
        </div>
      );
    }
    return <Spinner label="Loading club…" />;
  }
  const c = club.data;

  const mergeCard = (card) => club.setData((d) => ({ ...d, joined: card.joined, memberCount: card.memberCount, full: card.full, active: card.active }));

  const toggleArchive = async () => {
    const msg = c.active
      ? `Archive ${c.name}? Students won't see it and can't join or register for its events.`
      : `Restore ${c.name}? It will be visible to students again.`;
    if (!window.confirm(msg)) return;
    setBusy(true);
    try {
      mergeCard(await clubsApi.setActive(c.id, !c.active));
      toast(c.active ? "Club archived." : "Club restored.");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <Link to="/clubs" className="back-link">
        ← All clubs
      </Link>

      <section className="club-hero" style={{ "--cat": categoryColor(c.category) }}>
        <div className="club-hero-text">
          <div className="club-hero-tags">
            <CategoryTag category={c.category} />
            {c.joined && <span className="badge badge-joined">You're a member</span>}
            {!c.active && <span className="badge badge-muted">Archived</span>}
          </div>
          <h1>{c.name}</h1>
          <p>{c.tagline}</p>
        </div>
        <div className="club-hero-actions">
          {isStudent && <ClubJoinButton club={c} onChange={mergeCard} size="md" />}
          {isAdmin && (
            <>
              <button className="btn btn-light" onClick={() => setModal("members")}>
                Members ({c.memberCount})
              </button>
              <button className="btn btn-light" onClick={() => setModal("edit")}>
                Edit club
              </button>
              <button className="btn btn-light" disabled={busy} onClick={toggleArchive}>
                {c.active ? "Archive" : "Restore"}
              </button>
            </>
          )}
        </div>
      </section>

      <div className="detail-grid">
        <div className="stack">
          <section className="panel">
            <h2>About</h2>
            <p className="prose">{c.description}</p>
          </section>

          <section className="panel">
            <header className="panel-head">
              <h2>Upcoming events</h2>
              {isAdmin && c.active && (
                <button className="btn btn-sm btn-ghost" onClick={() => setModal("event")}>
                  + Add event
                </button>
              )}
            </header>
            {c.upcomingEvents.length === 0 ? (
              <EmptyState title="Nothing scheduled" text="New events from this club will appear here." />
            ) : (
              <div className="stack-sm">
                {c.upcomingEvents.map((e) => (
                  <EventTicket key={e.id} event={e} compact actions={<EventActions event={e} onChange={club.reload} />} />
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <header className="panel-head">
              <h2>Club notices</h2>
              {isAdmin && c.active && (
                <button className="btn btn-sm btn-ghost" onClick={() => setModal("notice")}>
                  + Post notice
                </button>
              )}
            </header>
            {c.announcements.length === 0 ? (
              <p className="muted">No notices from this club yet.</p>
            ) : (
              <div className="stack-sm">
                {c.announcements.map((n) => (
                  <NoticeCard key={n.id} notice={n} now={now} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="panel facts">
          <h2>Club facts</h2>
          <dl>
            <div>
              <dt>Club head</dt>
              <dd>{c.clubHead ?? "—"}</dd>
            </div>
            <div>
              <dt>Faculty advisor</dt>
              <dd>{c.facultyAdvisor ?? "—"}</dd>
            </div>
            <div>
              <dt>Meets</dt>
              <dd>{c.meetingInfo ?? "—"}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{c.contactEmail ? <a href={`mailto:${c.contactEmail}`}>{c.contactEmail}</a> : "—"}</dd>
            </div>
            <div>
              <dt>On the portal since</dt>
              <dd>{formatFullDate(c.createdAt)}</dd>
            </div>
          </dl>
          <SeatMeter used={c.memberCount} total={c.maxMembers} label="Members" />
          {c.full && !c.joined && isStudent && <p className="muted small">This club is full right now. Check back later.</p>}
        </aside>
      </div>

      {modal === "edit" && (
        <ClubFormModal
          club={c}
          onClose={close}
          onSaved={() => {
            close();
            club.reload();
          }}
        />
      )}
      {modal === "members" && (
        <PeopleModal
          title={`Members · ${c.name}`}
          subtitle={`${c.memberCount} of ${c.maxMembers} seats taken`}
          load={() => clubsApi.members(c.id)}
          dateLabel="Joined on"
          dateKey="joinedAt"
          onRemove={async (p) => {
            await clubsApi.removeMember(c.id, p.userId);
            club.reload();
          }}
          onClose={close}
        />
      )}
      {modal === "event" && (
        <EventFormModal
          clubId={c.id}
          onClose={close}
          onSaved={() => {
            close();
            club.reload();
          }}
        />
      )}
      {modal === "notice" && (
        <NoticeFormModal
          clubId={c.id}
          onClose={close}
          onSaved={() => {
            close();
            club.reload();
          }}
        />
      )}
    </div>
  );
}
