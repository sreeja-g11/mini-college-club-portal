import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { ErrorBox } from "../components/Feedback";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateRegister } from "../utils/validation";
import AuthShell from "./AuthShell";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", department: "", year: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setServerError("");
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department.trim() || null,
        year: form.year ? Number(form.year) : null,
      });
      toast(`Welcome, ${user.name.split(" ")[0]}! Pick a club to get started.`);
      navigate("/clubs", { replace: true });
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Student accounts can join clubs and register for events.">
      <ErrorBox message={serverError} />
      <form onSubmit={submit} noValidate className="form">
        <Field label="Full name" error={errors.name} htmlFor="name">
          <input id="name" value={form.name} onChange={set("name")} autoComplete="name" />
        </Field>
        <Field label="College email" error={errors.email} htmlFor="email">
          <input id="email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        </Field>
        <div className="form-row">
          <Field label="Department" error={errors.department} htmlFor="department" hint="Optional">
            <input id="department" value={form.department} onChange={set("department")} placeholder="CSE" />
          </Field>
          <Field label="Year" htmlFor="year" hint="Optional">
            <select id="year" value={form.year} onChange={set("year")}>
              <option value="">Select</option>
              <option value="1">I year</option>
              <option value="2">II year</option>
              <option value="3">III year</option>
              <option value="4">IV year</option>
            </select>
          </Field>
        </div>
        <div className="form-row">
          <Field label="Password" error={errors.password} htmlFor="password">
            <input id="password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password" error={errors.confirm} htmlFor="confirm">
            <input id="confirm" type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" />
          </Field>
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}
