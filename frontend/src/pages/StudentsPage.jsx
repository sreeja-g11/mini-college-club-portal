import { useState } from "react";
import { portalApi } from "../api";
import { EmptyState, ErrorBox } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { formatFullDate, initials, yearLabel } from "../utils/format";
import { useAsync } from "../utils/useAsync";

export default function StudentsPage() {
  const students = useAsync(() => portalApi.students(), []);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = (students.data ?? []).filter((s) => !q || `${s.name} ${s.email} ${s.department ?? ""}`.toLowerCase().includes(q));

  return (
    <div className="page">
      <PageHeader eyebrow="Admin" title="Students" subtitle="Everyone with a student account and how active they are." />
      <div className="filters filters-inline">
        <input className="search-input" placeholder="Search by name, email or department" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search students" />
      </div>
      <ErrorBox message={students.error} onRetry={students.reload} />
      {!students.data && students.loading ? (
        <Spinner label="Loading students…" />
      ) : rows.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <div className="panel table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th className="num">Clubs</th>
                <th className="num">Event registrations</th>
                <th>Joined portal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="person">
                      <span className="avatar avatar-sm">{initials(s.name)}</span>
                      <span>
                        <strong>{s.name}</strong>
                        <span className="muted small block">{s.email}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {s.department ?? "—"}
                    {s.year ? <span className="muted small block">{yearLabel(s.year)}</span> : null}
                  </td>
                  <td className="num">{s.clubCount}</td>
                  <td className="num">{s.eventCount}</td>
                  <td>{formatFullDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
