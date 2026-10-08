import { useState } from "react";
import { clubsApi, eventsApi } from "../api";
import { useToast } from "../context/ToastContext";
import { fromLocalInput, toLocalInput } from "../utils/datetime";
import { useAsync, useNow } from "../utils/useAsync";
import { validateEvent } from "../utils/validation";
import Field from "./Field";
import { ErrorBox } from "./Feedback";
import Modal from "./Modal";

const toForm = (e, clubId) => ({
  clubId: e?.clubId ?? clubId ?? "",
  title: e?.title ?? "",
  description: e?.description ?? "",
  venue: e?.venue ?? "",
  startsAt: toLocalInput(e?.startsAt),
  endsAt: toLocalInput(e?.endsAt),
  registrationDeadline: toLocalInput(e?.registrationDeadline),
  capacity: e?.capacity ?? 50,
});

/** Create an event (event = null) or edit one. `clubId` pre-selects the club for new events. */
export default function EventFormModal({ event, clubId, onClose, onSaved }) {
  const toast = useToast();
  const now = useNow();
  const clubs = useAsync(() => clubsApi.list(), []);
  const [form, setForm] = useState(() => toForm(event, clubId));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateEvent(form, { isNew: !event, now: Date.now() });
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setServerError("");
    const body = {
      clubId: Number(form.clubId),
      title: form.title.trim(),
      description: form.description.trim() || null,
      venue: form.venue.trim(),
      startsAt: fromLocalInput(form.startsAt),
      endsAt: fromLocalInput(form.endsAt),
      registrationDeadline: fromLocalInput(form.registrationDeadline),
      capacity: Number(form.capacity),
    };
    try {
      const saved = event ? await eventsApi.update(event.id, body) : await eventsApi.create(body);
      toast(event ? "Event updated." : `${saved.title} is now open for registration.`);
      onSaved(saved);
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  const activeClubs = (clubs.data ?? []).filter((c) => c.active);

  return (
    <Modal
      title={event ? "Edit event" : "New event"}
      subtitle="Times are in your local time zone."
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" form="event-form" disabled={busy}>
            {busy ? "Saving…" : event ? "Save changes" : "Create event"}
          </button>
        </>
      }
    >
      <ErrorBox message={serverError || clubs.error} />
      <form id="event-form" className="form" onSubmit={submit} noValidate>
        <div className="form-row">
          <Field label="Club" error={errors.clubId} htmlFor="e-club">
            <select id="e-club" value={form.clubId} onChange={set("clubId")}>
              <option value="">{clubs.loading ? "Loading clubs…" : "Select a club"}</option>
              {activeClubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title" error={errors.title} htmlFor="e-title">
            <input id="e-title" value={form.title} onChange={set("title")} maxLength={120} />
          </Field>
        </div>
        <Field label="Description" htmlFor="e-desc" hint="Optional">
          <textarea id="e-desc" rows={3} value={form.description} onChange={set("description")} maxLength={2000} />
        </Field>
        <div className="form-row">
          <Field label="Venue" error={errors.venue} htmlFor="e-venue">
            <input id="e-venue" value={form.venue} onChange={set("venue")} maxLength={120} />
          </Field>
          <Field label="Seats" error={errors.capacity} htmlFor="e-cap">
            <input id="e-cap" type="number" min={1} max={2000} value={form.capacity} onChange={set("capacity")} />
          </Field>
        </div>
        <div className="form-row form-row-3">
          <Field label="Starts" error={errors.startsAt} htmlFor="e-start">
            <input id="e-start" type="datetime-local" min={event ? undefined : toLocalInput(new Date(now).toISOString())} value={form.startsAt} onChange={set("startsAt")} />
          </Field>
          <Field label="Ends" error={errors.endsAt} htmlFor="e-end">
            <input id="e-end" type="datetime-local" min={form.startsAt || undefined} value={form.endsAt} onChange={set("endsAt")} />
          </Field>
          <Field label="Registration closes" error={errors.registrationDeadline} htmlFor="e-dead">
            <input id="e-dead" type="datetime-local" max={form.startsAt || undefined} value={form.registrationDeadline} onChange={set("registrationDeadline")} />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
