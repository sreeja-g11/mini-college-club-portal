const PATHS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  clubs: "M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14.5 14.2c.5-.1 1-.2 1.5-.2 3.3 0 6 2.4 6 5.5",
  events: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8 13h3M8 16h6",
  notices: "M5 4h14v12l-4 4H5zM15 20v-4h4M8 8h8M8 11h8M8 14h4",
  me: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7",
  students: "M3 8l9-4 9 4-9 4zM7 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5M21 8v6",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4",
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
