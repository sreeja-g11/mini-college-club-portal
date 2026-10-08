import { useState } from "react";
import { clubsApi } from "../api";
import { useToast } from "../context/ToastContext";

/** Join / leave button for students. onChange(updatedClubCard). */
export default function ClubJoinButton({ club, onChange, size = "sm" }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async (action, message) => {
    setBusy(true);
    try {
      const updated = await action();
      onChange(updated);
      toast(message);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const cls = size === "sm" ? "btn btn-sm" : "btn";
  if (club.joined) {
    return (
      <button
        className={`${cls} btn-ghost`}
        disabled={busy}
        onClick={() => window.confirm(`Leave ${club.name}?`) && run(() => clubsApi.leave(club.id), `You left ${club.name}.`)}
      >
        Leave club
      </button>
    );
  }
  if (club.full) {
    return (
      <button className={`${cls} btn-ghost`} disabled>
        Club full
      </button>
    );
  }
  return (
    <button className={`${cls} btn-primary`} disabled={busy} onClick={() => run(() => clubsApi.join(club.id), `Welcome to ${club.name}!`)}>
      {busy ? "Joining…" : "Join club"}
    </button>
  );
}
