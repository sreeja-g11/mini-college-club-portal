import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import { ErrorBox } from "../components/Feedback";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";
import AuthShell from "./AuthShell";

const DEMO = [
  { label: "Student", email: "student@clubportal.edu", password: "Student@123" },
  { label: "Admin", email: "admin@clubportal.edu", password: "Admin@123" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setServerError("");
    try {
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to explore clubs and register for events.">
      <ErrorBox message={serverError} />
      <form onSubmit={submit} noValidate className="form">
        <Field label="College email" error={errors.email} htmlFor="email">
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@clubportal.edu" />
        </Field>
        <Field label="Password" error={errors.password} htmlFor="password">
          <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={set("password")} />
        </Field>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="auth-switch">
        New here? <Link to="/register">Create a student account</Link>
      </p>
      <div className="demo-box">
        <span>Demo accounts (click to fill)</span>
        <div>
          {DEMO.map((d) => (
            <button
              key={d.label}
              type="button"
              className="chip"
              onClick={() => {
                setForm({ email: d.email, password: d.password });
                setErrors({});
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
