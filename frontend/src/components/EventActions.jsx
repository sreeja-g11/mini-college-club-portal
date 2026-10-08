import { useState } from "react";
import { eventsApi } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import EventFormModal from "./EventFormModal";
import PeopleModal from "./PeopleModal";

/**
 * Buttons for one event: register / cancel for students; attendees, edit and cancel for the admin.
 * onChange(updatedEvent) lets the page update its list.
 */
export default function EventActions({ event, onChange }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(null);

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

  const upcoming = !["ENDED", "CANCELLED", "LIVE"].includes(event.status);

  if (isAdmin) {
    return (
      <>
        <button className="btn btn-sm btn-ghost" onClick={() => setModal("people")}>
          Attendees ({event.registeredCount})
        </button>
        {upcoming && (
          <>
            <button className="btn btn-sm btn-ghost" onClick={() => setModal("edit")}>
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger-ghost"
              disabled={busy}
              onClick={() =>
                window.confirm(`Cancel "${event.title}"? Registered students will see it as cancelled.`) &&
                run(() => eventsApi.cancel(event.id), "Event cancelled.")
              }
            >
              Cancel event
            </button>
          </>
        )}
        {modal === "people" && (
          <PeopleModal
            title={`Attendees · ${event.title}`}
            subtitle={`${event.registeredCount} of ${event.capacity} seats taken`}
            load={() => eventsApi.attendees(event.id)}
            dateLabel="Registered on"
            dateKey="registeredAt"
            onClose={() => setModal(null)}
          />
        )}
        {modal === "edit" && (
          <EventFormModal
            event={event}
            onClose={() => setModal(null)}
            onSaved={(saved) => {
              setModal(null);
              onChange(saved);
            }}
          />
        )}
      </>
    );
  }

  if (event.registered) {
    if (!upcoming) return null;
    return (
      <button
        className="btn btn-sm btn-ghost"
        disabled={busy}
        onClick={() =>
          window.confirm("Cancel your registration? Your seat goes to someone else.") &&
          run(() => eventsApi.unregister(event.id), "Registration cancelled.")
        }
      >
        Cancel registration
      </button>
    );
  }

  if (event.status !== "OPEN") return null;
  return (
    <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => run(() => eventsApi.register(event.id), `You're registered for ${event.title}.`)}>
      {busy ? "Registering…" : "Register"}
    </button>
  );
}
