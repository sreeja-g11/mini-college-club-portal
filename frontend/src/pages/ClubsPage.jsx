import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clubsApi } from "../api";
import ClubCard from "../components/ClubCard";
import ClubFormModal from "../components/ClubFormModal";
import ClubJoinButton from "../components/ClubJoinButton";
import { EmptyState, ErrorBox } from "../components/Feedback";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, CATEGORY_KEYS, categoryColor } from "../utils/format";
import { useAsync } from "../utils/useAsync";

export default function ClubsPage() {
  const { isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const clubs = useAsync(() => clubsApi.list(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [joinedOnly, setJoinedOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [creating, setCreating] = useState(false);

  const all = clubs.data ?? [];
  const q = query.trim().toLowerCase();
  const visible = all.filter(
    (c) =>
      (showArchived || c.active) &&
      (!category || c.category === category) &&
      (!joinedOnly || c.joined) &&
      (!q || `${c.name} ${c.tagline} ${c.clubHead ?? ""}`.toLowerCase().includes(q)),
  );
  const countFor = (key) => all.filter((c) => c.active && c.category === key).length;
  const replace = (updated) => clubs.setData((list) => list.map((c) => (c.id === updated.id ? updated : c)));

  return (
    <div className="page">
      <PageHeader eyebrow="Discover" title="Clubs" subtitle="Find a club that matches your interests and join in one click.">
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={16} /> New club
          </button>
        )}
      </PageHeader>

      <div className="filters">
        <label className="search-box">
          <Icon name="search" size={18} />
          <input placeholder="Search clubs by name, tagline or club head" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search clubs" />
        </label>
        <div className="chips" role="group" aria-label="Filter by category">
          <button className={category === "" ? "chip is-active" : "chip"} onClick={() => setCategory("")}>
            All
          </button>
          {CATEGORY_KEYS.map((k) => (
            <button key={k} className={category === k ? "chip is-active" : "chip"} style={{ "--cat": categoryColor(k) }} onClick={() => setCategory(k)}>
              <i className="chip-dot" aria-hidden="true" />
              {CATEGORIES[k].label}
              <span className="chip-count">{countFor(k)}</span>
            </button>
          ))}
        </div>
        {isStudent && (
          <label className="check">
            <input type="checkbox" checked={joinedOnly} onChange={(e) => setJoinedOnly(e.target.checked)} />
            <span>Only clubs I've joined</span>
          </label>
        )}
        {isAdmin && (
          <label className="check">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            <span>Show archived clubs</span>
          </label>
        )}
      </div>

      <ErrorBox message={clubs.error} onRetry={clubs.reload} />
      {!clubs.data && clubs.loading ? (
        <Spinner label="Loading clubs…" />
      ) : visible.length === 0 ? (
        <EmptyState title="No clubs match" text="Try another search or category." />
      ) : (
        <div className="card-grid">
          {visible.map((c) => (
            <ClubCard key={c.id} club={c} action={isStudent && <ClubJoinButton club={c} onChange={replace} />} />
          ))}
        </div>
      )}

      {creating && (
        <ClubFormModal
          onClose={() => setCreating(false)}
          onSaved={(c) => {
            setCreating(false);
            navigate(`/clubs/${c.id}`);
          }}
        />
      )}
    </div>
  );
}
