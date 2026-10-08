import { Brand } from "../components/Layout";

const NOTES = [
  { tone: "mustard", tag: "Technical", title: "HackNight 2.0", text: "Overnight build sprint · Seminar Hall A" },
  { tone: "coral", tag: "Cultural", title: "Open Mic Evening", text: "Five minutes on stage, all yours" },
  { tone: "mint", tag: "Community", title: "Blood Donation Camp", text: "Volunteers needed · Health Centre" },
  { tone: "sky", tag: "Literary", title: "Debate: AI in Classrooms", text: "Teams of two · Seminar Hall B" },
];

/** Two-column page used by login and sign-up: a notice-board illustration and the form. */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <section className="auth-board" aria-hidden="true">
        <Brand light />
        <div className="board">
          {NOTES.map((n, i) => (
            <div key={n.title} className={`board-note note-${n.tone}`} style={{ "--tilt": `${[-3, 2.5, -1.5, 3][i]}deg` }}>
              <span className="board-pin" />
              <small>{n.tag}</small>
              <strong>{n.title}</strong>
              <span>{n.text}</span>
            </div>
          ))}
        </div>
        <div className="auth-board-copy">
          <h2>Every club, event and notice on one board.</h2>
          <p>Find your people, grab a seat at the next event and never miss an announcement again.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
