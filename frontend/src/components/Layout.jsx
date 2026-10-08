import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import Icon from "./Icon";

export function Brand({ light = false }) {
  return (
    <span className={light ? "brand brand-light" : "brand"}>
      <img src="/favicon.svg" alt="" width="34" height="34" />
      <span className="brand-text">
        <strong>Mini College</strong>
        <small>Club Portal</small>
      </span>
    </span>
  );
}

export default function Layout() {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: "home", end: true },
    { to: "/clubs", label: "Clubs", icon: "clubs" },
    { to: "/events", label: "Events", icon: "events" },
    { to: "/notices", label: "Notice board", icon: "notices" },
    ...(isStudent ? [{ to: "/me", label: "My participation", icon: "me" }] : []),
    ...(isAdmin ? [{ to: "/students", label: "Students", icon: "students" }] : []),
  ];

  return (
    <div className={open ? "app nav-open" : "app"}>
      <header className="mobile-bar">
        <Brand />
        <button className="icon-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
      </header>

      <aside className="sidebar">
        <div className="sidebar-brand">
          <Brand light />
        </div>
        <nav className="sidebar-nav" onClick={() => setOpen(false)}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="side-link">
              <Icon name={l.icon} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">
            {initials(user.name)}
          </span>
          <span className="sidebar-user-text">
            <strong>{user.name}</strong>
            <small>{isAdmin ? "Club office (admin)" : user.department ? `Student · ${user.department}` : "Student"}</small>
          </span>
          <button
            className="icon-btn icon-btn-light"
            title="Log out"
            aria-label="Log out"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} />

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
