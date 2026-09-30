import { useState, useEffect } from "react";
import { healingProgramsApi } from "@/lib/api";
import { toast } from "sonner";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/ProgSanacion.webp";

export default function ProgramasSanacion() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [newProgram, setNewProgram] = useState({
    healingImage: "",
    healingDescription: "",
  });

  // Patient Reservation Modal state
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isViewReservationsOpen, setIsViewReservationsOpen] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleOpenViewReservations = async () => {
    setIsViewReservationsOpen(true);
    setLoadingReservations(true);
    try {
      let combined = [];
      for (const p of programs) {
        const pId = p.healingProgramId || p.healingId || p.id;
        try {
          const res = await healingProgramsApi.getReservations(pId);
          if (Array.isArray(res)) {
            const mapped = res.map((r) => ({
              ...r,
              programTitle: p.healingDescription?.slice(0, 45) + "..." || `Programa #${pId}`,
            }));
            combined = combined.concat(mapped);
          }
        } catch (e) {
          console.error(`Error cargando reservas de programa ${pId}:`, e);
        }
      }
      setAllReservations(combined);
    } catch (err) {
      toast.error("Error al consultar reservas: " + err.message);
    } finally {
      setLoadingReservations(false);
    }
  };
  const handleOpenDelete = (prog) => {
    setProgramToDelete(prog);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;
    const pId = programToDelete.healingProgramId || programToDelete.healingId || programToDelete.id;
    try {
      setDeleting(true);
      await healingProgramsApi.delete(pId);
      toast.success("¡Programa de sanación y sus citas eliminados con éxito!");
      setIsDeleteDialogOpen(false);
      setProgramToDelete(null);
      loadPrograms();
    } catch (err) {
      console.error("Error al eliminar programa:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [reservationData, setReservationData] = useState({
    patientsFullName: "",
    patientsPhone: "",
    patientsMail: "",
    patientsAddress: "",
  });

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healingProgramsApi.getAll();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar programas de sanación:", err);
      setError(err.message || "No se pudo conectar con el servidor Spring Boot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleScrollToPrograms = () => {
    const el = document.getElementById("programas-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin Form Handlers
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.healingDescription.trim()) {
      toast.error("Ingresa la descripción del programa");
      return;
    }

    try {
      setSubmittingAdmin(true);
      const payload = {
        healingImage:
          newProgram.healingImage ||
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        healingDescription: newProgram.healingDescription,
      };

      await healingProgramsApi.create(payload);
      toast.success("¡Programa de sanación registrado con éxito!");
      setNewProgram({ healingImage: "", healingDescription: "" });
      setIsAddModalOpen(false);
      await loadPrograms();
    } catch (err) {
      console.error("Error al crear programa:", err);
      toast.error("No se pudo crear el programa: " + err.message);
    } finally {
      setSubmittingAdmin(false);
    }
  };

  // Reservation Modal Handlers
  const handleOpenReservation = (program) => {
    setSelectedProgram(program);
    setReservationData({
      patientsFullName: "",
      patientsPhone: "",
      patientsMail: "",
      patientsAddress: "",
    });
    setIsReservationModalOpen(true);
  };

  const handleReservationInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!selectedProgram) return;

    try {
      setSubmittingReservation(true);
      const programId = selectedProgram.healingProgramId || selectedProgram.healingId || selectedProgram.id;
      await healingProgramsApi.createReservation(programId, reservationData);
      toast.success("¡Cita agendada con éxito!", {
        description: "Nos comunicaremos contigo para coordinar tu sesión de sanación.",
      });
      setIsReservationModalOpen(false);
    } catch (err) {
      console.error("Error al agendar cita:", err);
      toast.error("No se pudo agendar la cita: " + err.message);
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      setLoading(true);
      const sample = {
        healingImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        healingDescription:
          "Sanación energética Reiki - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Restauración del campo electromagnético, alineación de chakras y liberación de bloqueos emocionales profundos.",
      };
      await healingProgramsApi.create(sample);
      toast.success("¡Programa de muestra creado en PostgreSQL!");
      await loadPrograms();
    } catch (err) {
      toast.error("Error al crear programa de muestra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. Hero Section (Exact Centered Image)               */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image exactly centered on the 7 chakras and healing symbols */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Programas de Sanación"
            className="h-full w-full object-cover object-[center_16%] md:object-[center_14%]"
            fetchpriority="high"
          />
          {/* Rich Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/35" />
          <div className="absolute inset-0 bg-brand-blue/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-2xl backdrop-blur-[2px] rounded-3xl p-4">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-amber-300 drop-shadow">
              Camino al SER
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Programas de sanación
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Procesos de limpieza, equilibrio y restauración energética para el cuerpo, la mente y los centros del alma.
            </p>
          </div>
        </div>

        {/* Scroll button */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToPrograms}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d9008f] hover:bg-[#d9008f]/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Ver Programas</span>
            <svg
              className="h-4 w-4 animate-bounce text-[#d9008f]"
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
      {/* 2. Programs Cards Section (3D Galaxy Background)     */}
      {/* ---------------------------------------------------- */}
      <section id="programas-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
        {/* Infinite 3D Galaxy Canvas Background with Neon Lights */}
        <CosmicGalaxyBackground />
        {/* Seamless Blend from Hero */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-transparent pointer-events-none z-10" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-14 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d9008f] font-semibold">
                Terapia Cuántica & Reiki
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Programas Disponibles
              </h2>
            </div>
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
                onClick={() => setIsAddModalOpen(true)}
                className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_25px_rgba(217,0,143,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-pink-400/40"
              >
                + Agregar programa
              </button>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#d9008f] shadow-[0_0_20px_rgba(217,0,143,0.5)]" />
              <p className="text-white/80 text-sm tracking-widest uppercase font-mono">Sintonizando terapias de sanación...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mx-auto max-w-xl my-12 rounded-3xl border border-red-500/40 bg-red-950/60 p-8 text-center backdrop-blur-xl shadow-2xl">
              <h3 className="text-lg font-bold text-red-400">Error de conexión</h3>
              <p className="mt-2 text-sm text-white/80">{error}</p>
              <button
                onClick={loadPrograms}
                className="mt-5 rounded-2xl bg-white/15 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && programs.length === 0 && (
            <div className="mx-auto my-12 max-w-xl rounded-[2.5rem] border border-white/20 bg-white/10 p-12 text-center backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9008f]/25 text-[#d9008f] shadow-[0_0_30px_rgba(217,0,143,0.4)]">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-white">No hay programas registrados</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Crea tu primer programa de sanación o carga el ejemplo para visualizar la tarjeta con agendamiento.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3 text-sm font-semibold text-white shadow-lg transition"
                >
                  Agregar programa
                </button>
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-7 py-3 text-sm font-medium text-white transition"
                >
                  Cargar programa de prueba
                </button>
              </div>
            </div>
          )}

          {/* Cards List matching Image 4 */}
          {!loading && !error && programs.length > 0 && (
            <div className="mt-12 space-y-20">
              {programs.map((item) => {
                const lines = item.healingDescription?.split("-") || [];
                const cardTitle = lines.length > 1 ? lines[0].trim() : "Sanación energética Reiki";
                const cardBody = lines.length > 1 ? lines.slice(1).join("-").trim() : item.healingDescription;

                return (
                  <div
                    key={item.healingId}
                    className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-blue-400/40"
                  >
                    {/* Title */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {cardTitle}
                      </h3>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Left Column: Image */}
                      <div className="relative aspect-square w-full max-w-[360px] mx-auto overflow-hidden rounded-[2rem] border border-white/25 bg-black/60 shadow-2xl">
                        <img
                          src={item.healingImage || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"}
                          alt={cardTitle}
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      {/* Right Column: Text & Agendar Cita */}
                      <div className="flex flex-col justify-center text-left space-y-6">
                        <p className="text-base sm:text-lg leading-relaxed text-white/90 drop-shadow">
                          {cardBody}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenReservation(item)}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-800 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(29,78,216,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/30"
                          >
                            <span>Agendar cita</span>
                            <span className="text-amber-300 text-base">🌟</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="rounded-full border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-5 py-3.5 text-sm font-bold transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Agregar Programa (Admin)                   */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#d9008f]">✨</span> Nuevo Programa de Sanación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Registra una terapia o programa para que los consultantes puedan agendar su cita.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProgram} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Imagen Ilustrativa
              </label>
              <input
                type="url"
                name="healingImage"
                value={newProgram.healingImage}
                onChange={handleAdminInputChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Título y Descripción del Programa
              </label>
              <textarea
                name="healingDescription"
                required
                rows="4"
                value={newProgram.healingDescription}
                onChange={handleAdminInputChange}
                placeholder="Ej. Sanación energética Reiki - Proceso de equilibrio y restauración de los centros sutiles..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submittingAdmin}
                className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submittingAdmin ? "Guardando..." : "Guardar Programa"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 4. Modal: Agendar Cita (Patient Reservation)         */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-300">🌟</span> Agendar Sesión de Sanación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Ingresa tus datos personales para coordinar el horario de tu sesión.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReservation} className="space-y-4 py-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre Completo
              </label>
              <input
                type="text"
                name="patientsFullName"
                required
                value={reservationData.patientsFullName}
                onChange={handleReservationInputChange}
                placeholder="Ej. Laura Gómez"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                name="patientsPhone"
                required
                value={reservationData.patientsPhone}
                onChange={handleReservationInputChange}
                placeholder="+57 310 123 4567"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="patientsMail"
                required
                value={reservationData.patientsMail}
                onChange={handleReservationInputChange}
                placeholder="laura@ejemplo.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Ciudad o Dirección
              </label>
              <input
                type="text"
                name="patientsAddress"
                required
                value={reservationData.patientsAddress}
                onChange={handleReservationInputChange}
                placeholder="Medellín / Dirección"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setIsReservationModalOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submittingReservation}
                className="rounded-xl bg-blue-700 hover:bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submittingReservation ? "Agendando..." : "Confirmar Cita"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    
      {/* Modal: Ver Reservas de Programas de Sanación */}
      <Dialog open={isViewReservationsOpen} onOpenChange={setIsViewReservationsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📋 Reservas de Citas — Programas de Sanación</span>
              <span className="text-xs text-cyan-400 font-semibold">({allReservations.length})</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60">
              Listado de pacientes y citas agendadas desde la plataforma.
            </DialogDescription>
          </DialogHeader>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Consultando base de datos...</p>
            </div>
          ) : allReservations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 my-4">
              <p className="text-base text-white/80 font-medium">Aún no hay reservas registradas para los programas.</p>
              <p className="text-xs text-white/50 mt-1">Las citas agendadas por los usuarios aparecerán aquí en tiempo real.</p>
            </div>
          ) : (
            <div className="space-y-4 my-4">
              {allReservations.map((res, idx) => (
                <div
                  key={res.patientId || res.id || idx}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:border-cyan-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{res.patientsFullName || "Paciente"}</span>
                      {res.programTitle && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {res.programTitle}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/70">
                      <span>📧 {res.patientsMail || "Sin correo"}</span>
                      <span>📞 {res.patientsPhone || "Sin teléfono"}</span>
                      {res.patientsAddress && <span>📍 {res.patientsAddress}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      ✓ Confirmada
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

      {/* Modal: Confirmar Eliminación de Programa (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación de Programa
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar este programa de sanación?
              Esta acción eliminará también en cascada todas las citas y reservas de pacientes asociadas.
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
