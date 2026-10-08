import { useState } from "react";
import { clubsApi } from "../api";
import { useToast } from "../context/ToastContext";
import { CATEGORIES, CATEGORY_KEYS } from "../utils/format";
import { validateClub } from "../utils/validation";
import Field from "./Field";
import { ErrorBox } from "./Feedback";
import Modal from "./Modal";

const toForm = (c) => ({
  name: c?.name ?? "",
  category: c?.category ?? "",
  tagline: c?.tagline ?? "",
  description: c?.description ?? "",
  clubHead: c?.clubHead ?? "",
  facultyAdvisor: c?.facultyAdvisor ?? "",
  meetingInfo: c?.meetingInfo ?? "",
  contactEmail: c?.contactEmail ?? "",
  maxMembers: c?.maxMembers ?? 40,
});

/** Create a club (club = null) or edit one. Calls onSaved(savedClubCard). */
export default function ClubFormModal({ club, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(club));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateClub(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setServerError("");
    const body = { ...form, maxMembers: Number(form.maxMembers) };
    try {
      const saved = club ? await clubsApi.update(club.id, body) : await clubsApi.create(body);
      toast(club ? "Club updated." : `${saved.name} created.`);
      onSaved(saved);
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal
      title={club ? `Edit ${club.name}` : "New club"}
      subtitle="Students see this on the club page."
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" form="club-form" disabled={busy}>
            {busy ? "Saving…" : club ? "Save changes" : "Create club"}
          </button>
        </>
      }
    >
      <ErrorBox message={serverError} />
      <form id="club-form" className="form" onSubmit={submit} noValidate>
        <div className="form-row">
          <Field label="Club name" error={errors.name} htmlFor="c-name">
            <input id="c-name" value={form.name} onChange={set("name")} maxLength={80} />
          </Field>
          <Field label="Category" error={errors.category} htmlFor="c-cat">
            <select id="c-cat" value={form.category} onChange={set("category")}>
              <option value="">Select a category</option>
              {CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k].label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Tagline" error={errors.tagline} htmlFor="c-tag" hint="One line shown on the club card.">
          <input id="c-tag" value={form.tagline} onChange={set("tagline")} maxLength={160} />
        </Field>
        <Field label="About the club" error={errors.description} htmlFor="c-desc">
          <textarea id="c-desc" rows={4} value={form.description} onChange={set("description")} maxLength={2000} />
        </Field>
        <div className="form-row">
          <Field label="Club head" htmlFor="c-head" hint="Optional, e.g. Varun Teja (III CSE)">
            <input id="c-head" value={form.clubHead} onChange={set("clubHead")} maxLength={100} />
          </Field>
          <Field label="Faculty advisor" htmlFor="c-adv" hint="Optional">
            <input id="c-adv" value={form.facultyAdvisor} onChange={set("facultyAdvisor")} maxLength={100} />
          </Field>
        </div>
        <div className="form-row">
          <Field label="Meets" htmlFor="c-meet" hint="Optional, e.g. Wednesdays, 4 PM, Lab 204">
            <input id="c-meet" value={form.meetingInfo} onChange={set("meetingInfo")} maxLength={120} />
          </Field>
          <Field label="Contact email" error={errors.contactEmail} htmlFor="c-mail" hint="Optional">
            <input id="c-mail" type="email" value={form.contactEmail} onChange={set("contactEmail")} maxLength={150} />
          </Field>
        </div>
        <Field label="Maximum members" error={errors.maxMembers} htmlFor="c-max">
          <input id="c-max" type="number" min={1} max={500} value={form.maxMembers} onChange={set("maxMembers")} />
        </Field>
      </form>
    </Modal>
  );
}
