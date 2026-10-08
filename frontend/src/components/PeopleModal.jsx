import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { formatDateTime, yearLabel } from "../utils/format";
import { useAsync } from "../utils/useAsync";
import { EmptyState, ErrorBox } from "./Feedback";
import Modal from "./Modal";
import Spinner from "./Spinner";

/**
 * Lists club members or event attendees for the admin.
 * `load` fetches the list; `onRemove(person)` (optional) adds a Remove button per row.
 */
export default function PeopleModal({ title, subtitle, load, dateLabel, dateKey, onRemove, onClose }) {
  const toast = useToast();
  const people = useAsync(load, []);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);

  const q = query.trim().toLowerCase();
  const rows = (people.data ?? []).filter((p) => !q || `${p.name} ${p.email} ${p.department ?? ""}`.toLowerCase().includes(q));

  const remove = async (p) => {
    if (!window.confirm(`Remove ${p.name}?`)) return;
    setBusyId(p.userId);
    try {
      await onRemove(p);
      people.setData((list) => list.filter((x) => x.userId !== p.userId));
      toast(`${p.name} removed.`);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Department", "Year", dateLabel];
    const lines = rows.map((p) => [p.name, p.email, p.department ?? "", p.year ?? "", formatDateTime(p[dateKey])]);
    const csv = [header, ...lines].map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose} wide>
      <ErrorBox message={people.error} onRetry={people.reload} />
      {!people.data && people.loading ? (
        <Spinner />
      ) : people.data?.length === 0 ? (
        <EmptyState title="Nobody yet" text="Names appear here as students sign up." />
      ) : (
        <>
          <div className="toolbar">
            <input className="search-input" placeholder="Search by name, email or department" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn btn-ghost btn-sm" onClick={exportCsv} disabled={!rows.length}>
              Download CSV
            </button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>{dateLabel}</th>
                  {onRemove && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.userId}>
                    <td>
                      <strong>{p.name}</strong>
                      <div className="muted small">{p.email}</div>
                    </td>
                    <td>
                      {p.department ?? "—"}
                      {p.year ? <div className="muted small">{yearLabel(p.year)}</div> : null}
                    </td>
                    <td>{formatDateTime(p[dateKey])}</td>
                    {onRemove && (
                      <td className="cell-actions">
                        <button className="btn btn-sm btn-danger-ghost" disabled={busyId === p.userId} onClick={() => remove(p)}>
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">
            Showing {rows.length} of {people.data.length}
          </p>
        </>
      )}
    </Modal>
  );
}
