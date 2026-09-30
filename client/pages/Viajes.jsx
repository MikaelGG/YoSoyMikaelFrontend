import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { journeysApi } from "@/lib/api";
import JourneyEditDialog from "@/components/JourneyEditDialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Viajes.webp";

export default function Viajes() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View reservations state
  const [isViewReservationsOpen, setIsViewReservationsOpen] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [allReservations, setAllReservations] = useState([]);

  // Traveler reservation state
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [reservationData, setReservationData] = useState({
    travelersFullName: "",
    travelersPhone: "",
    travelersMail: "",
    travelersAddress: "",
  });

  // Admin Add Journey state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState(null);
  const [journeyToDelete, setJourneyToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submittingJourney, setSubmittingJourney] = useState(false);
  const [newJourney, setNewJourney] = useState({
    journeyName: "",
    journeyDescription: "",
    journeyDate: "",
    journeyPrice: "",
    journeyImage: "",
  });

  const handleOpenDelete = (journey) => {
    setJourneyToDelete(journey);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!journeyToDelete) return;
    const jId = journeyToDelete.journeyId || journeyToDelete.id;
    try {
      setDeleting(true);
      await journeysApi.delete(jId);
      toast.success("¡Ruta de viaje y sus reservas eliminadas con éxito!");
      setIsDeleteDialogOpen(false);
      setJourneyToDelete(null);
      loadJourneys();
    } catch (err) {
      console.error("Error al eliminar viaje:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenViewReservations = async () => {
    setIsViewReservationsOpen(true);
    setLoadingReservations(true);
    try {
      let combined = [];
      for (const j of journeys) {
        const jId = j.journeyId || j.id;
        try {
          const res = await journeysApi.getReservations(jId);
          if (Array.isArray(res)) {
            const mapped = res.map((r) => ({
              ...r,
              journeyName: j.journeyName || `Viaje #${jId}`,
            }));
            combined = combined.concat(mapped);
          }
        } catch (e) {
          console.error(`Error cargando reservas de viaje ${jId}:`, e);
        }
      }
      setAllReservations(combined);
    } catch (err) {
      toast.error("Error al consultar reservas: " + err.message);
    } finally {
      setLoadingReservations(false);
    }
  };

  const loadJourneys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journeysApi.getAll();
      setJourneys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar viajes:", err);
      setError(err.message || "No se pudo conectar con el servidor de viajes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenReservation = (journey) => {
    setSelectedJourney(journey);
    setIsReserveOpen(true);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!selectedJourney) return;
    try {
      setSubmittingReservation(true);
      await journeysApi.createReservation(selectedJourney.journeyId, {
        travelersFullName: reservationData.travelersFullName.trim(),
        travelersPhone: reservationData.travelersPhone.trim(),
        travelersMail: reservationData.travelersMail.trim(),
        travelersAddress: reservationData.travelersAddress.trim(),
      });
      toast.success("¡Reserva confirmada con éxito para el viaje!");
      setIsReserveOpen(false);
      setReservationData({
        travelersFullName: "",
        travelersPhone: "",
        travelersMail: "",
        travelersAddress: "",
      });
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      toast.error(err.message || "Error al registrar la reserva del viaje.");
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleJourneyInputChange = (e) => {
    const { name, value } = e.target;
    setNewJourney((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJourney = async (e) => {
    e.preventDefault();
    try {
      setSubmittingJourney(true);
      const payload = {
        journeyName: newJourney.journeyName.trim(),
        journeyDescription: newJourney.journeyDescription.trim(),
        journeyDate: newJourney.journeyDate || null,
        journeyPrice: newJourney.journeyPrice ? parseFloat(newJourney.journeyPrice) : null,
        journeyImage: newJourney.journeyImage.trim() || null,
      };
      await journeysApi.create(payload);
      toast.success("¡Ruta de viaje registrada con éxito!");
      setIsAddModalOpen(false);
      setNewJourney({
        journeyName: "",
        journeyDescription: "",
        journeyDate: "",
        journeyPrice: "",
        journeyImage: "",
      });
      loadJourneys();
    } catch (err) {
      console.error("Error al crear viaje:", err);
      toast.error(err.message || "Error al registrar el viaje en el backend.");
    } finally {
      setSubmittingJourney(false);
    }
  };

  const handleScrollToViajes = () => {
    const el = document.getElementById("viajes-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. First Viewport (Hero centered on Mikael & Cosmic Portals) */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image exactly centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Viajes Iniciáticos y Portales Sagrados"
            className="h-full w-full object-cover object-[18%_6%] sm:object-[18%_4%] md:object-[20%_2%]"
            fetchpriority="high"
          />
          {/* Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/35" />
          <div className="absolute inset-0 bg-brand-blue/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Peregrinajes Sagrados
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Viajes Iniciáticos
            </h1>
            <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Rutas de despertar, memoria ancestral y reconexión en los vórtices y centros de poder de la Tierra.
            </p>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToViajes}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Explorar Rutas</span>
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
      {/* 2. Second Viewport (Infinite 3D Galaxy + Cards)      */}
      {/* ---------------------------------------------------- */}
      <section id="viajes-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
        {/* Infinite 3D Galaxy Canvas Background with Neon Lights & 3D Yantras */}
        <CosmicGalaxyBackground />
        {/* Seamless Blend from Hero */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-transparent pointer-events-none z-10" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-14 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d9008f] font-semibold">
                Expediciones de Luz
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Rutas &amp; Peregrinajes del Alma
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Experiencias inmersivas en templos, montañas sagradas y centros energéticos del planeta.
              </p>
            </div>

            {/* Admin Add Journey Button */}
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
                onClick={() => { setEditingJourney(null); setIsAddModalOpen(true); }}
                className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_25px_rgba(217,0,143,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-pink-400/40"
              >
                + Agregar Viaje
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando rutas sagradas...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadJourneys}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && journeys.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                🌍
              </div>
              <h3 className="text-xl font-bold text-white">No hay viajes programados en este momento</h3>
              <p className="mt-2 text-sm text-white/70">
                El calendario de expediciones sagradas está listo. Usa el botón superior para programar la primera ruta.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Registrar primera ruta
              </button>
            </div>
          )}

          {/* Journey Cards List (Full Width with Dedicated Detail Page Navigation) */}
          {!loading && !error && journeys.length > 0 && (
            <div className="flex flex-col gap-10 pt-12">
              {journeys.map((item) => {
                const formattedDate = item.journeyDate
                  ? new Date(item.journeyDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha por confirmar";

                const formattedPrice = item.journeyPrice
                  ? new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(item.journeyPrice)
                  : "Valor a consultar";

                return (
                  <div
                    key={item.journeyId}
                    className="group relative w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-900/70 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch"
                  >
                    {/* Left: Atmospheric Image Banner */}
                    <div className="relative aspect-[16/10] w-full lg:w-5/12 xl:w-1/2 overflow-hidden rounded-2xl bg-black/60 border border-white/10 shrink-0 shadow-lg">
                      <img
                        src={item.journeyImage || BG_IMAGE}
                        alt={item.journeyName}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-500/25 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                          📅 {formattedDate}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                          Aporte de Inversión
                        </span>
                        <span className="text-xl font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.5)]">
                          {formattedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Right: Essential Overview, Key Badges, and Navigation */}
                    <div className="flex flex-col justify-between flex-1 space-y-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-pink-400 animate-ping" />
                          <span className="text-xs font-semibold uppercase tracking-widest text-pink-300">
                            Expedición Sagrada
                          </span>
                        </div>

                        <Link to={`/iniciacion/viajes/${item.journeyId}`}>
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white hover:text-cyan-300 transition-colors">
                            {item.journeyName}
                          </h3>
                        </Link>

                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/80 line-clamp-3">
                          {item.journeyDescription}
                        </p>

                        {/* Highlights pills */}
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70">
                            🗺️ Rutas &amp; Traslados
                          </span>
                          <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70">
                            🏡 Eco-Lodges Sagrados
                          </span>
                          <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70">
                            ✨ Ceremonias &amp; Prácticas
                          </span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            to={`/iniciacion/viajes/${item.journeyId}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-ink shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105 active:scale-95"
                          >
                            <span>Ver Itinerario &amp; Detalles</span>
                            <span>→</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJourney(item);
                              setIsAddModalOpen(true);
                            }}
                            className="rounded-2xl border border-[#d9008f]/40 bg-[#d9008f]/15 hover:bg-[#d9008f]/30 text-pink-300 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenReservation(item)}
                          className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 hover:border-cyan-400 transition-all"
                        >
                          Reservar Cupo
                        </button>
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
      {/* 3. Modal: Reservar Cupo Viaje                        */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">🌍</span> Reserva tu Cupo de Viaje
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedJourney?.journeyName || "Completa tus datos para confirmar tu lugar en esta peregrinación sagrada."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReservation} className="space-y-4 py-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre Completo del Viajero *
              </label>
              <input
                type="text"
                name="travelersFullName"
                required
                value={reservationData.travelersFullName}
                onChange={handleReservationChange}
                placeholder="Ej. Juan Sebastián Pérez"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Teléfono de Contacto (WhatsApp) *
              </label>
              <input
                type="tel"
                name="travelersPhone"
                required
                value={reservationData.travelersPhone}
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
                name="travelersMail"
                required
                value={reservationData.travelersMail}
                onChange={handleReservationChange}
                placeholder="viajero@ejemplo.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Ciudad / País de Residencia *
              </label>
              <input
                type="text"
                name="travelersAddress"
                required
                value={reservationData.travelersAddress}
                onChange={handleReservationChange}
                placeholder="Ciudad / País"
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
                {submittingReservation ? "Confirmando..." : "Confirmar Cupo"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 4. Modal: Crear / Editar Viaje y Detalles            */}
      {/* ---------------------------------------------------- */}
      <JourneyEditDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        journey={editingJourney}
        onSuccess={() => loadJourneys()}
      />
    
      {/* Modal: Ver Reservas de Viajes */}
      <Dialog open={isViewReservationsOpen} onOpenChange={setIsViewReservationsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🌍 Reservas de Viajeros — Rutas Iniciáticas</span>
              <span className="text-xs text-cyan-400 font-semibold">({allReservations.length})</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60">
              Listado de personas inscritas a los retiros y peregrinajes sagrados.
            </DialogDescription>
          </DialogHeader>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Consultando base de datos...</p>
            </div>
          ) : allReservations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 my-4">
              <p className="text-base text-white/80 font-medium">Aún no hay reservas registradas para los viajes.</p>
              <p className="text-xs text-white/50 mt-1">Las solicitudes de viaje de los participantes aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-4 my-4">
              {allReservations.map((res, idx) => (
                <div
                  key={res.travelerId || res.id || idx}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:border-cyan-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{res.travelersFullName || "Viajero"}</span>
                      {res.journeyName && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {res.journeyName}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                      <span>📧 {res.travelersMail || "Sin correo"}</span>
                      <span>📞 {res.travelersPhone || "Sin teléfono"}</span>
                      {res.travelersAddress && <span>📍 {res.travelersAddress}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      ✓ Cupo Reservado
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

      {/* Modal: Confirmar Eliminación de Viaje (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación de Ruta
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{journeyToDelete?.journeyName}</strong>?
              Esta acción eliminará también en cascada todas las reservas asociadas a esta expedición.
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
