import api from "./client";

const data = (promise) => promise.then((res) => res.data);

export const authApi = {
  login: (body) => data(api.post("/auth/login", body)),
  register: (body) => data(api.post("/auth/register", body)),
  me: () => data(api.get("/auth/me")),
};

export const clubsApi = {
  list: (params) => data(api.get("/clubs", { params })),
  get: (id) => data(api.get(`/clubs/${id}`)),
  create: (body) => data(api.post("/clubs", body)),
  update: (id, body) => data(api.put(`/clubs/${id}`, body)),
  setActive: (id, active) => data(api.patch(`/clubs/${id}/active`, { active })),
  join: (id) => data(api.post(`/clubs/${id}/join`)),
  leave: (id) => data(api.delete(`/clubs/${id}/join`)),
  members: (id) => data(api.get(`/clubs/${id}/members`)),
  removeMember: (id, userId) => data(api.delete(`/clubs/${id}/members/${userId}`)),
};

export const eventsApi = {
  list: (params) => data(api.get("/events", { params })),
  get: (id) => data(api.get(`/events/${id}`)),
  create: (body) => data(api.post("/events", body)),
  update: (id, body) => data(api.put(`/events/${id}`, body)),
  cancel: (id) => data(api.post(`/events/${id}/cancel`)),
  register: (id) => data(api.post(`/events/${id}/register`)),
  unregister: (id) => data(api.delete(`/events/${id}/register`)),
  attendees: (id) => data(api.get(`/events/${id}/attendees`)),
};

export const noticesApi = {
  list: (params) => data(api.get("/announcements", { params })),
  create: (body) => data(api.post("/announcements", body)),
  update: (id, body) => data(api.put(`/announcements/${id}`, body)),
  remove: (id) => data(api.delete(`/announcements/${id}`)),
};

export const portalApi = {
  dashboard: () => data(api.get("/dashboard")),
  activity: () => data(api.get("/me/activity")),
  students: () => data(api.get("/students")),
};
