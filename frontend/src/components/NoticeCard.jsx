import { Link } from "react-router-dom";
import { categoryColor, formatFullDate, relativeTime } from "../utils/format";

export default function NoticeCard({ notice, now, actions, clamp = false }) {
  return (
    <article className={notice.pinned ? "notice is-pinned" : "notice"} style={{ "--cat": categoryColor(notice.clubCategory) }}>
      {notice.pinned && (
        <span className="notice-pin" title="Pinned">
          Pinned
        </span>
      )}
      <div className="notice-meta">
        {notice.clubId ? (
          <Link to={`/clubs/${notice.clubId}`} className="notice-club">
            {notice.clubName}
          </Link>
        ) : (
          <span className="notice-club notice-general">Whole college</span>
        )}
        <span title={formatFullDate(notice.createdAt)}>{relativeTime(notice.createdAt, now)}</span>
      </div>
      <h3>{notice.title}</h3>
      <p className={clamp ? "notice-body clamp" : "notice-body"}>{notice.body}</p>
      <div className="notice-foot">
        <span className="muted small">
          Posted by {notice.postedBy}
          {notice.updatedAt ? " · edited" : ""}
        </span>
        {actions}
      </div>
    </article>
  );
}
