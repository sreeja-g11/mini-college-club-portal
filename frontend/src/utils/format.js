export const CATEGORIES = {
  TECHNICAL: { label: "Technical", color: "#2f6fdb" },
  CULTURAL: { label: "Cultural", color: "#d6457a" },
  SPORTS: { label: "Sports", color: "#1f9d6b" },
  LITERARY: { label: "Literary", color: "#7c55c9" },
  ARTS: { label: "Arts", color: "#d9821a" },
  COMMUNITY: { label: "Community", color: "#0f8f9c" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const categoryLabel = (key) => CATEGORIES[key]?.label ?? key;
export const categoryColor = (key) => CATEGORIES[key]?.color ?? "#5d6b66";

export const STATUS_LABELS = {
  OPEN: "Open",
  FULL: "Full",
  CLOSED: "Registration closed",
  LIVE: "Happening now",
  ENDED: "Ended",
  CANCELLED: "Cancelled",
};

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const dateFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const fullFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : "");
export const formatTime = (iso) => (iso ? timeFmt.format(new Date(iso)) : "");
export const formatFullDate = (iso) => (iso ? fullFmt.format(new Date(iso)) : "");
export const formatDateTime = (iso) => (iso ? `${formatDate(iso)}, ${formatTime(iso)}` : "");

export const dayNumber = (iso) => new Date(iso).getDate();
export const monthShort = (iso) => new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(iso));

/** "3 days ago", "just now", "in 2 hours". `now` is passed in so components stay pure. */
export function relativeTime(iso, now) {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const units = [
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms) {
      const n = Math.round(diff / ms);
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(n, unit);
    }
  }
  return "just now";
}

export const yearLabel = (year) => (year ? ["I", "II", "III", "IV"][year - 1] + " year" : "");

export const greeting = (date) => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
