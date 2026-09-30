import { useState, useEffect } from "react";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { eventsApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Eventos.webp";

const DEFAULT_EVENT_TAGS = ["Encuentro Presencial", "Cupos Limitados"];

const DEFAULT_EVENT_HIGHLIGHTS = [
  { icon: "📍", text: "Centro Holístico Sagrado / Locación Confirmada" },
  { icon: "✨", text: "Ceremonia Vivencial & Alineación Cósmica" },
  { icon: "🧘", text: "Meditación & Respiración Consciente" },
  { icon: "🍵", text: "Alimentación Consciente & Material Incluido" },
];

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reservation dialog state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [reservationData, setReservationData] = useState({
    reservatorFullName: "",
    reservatorPhone: "",
    reservatorMail: "",
    reservatorAddress: "",
  });

  // View reservations state
  const [isViewReservationsOpen, setIsViewReservationsOpen] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [allReservations, setAllReservations] = useState([]);

  // Admin Add/Edit Event Modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [modalTab, setModalTab] = useState("basico");
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form fields
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [tags, setTags] = useState(DEFAULT_EVENT_TAGS);
  const [highlights, setHighlights] = useState(DEFAULT_EVENT_HIGHLIGHTS);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsApi.getAll();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar eventos:", err);
      setError(err.message || "No se pudo conectar con el servidor de eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenDelete = (ev) => {
    setEventToDelete(ev);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    const evId = eventToDelete.eventId || eventToDelete.id;
    try {
      setDeleting(true);
      await eventsApi.delete(evId);
      toast.success("¡Evento sagrado y sus reservas eliminados con éxito!");
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      loadEvents();
    } catch (err) {
      console.error("Error al eliminar evento:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventDescription("");
    setEventDate("");
    setEventPrice("");
    setEventImage("");
    setTags(DEFAULT_EVENT_TAGS);
    setHighlights(DEFAULT_EVENT_HIGHLIGHTS);
    setModalTab("basico");
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventDescription(ev.eventDescription || "");
    setEventDate(ev.eventDate || "");
    setEventPrice(ev.eventPrice ? String(ev.eventPrice) : "");
    setEventImage(ev.eventImage || "");

    let parsedDetails = {};
    if (ev.eventDetails) {
      try {
        parsedDetails = typeof ev.eventDetails === "string" ? JSON.parse(ev.eventDetails) : ev.eventDetails;
      } catch (e) {
        console.error("Error parsing eventDetails:", e);
      }
    }

    setTags(
      Array.isArray(parsedDetails.tags) && parsedDetails.tags.length > 0
        ? parsedDetails.tags
        : DEFAULT_EVENT_TAGS
    );

    setHighlights(
      Array.isArray(parsedDetails.highlights) && parsedDetails.highlights.length > 0
        ? parsedDetails.highlights
        : DEFAULT_EVENT_HIGHLIGHTS
    );

    setModalTab("basico");
    setIsEventModalOpen(true);
  };

  // Tag list handlers
  const handleAddTag = () => {
    setTags((prev) => [...prev, "Nueva Etiqueta"]);
  };

  const handleUpdateTag = (idx, val) => {
    setTags((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleRemoveTag = (idx) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, { icon: "✨", text: "Nueva información o actividad..." }]);
  };

  const handleUpdateHighlight = (idx, field, val) => {
    setHighlights((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleRemoveHighlight = (idx) => {
    setHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      setSubmittingEvent(true);
      const detailsObj = {
        tags: tags.filter((t) => Boolean(t && t.trim())),
        highlights: highlights.filter((h) => Boolean(h.text && h.text.trim())),
      };

      const payload = {
        eventDescription: eventDescription.trim(),
        eventDate: eventDate || null,
        eventPrice: eventPrice ? parseFloat(eventPrice) : null,
        eventImage: eventImage.trim() || null,
        eventDetails: JSON.stringify(detailsObj),
      };

      if (editingEvent) {
        const id = editingEvent.eventId || editingEvent.id;
        await eventsApi.update(id, payload);
        toast.success("¡Evento actualizado con éxito en la base de datos!");
      } else {
        await eventsApi.create(payload);
        toast.success("¡Evento sagrado registrado con éxito en la base de datos!");
      }

      setIsEventModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error("Error al guardar evento:", err);
      toast.error(err.message || "Error al registrar el evento en el backend.");
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Reservation handlers
  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenReservation = (event) => {
    setSelectedEvent(event);
    setIsReserveOpen(true);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    try {
      setSubmittingReservation(true);
      const eventId = selectedEvent.eventId || selectedEvent.id;
      await eventsApi.createReservation(eventId, {
        reservatorFullName: reservationData.reservatorFullName.trim(),
        reservatorPhone: reservationData.reservatorPhone.trim(),
        reservatorMail: reservationData.reservatorMail.trim(),
        reservatorAddress: reservationData.reservatorAddress.trim(),
      });
      toast.success("¡Reserva confirmada con éxito para el evento!");
      setIsReserveOpen(false);
      setReservationData({
        reservatorFullName: "",
        reservatorPhone: "",
        reservatorMail: "",
        reservatorAddress: "",
      });
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      toast.error(err.message || "Error al procesar la reserva.");
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleOpenViewReservations = async () => {
    setIsViewReservationsOpen(true);
    setLoadingReservations(true);
    try {
      let combined = [];
      for (const ev of events) {
        const evId = ev.eventId || ev.id;
        try {
          const res = await eventsApi.getReservations(evId);
          if (Array.isArray(res)) {
            const mapped = res.map((r) => ({
              ...r,
              eventDescription: ev.eventDescription?.slice(0, 50) + "..." || `Evento #${evId}`,
            }));
            combined = combined.concat(mapped);
          }
        } catch (e) {
          console.error(`Error cargando reservas de evento ${evId}:`, e);
        }
      }
      setAllReservations(combined);
    } catch (err) {
      toast.error("Error al consultar reservas: " + err.message);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleScrollToEventos = () => {
    const el = document.getElementById("eventos-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. First Viewport (Hero centered on Mikael & Gathering) */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Eventos y Encuentros Sagrados"
            className="h-full w-full object-cover object-[38%_12%] sm:object-[38%_10%] md:object-[40%_8%]"
            fetchpriority="high"
          />
          {/* Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/20" />
          <div className="absolute inset-0 bg-brand-blue/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title & Message */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-md">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              Encuentros &amp; Retiros
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Eventos Sagrados
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Encuentros vivenciales, ceremonias y espacios presenciales donde la presencia se comparte y el tejido humano se despierta al unísono.
            </p>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToEventos}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Ver Eventos</span>
            <svg
              className="h-4 w-4 animate-bounce text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. Second Viewport (Infinite 3D Galaxy + Events)     */}
      {/* ---------------------------------------------------- */}
      <section id="eventos-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
        <CosmicGalaxyBackground />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-transparent pointer-events-none z-10" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-14 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d9008f] font-semibold">
                Experiencias Vivas
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Próximos Encuentros &amp; Ceremonias
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Espacios de comunión y transformación. Reserva tu lugar con anticipación.
              </p>
            </div>

            {/* Actions: Ver Reservas + Agregar Evento */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenViewReservations}
                className="rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 px-6 py-3.5 text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Ver reservas
              </button>
              <button
                type="button"
                onClick={handleOpenAddEvent}
                className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_25px_rgba(217,0,143,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-pink-400/40"
              >
                + Agregar Evento
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando eventos sagrados...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadEvents}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                ✨
              </div>
              <h3 className="text-xl font-bold text-white">No hay eventos activos en este momento</h3>
              <p className="mt-2 text-sm text-white/70">
                La agenda de encuentros está lista. Usa el botón superior para programar una nueva ceremonia.
              </p>
              <button
                onClick={handleOpenAddEvent}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Crear primer evento
              </button>
            </div>
          )}

          {/* Events List (Full-Width Responsive Horizontal Cards) */}
          {!loading && !error && events.length > 0 && (
            <div className="flex flex-col gap-10 pt-12">
              {events.map((event) => {
                const formattedDate = event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha por confirmar";

                const formattedPrice = event.eventPrice
                  ? new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(event.eventPrice)
                  : "Aporte Voluntario / Libre";

                // Parse eventDetails
                let details = {};
                if (event.eventDetails) {
                  try {
                    details = typeof event.eventDetails === "string"
                      ? JSON.parse(event.eventDetails)
                      : event.eventDetails;
                  } catch (e) {
                    console.error("Error parsing eventDetails:", e);
                  }
                }

                const eventTags = Array.isArray(details.tags) && details.tags.length > 0
                  ? details.tags
                  : DEFAULT_EVENT_TAGS;

                const eventHighlights = Array.isArray(details.highlights) && details.highlights.length > 0
                  ? details.highlights
                  : DEFAULT_EVENT_HIGHLIGHTS;

                return (
                  <div
                    key={event.eventId}
                    className="group relative flex flex-col lg:flex-row items-stretch overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/60 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,229,255,0.2)]"
                  >
                    {/* Left: Wide Aspect Image Container */}
                    <div className="relative w-full lg:w-2/5 min-h-[260px] sm:min-h-[300px] lg:min-h-full overflow-hidden bg-black/60 border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                      <img
                        src={event.eventImage || BG_IMAGE}
                        alt={event.eventDescription || "Evento Sagrado"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />
                      {/* Date badge */}
                      <span className="absolute top-4 left-4 rounded-xl bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-lg capitalize">
                        🗓️ {formattedDate}
                      </span>
                    </div>

                    {/* Right: Rich Event Details */}
                    <div className="flex flex-col justify-between p-7 lg:p-10 flex-1">
                      <div>
                        {/* Dynamic Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {eventTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                                idx % 2 === 0
                                  ? "text-[#d9008f] bg-pink-500/10 border-pink-500/30"
                                  : "text-cyan-300 bg-cyan-500/10 border-cyan-400/30"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {event.eventDescription}
                        </h3>

                        {/* Dynamic Highlights */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                          {eventHighlights.map((hl, idx) => (
                            <div key={idx} className="flex items-center gap-2.5">
                              <span className="text-cyan-400 text-base">{hl.icon || "✨"}</span>
                              <span>{hl.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                          <span className="block text-xs uppercase tracking-widest text-white/50 mb-1">Inversión / Aporte</span>
                          <span className="text-2xl font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                            {formattedPrice}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvent(event)}
                            className="rounded-2xl border border-[#d9008f]/40 bg-[#d9008f]/15 hover:bg-[#d9008f]/30 text-pink-300 px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all"
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReservation(event)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-ink shadow-[0_0_25px_rgba(0,229,255,0.3)] transition hover:brightness-110 hover:scale-105 active:scale-95"
                          >
                            <span>Reservar Lugar</span>
                            <span>🌟</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(event)}
                            className="rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. Modal: Reservar Asistencia a Evento               */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">🌟</span> Reservar Lugar
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedEvent ? (
                <span>
                  Confirmando asistencia a: <strong className="text-cyan-300">{selectedEvent.eventDescription}</strong>
                </span>
              ) : (
                "Ingresa tus datos de contacto para asegurar tu cupo."
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReservation} className="space-y-4 py-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="reservatorFullName"
                required
                value={reservationData.reservatorFullName}
                onChange={handleReservationChange}
                placeholder="Ej. Camila Torres"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Teléfono de Contacto (WhatsApp) *
              </label>
              <input
                type="tel"
                name="reservatorPhone"
                required
                value={reservationData.reservatorPhone}
                onChange={handleReservationChange}
                placeholder="+57 300 123 4567"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="reservatorMail"
                required
                value={reservationData.reservatorMail}
                onChange={handleReservationChange}
                placeholder="tuemail@ejemplo.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Ciudad / Dirección *
              </label>
              <input
                type="text"
                name="reservatorAddress"
                required
                value={reservationData.reservatorAddress}
                onChange={handleReservationChange}
                placeholder="Ciudad / Lugar de residencia"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setIsReserveOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submittingReservation}
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-lg transition disabled:opacity-50"
              >
                {submittingReservation ? "Confirmando..." : "Confirmar Reserva"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 4. Modal: Crear / Editar Evento (Admin)              */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#d9008f]">✨</span>
              <span>{editingEvent ? "Editar Evento Sagrado" : "Programar Nuevo Evento"}</span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Personaliza el encuentro, fecha, etiquetas descriptivas y puntos clave de información.
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 pt-2">
            {[
              { id: "basico", label: "📋 Información Básica" },
              { id: "etiquetas", label: "🏷️ Etiquetas (Tags)" },
              { id: "puntos", label: "✨ Puntos Clave Sagrados" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModalTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  modalTab === tab.id
                    ? "bg-cyan-500 text-brand-ink shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveEvent} className="space-y-4 py-3">
            {modalTab === "basico" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Descripción / Título del Evento *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Ej. Ceremonia de Luna Llena: Activación del Portal Cuántico..."
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                      Fecha del Evento *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white focus:border-[#d9008f] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                      Valor / Aporte (COP)
                    </label>
                    <input
                      type="number"
                      value={eventPrice}
                      onChange={(e) => setEventPrice(e.target.value)}
                      placeholder="Ej. 150000"
                      className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    URL de Imagen Ilustrativa
                  </label>
                  <input
                    type="url"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    placeholder="https://.../evento.jpg"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {modalTab === "etiquetas" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/70">
                    Etiquetas que se muestran en la cabecera de la tarjeta:
                  </p>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 px-3.5 py-1 text-xs font-bold transition"
                  >
                    + Agregar Etiqueta
                  </button>
                </div>

                <div className="space-y-2">
                  {tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleUpdateTag(idx, e.target.value)}
                        placeholder="Ej. Encuentro Presencial"
                        className="flex-1 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                      {tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="text-xs text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalTab === "puntos" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/70">
                    Puntos de información sagrada (Icono + Descripción):
                  </p>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 px-3.5 py-1 text-xs font-bold transition"
                  >
                    + Agregar Punto Clave
                  </button>
                </div>

                <div className="space-y-3">
                  {highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl.icon}
                        onChange={(e) => handleUpdateHighlight(idx, "icon", e.target.value)}
                        placeholder="Icono"
                        className="w-14 text-center rounded-xl bg-white/10 border border-white/15 px-2 py-2 text-base text-white focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={hl.text}
                        onChange={(e) => handleUpdateHighlight(idx, "text", e.target.value)}
                        placeholder="Descripción del punto clave..."
                        className="flex-1 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      />
                      {highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-xs text-red-400 hover:text-red-300 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="pt-5 border-t border-white/10 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submittingEvent}
                className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition disabled:opacity-50"
              >
                {submittingEvent ? "Guardando en BD..." : editingEvent ? "Guardar Cambios" : "Guardar Evento"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 5. Modal: Ver Reservas de Eventos (Admin)            */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isViewReservationsOpen} onOpenChange={setIsViewReservationsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🎟️ Reservas de Asistentes — Eventos Sagrados</span>
              <span className="text-xs text-cyan-400 font-semibold">({allReservations.length})</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60">
              Listado de personas inscritas a los encuentros presenciales y ceremonias.
            </DialogDescription>
          </DialogHeader>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Consultando base de datos...</p>
            </div>
          ) : allReservations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 my-4">
              <p className="text-base text-white/80 font-medium">Aún no hay reservas registradas para los eventos.</p>
              <p className="text-xs text-white/50 mt-1">Los registros de los asistentes aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-4 my-4">
              {allReservations.map((res, idx) => (
                <div
                  key={res.attendanceId || res.id || idx}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:border-cyan-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{res.reservatorFullName || "Asistente"}</span>
                      {res.eventDescription && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {res.eventDescription}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                      <span>📧 {res.reservatorMail || "Sin correo"}</span>
                      <span>📞 {res.reservatorPhone || "Sin teléfono"}</span>
                      {res.reservatorAddress && <span>📍 {res.reservatorAddress}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      ✓ Cupo Confirmado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setIsViewReservationsOpen(false)}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar este evento?
              Esta acción eliminará también en cascada todas las reservas y registros de asistentes asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="rounded-xl bg-red-600 hover:bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition disabled:opacity-50"
            >
              {deleting ? "Eliminando..." : "Eliminar Definitivamente"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
