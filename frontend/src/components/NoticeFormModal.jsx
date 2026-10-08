import { useState } from "react";
import { clubsApi, noticesApi } from "../api";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../utils/useAsync";
import { validateNotice } from "../utils/validation";
import Field from "./Field";
import { ErrorBox } from "./Feedback";
import Modal from "./Modal";

/** Post a notice (notice = null) or edit one. `clubId` pre-selects the audience. */
export default function NoticeFormModal({ notice, clubId, onClose, onSaved }) {
  const toast = useToast();
  const clubs = useAsync(() => clubsApi.list(), []);
  const [form, setForm] = useState(() => ({
    clubId: notice ? (notice.clubId ?? "") : (clubId ?? ""),
    title: notice?.title ?? "",
    body: notice?.body ?? "",
    pinned: notice?.pinned ?? false,
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateNotice(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setServerError("");
    const body = { clubId: form.clubId ? Number(form.clubId) : null, title: form.title.trim(), body: form.body.trim(), pinned: form.pinned };
    try {
      const saved = notice ? await noticesApi.update(notice.id, body) : await noticesApi.create(body);
      toast(notice ? "Notice updated." : "Notice posted.");
      onSaved(saved);
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal
      title={notice ? "Edit notice" : "Post a notice"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" form="notice-form" disabled={busy}>
            {busy ? "Saving…" : notice ? "Save changes" : "Post notice"}
          </button>
        </>
      }
    >
      <ErrorBox message={serverError || clubs.error} />
      <form id="notice-form" className="form" onSubmit={submit} noValidate>
        <Field label="Who is it for?" htmlFor="n-club">
          <select id="n-club" value={form.clubId} onChange={set("clubId")}>
            <option value="">Whole college</option>
            {(clubs.data ?? [])
              .filter((c) => c.active)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Title" error={errors.title} htmlFor="n-title">
          <input id="n-title" value={form.title} onChange={set("title")} maxLength={140} />
        </Field>
        <Field label="Message" error={errors.body} htmlFor="n-body">
          <textarea id="n-body" rows={5} value={form.body} onChange={set("body")} maxLength={3000} />
        </Field>
        <label className="check">
          <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
          <span>Pin to the top of the notice board</span>
        </label>
      </form>
    </Modal>
  );
}
