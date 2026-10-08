import { useState } from "react";
import { clubsApi, noticesApi } from "../api";
import { EmptyState, ErrorBox } from "../components/Feedback";
import Icon from "../components/Icon";
import NoticeCard from "../components/NoticeCard";
import NoticeFormModal from "../components/NoticeFormModal";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useAsync, useNow } from "../utils/useAsync";

export default function NoticesPage() {
  const { isAdmin, isStudent } = useAuth();
  const toast = useToast();
  const now = useNow();
  const [scope, setScope] = useState("all");
  const [clubId, setClubId] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | notice
  const notices = useAsync(() => noticesApi.list({ mine: scope === "mine" || undefined, clubId: clubId || undefined }), [scope, clubId]);
  const clubs = useAsync(() => clubsApi.list(), []);

  const remove = async (n) => {
    if (!window.confirm(`Delete "${n.title}"?`)) return;
    try {
      await noticesApi.remove(n.id);
      notices.setData((list) => list.filter((x) => x.id !== n.id));
      toast("Notice deleted.");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const togglePin = async (n) => {
    try {
      await noticesApi.update(n.id, { clubId: n.clubId, title: n.title, body: n.body, pinned: !n.pinned });
      notices.reload();
      toast(n.pinned ? "Notice unpinned." : "Notice pinned to the top.");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const list = notices.data ?? [];

  return (
    <div className="page">
      <PageHeader eyebrow="Announcements" title="Notice board" subtitle="College-wide news and updates from each club.">
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setEditing("new")}>
            <Icon name="plus" size={16} /> Post notice
          </button>
        )}
      </PageHeader>

      <div className="filters filters-inline">
        {isStudent && (
          <div className="segmented" role="group" aria-label="Which notices">
            <button className={scope === "all" ? "is-active" : ""} onClick={() => setScope("all")}>
              All notices
            </button>
            <button className={scope === "mine" ? "is-active" : ""} onClick={() => setScope("mine")}>
              For me
            </button>
          </div>
        )}
        <select value={clubId} onChange={(e) => setClubId(e.target.value)} aria-label="Filter by club">
          <option value="">Every club</option>
          {(clubs.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ErrorBox message={notices.error} onRetry={notices.reload} />
      {!notices.data && notices.loading ? (
        <Spinner label="Loading notices…" />
      ) : list.length === 0 ? (
        <EmptyState title="The board is empty" text={scope === "mine" ? "Join clubs to see their notices here." : "Nothing has been posted yet."} />
      ) : (
        <div className="notice-board">
          {list.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              now={now}
              actions={
                isAdmin && (
                  <span className="notice-actions">
                    <button className="btn btn-sm btn-ghost" onClick={() => togglePin(n)}>
                      {n.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditing(n)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger-ghost" onClick={() => remove(n)}>
                      Delete
                    </button>
                  </span>
                )
              }
            />
          ))}
        </div>
      )}

      {editing && (
        <NoticeFormModal
          notice={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            notices.reload();
          }}
        />
      )}
    </div>
  );
}
