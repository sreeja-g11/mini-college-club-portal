const pad = (n) => String(n).padStart(2, "0");

/** ISO instant -> value for <input type="datetime-local"> in the browser's time zone. */
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** <input type="datetime-local"> value -> ISO instant for the API. */
export const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null);
