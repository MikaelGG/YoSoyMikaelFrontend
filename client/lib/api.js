/**
 * YoSoy API Client
 * Centralized service to connect YoSoyFrontend to the Spring Boot YoSoyBackend (port 8080).
 * All requests route through the Vite proxy (/api) to http://localhost:8080.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === "object" && data?.message) ||
        (typeof data === "string" && data) ||
        `HTTP error ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Error de red o conexión al backend", 0, error);
  }
}

// ---------------------------------------------------------------------------
// 1. Health
// ---------------------------------------------------------------------------
export const healthApi = {
  check: () => request("/api/v1/health"),
};

// ---------------------------------------------------------------------------
// 2. Live Classes (/api/v1/live-classes)
// ---------------------------------------------------------------------------
export const liveClassesApi = {
  getAll: () => request("/api/v1/live-classes"),
  getById: (id) => request(`/api/v1/live-classes/${id}`),
  create: (data) => request("/api/v1/live-classes", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/live-classes/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/live-classes/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 3. Guided Meditations (/api/v1/guided-meditations)
// ---------------------------------------------------------------------------
export const guidedMeditationsApi = {
  getAll: () => request("/api/v1/guided-meditations"),
  getById: (id) => request(`/api/v1/guided-meditations/${id}`),
  create: (data) => request("/api/v1/guided-meditations", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/guided-meditations/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/guided-meditations/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 4. Music (/api/v1/music)
// ---------------------------------------------------------------------------
export const musicApi = {
  getAll: () => request("/api/v1/music"),
  getById: (id) => request(`/api/v1/music/${id}`),
  create: (data) => request("/api/v1/music", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/music/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/music/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 5. Books (/api/v1/books)
// ---------------------------------------------------------------------------
export const booksApi = {
  getAll: () => request("/api/v1/books"),
  getById: (id) => request(`/api/v1/books/${id}`),
  create: (data) => request("/api/v1/books", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/books/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/books/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 6. Documents (/api/v1/documents)
// ---------------------------------------------------------------------------
export const documentsApi = {
  getAll: () => request("/api/v1/documents"),
  getById: (id) => request(`/api/v1/documents/${id}`),
  create: (data) => request("/api/v1/documents", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/documents/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/documents/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// 7. Healing Programs & Reservations (/api/v1/healing-programs)
// ---------------------------------------------------------------------------
export const healingProgramsApi = {
  getAll: () => request("/api/v1/healing-programs"),
  getById: (id) => request(`/api/v1/healing-programs/${id}`),
  create: (data) => request("/api/v1/healing-programs", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/healing-programs/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/healing-programs/${id}`, { method: "DELETE" }),
  // Reservations
  getReservations: (programId) => request(`/api/v1/healing-programs/${programId}/reservations`),
  createReservation: (programId, reservationData) =>
    request(`/api/v1/healing-programs/${programId}/reservations`, { method: "POST", body: reservationData }),
};

// ---------------------------------------------------------------------------
// 8. Medicinal Plants & Reservations (/api/v1/medicinal-plants)
// ---------------------------------------------------------------------------
export const medicinalPlantsApi = {
  getAll: () => request("/api/v1/medicinal-plants"),
  getById: (id) => request(`/api/v1/medicinal-plants/${id}`),
  create: (data) => request("/api/v1/medicinal-plants", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/medicinal-plants/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/medicinal-plants/${id}`, { method: "DELETE" }),
  // Reservations
  getReservations: (plantId) => request(`/api/v1/medicinal-plants/${plantId}/reservations`),
  createReservation: (plantId, reservationData) =>
    request(`/api/v1/medicinal-plants/${plantId}/reservations`, { method: "POST", body: reservationData }),
};

// ---------------------------------------------------------------------------
// 9. Journeys & Reservations (/api/v1/journeys)
// ---------------------------------------------------------------------------
export const journeysApi = {
  getAll: () => request("/api/v1/journeys"),
  getById: (id) => request(`/api/v1/journeys/${id}`),
  create: (data) => request("/api/v1/journeys", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/journeys/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/journeys/${id}`, { method: "DELETE" }),
  // Reservations
  getReservations: (journeyId) => request(`/api/v1/journeys/${journeyId}/reservations`),
  createReservation: (journeyId, reservationData) =>
    request(`/api/v1/journeys/${journeyId}/reservations`, { method: "POST", body: reservationData }),
};

// ---------------------------------------------------------------------------
// 10. Events & Reservations (/api/v1/events)
// ---------------------------------------------------------------------------
export const eventsApi = {
  getAll: () => request("/api/v1/events"),
  getById: (id) => request(`/api/v1/events/${id}`),
  create: (data) => request("/api/v1/events", { method: "POST", body: data }),
  update: (id, data) => request(`/api/v1/events/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/events/${id}`, { method: "DELETE" }),
  // Reservations
  getReservations: (eventId) => request(`/api/v1/events/${eventId}/reservations`),
  createReservation: (eventId, reservationData) =>
    request(`/api/v1/events/${eventId}/reservations`, { method: "POST", body: reservationData }),
};

// ---------------------------------------------------------------------------
// 11. Blog Ecosystem (/api/v1/blog-topics & /api/v1/blogs)
// ---------------------------------------------------------------------------
export const blogTopicsApi = {
  getAll: () => request("/api/v1/blog-topics"),
  create: (data) => request("/api/v1/blog-topics", { method: "POST", body: data }),
};

export const blogsApi = {
  getAll: (topicId = null) => {
    const url = topicId ? `/api/v1/blogs?topicId=${encodeURIComponent(topicId)}` : "/api/v1/blogs";
    return request(url);
  },
  getById: (id) => request(`/api/v1/blogs/${id}`),
  create: (data, topicId = null) => {
    const url = topicId ? `/api/v1/blogs?topicId=${encodeURIComponent(topicId)}` : "/api/v1/blogs";
    return request(url, { method: "POST", body: data });
  },
  update: (id, data) => request(`/api/v1/blogs/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/api/v1/blogs/${id}`, { method: "DELETE" }),
  // Comments
  getComments: (blogId) => request(`/api/v1/blogs/${blogId}/comments`),
  createComment: (blogId, commentData) =>
    request(`/api/v1/blogs/${blogId}/comments`, { method: "POST", body: commentData }),
};

export { ApiError };
