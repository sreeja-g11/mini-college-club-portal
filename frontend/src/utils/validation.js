const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

/** Each function returns {field: message} for the fields that are wrong (empty object = valid). */

export function validateLogin({ email, password }) {
  const e = {};
  if (!email.trim()) e.email = "Email is required.";
  else if (!EMAIL.test(email.trim())) e.email = "Enter a valid email address.";
  if (!password) e.password = "Password is required.";
  return e;
}

export function validateRegister(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Name is required.";
  else if (f.name.trim().length > 100) e.name = "Name can be at most 100 characters.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!PASSWORD.test(f.password)) e.password = "Use 8-64 characters with at least one letter and one number.";
  if (f.confirm !== f.password) e.confirm = "Passwords don't match.";
  if (f.department.length > 100) e.department = "Department can be at most 100 characters.";
  return e;
}

export function validateClub(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Club name is required.";
  else if (f.name.trim().length > 80) e.name = "Club name can be at most 80 characters.";
  if (!f.category) e.category = "Pick a category.";
  if (!f.tagline.trim()) e.tagline = "Tagline is required.";
  else if (f.tagline.trim().length > 160) e.tagline = "Tagline can be at most 160 characters.";
  if (!f.description.trim()) e.description = "Description is required.";
  else if (f.description.trim().length > 2000) e.description = "Description can be at most 2000 characters.";
  if (f.contactEmail.trim() && !EMAIL.test(f.contactEmail.trim())) e.contactEmail = "Enter a valid email.";
  const max = Number(f.maxMembers);
  if (!Number.isInteger(max) || max < 1 || max > 500) e.maxMembers = "Enter a whole number from 1 to 500.";
  return e;
}

export function validateEvent(f, { isNew, now }) {
  const e = {};
  if (!f.clubId) e.clubId = "Pick the club running this event.";
  if (!f.title.trim()) e.title = "Title is required.";
  else if (f.title.trim().length > 120) e.title = "Title can be at most 120 characters.";
  if (!f.venue.trim()) e.venue = "Venue is required.";
  const start = f.startsAt ? new Date(f.startsAt).getTime() : NaN;
  const end = f.endsAt ? new Date(f.endsAt).getTime() : NaN;
  const deadline = f.registrationDeadline ? new Date(f.registrationDeadline).getTime() : NaN;
  if (Number.isNaN(start)) e.startsAt = "Start time is required.";
  else if (isNew && start <= now) e.startsAt = "Start time must be in the future.";
  if (Number.isNaN(end)) e.endsAt = "End time is required.";
  else if (!Number.isNaN(start) && end <= start) e.endsAt = "End time must be after the start time.";
  if (Number.isNaN(deadline)) e.registrationDeadline = "Registration deadline is required.";
  else if (!Number.isNaN(start) && deadline > start) e.registrationDeadline = "Deadline can't be after the event starts.";
  else if (isNew && deadline <= now) e.registrationDeadline = "Deadline must be in the future.";
  const cap = Number(f.capacity);
  if (!Number.isInteger(cap) || cap < 1 || cap > 2000) e.capacity = "Enter a whole number from 1 to 2000.";
  return e;
}

export function validateNotice(f) {
  const e = {};
  if (!f.title.trim()) e.title = "Title is required.";
  else if (f.title.trim().length > 140) e.title = "Title can be at most 140 characters.";
  if (!f.body.trim()) e.body = "Message is required.";
  else if (f.body.trim().length > 3000) e.body = "Message can be at most 3000 characters.";
  return e;
}
