import { useState, useEffect } from "react";
import { medicinalPlantsApi } from "@/lib/api";
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

const BG_IMAGE = "/PlantasMedicinales.webp";

export default function PlantasMedicinales() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [newPlant, setNewPlant] = useState({
    medicinalName: "",
    medicinalImage: "",
    medicinalDescription: "",
    medicinalPrice: "",
    medicinalSpots: "",
  });

  // Patient Reservation Modal state
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isViewReservationsOpen, setIsViewReservationsOpen] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [reservationCounts, setReservationCounts] = useState({});
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleOpenViewReservations = async () => {
    setIsViewReservationsOpen(true);
    setLoadingReservations(true);
    try {
      let combined = [];
      for (const p of plants) {
        const pId = p.medicinalPlantId || p.medicinalId || p.id;
        try {
          const res = await medicinalPlantsApi.getReservations(pId);
          if (Array.isArray(res)) {
            const mapped = res.map((r) => ({
              ...r,
              plantName: p.medicinalName || `Medicina #${pId}`,
            }));
            combined = combined.concat(mapped);
          }
        } catch (e) {
          console.error(`Error cargando reservas de medicina ${pId}:`, e);
        }
      }
      setAllReservations(combined);
    } catch (err) {
      toast.error("Error al consultar reservas: " + err.message);
    } finally {
      setLoadingReservations(false);
    }
  };
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [reservationData, setReservationData] = useState({
    patientsFullName: "",
    patientsPhone: "",
    patientsMail: "",
    patientsAddress: "",
  });

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicinalPlantsApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setPlants(list);

      // Sincronizar conteo real de reservas desde la base de datos
      const counts = {};
      await Promise.all(
        list.map(async (p) => {
          const pId = p.medicinalPlantId || p.medicinalId || p.id;
          try {
            const res = await medicinalPlantsApi.getReservations(pId);
            counts[pId] = Array.isArray(res) ? res.length : 0;
          } catch (e) {
            counts[pId] = 0;
          }
        })
      );
      setReservationCounts(counts);
    } catch (err) {
      console.error("Error al cargar medicinas naturales:", err);
      setError(err.message || "No se pudo conectar con el servidor Spring Boot");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (plant) => {
    setPlantToDelete(plant);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!plantToDelete) return;
    const pId = plantToDelete.medicinalPlantId || plantToDelete.medicinalId || plantToDelete.id;
    try {
      setDeleting(true);
      await medicinalPlantsApi.delete(pId);
      toast.success("¡Medicina sagrada y sus reservas eliminadas con éxito!");
      setIsDeleteDialogOpen(false);
      setPlantToDelete(null);
      loadPlants();
    } catch (err) {
      console.error("Error al eliminar medicina:", err);
      toast.error("Error al eliminar medicina: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const handleScrollToMedicines = () => {
    const el = document.getElementById("medicinas-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin Handlers
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlant = async (e) => {
    e.preventDefault();
    if (!newPlant.medicinalName.trim()) {
      toast.error("Ingresa el nombre de la medicina o ceremonia");
      return;
    }

    try {
      setSubmittingAdmin(true);
      const payload = {
        medicinalName: newPlant.medicinalName,
        medicinalImage:
          newPlant.medicinalImage ||
          "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        medicinalDescription: newPlant.medicinalDescription,
        medicinalPrice: parseFloat(newPlant.medicinalPrice) || 0,
        medicinalSpots: parseInt(newPlant.medicinalSpots, 10) || 50,
      };

      await medicinalPlantsApi.create(payload);
      toast.success("¡Medicina registrada con éxito!");
      setNewPlant({
        medicinalName: "",
        medicinalImage: "",
        medicinalDescription: "",
        medicinalPrice: "",
        medicinalSpots: "",
      });
      setIsAddModalOpen(false);
      await loadPlants();
    } catch (err) {
      console.error("Error al registrar medicina:", err);
      toast.error("No se pudo registrar la medicina: " + err.message);
    } finally {
      setSubmittingAdmin(false);
    }
  };

  // Reservation Handlers
  const handleOpenReservation = (plant) => {
    setSelectedPlant(plant);
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
    if (!selectedPlant) return;

    try {
      setSubmittingReservation(true);
      const plantId = selectedPlant.medicinalPlantId || selectedPlant.medicinalId || selectedPlant.id;
      await medicinalPlantsApi.createReservation(plantId, reservationData);
      toast.success("¡Cupo reservado con éxito!", {
        description: `Te has inscrito a ${selectedPlant.medicinalName}. Te enviaremos las pautas de preparación sagrada.`,
      });
      setIsReservationModalOpen(false);
      await loadPlants();
    } catch (err) {
      console.error("Error al reservar cupo:", err);
      toast.error("No se pudo reservar el cupo: " + err.message);
    } finally {
      setSubmittingReservation(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      setLoading(true);
      const sample = {
        medicinalName: "Ceremonia de Yage",
        medicinalImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80",
        medicinalDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Encuentro ceremonial nocturno guiado por taitas tradicionales, con tomas sagradas, cantos de curación y purificación espiritual profunda.",
        medicinalPrice: 180000.0,
        medicinalSpots: 50,
      };
      await medicinalPlantsApi.create(sample);
      toast.success("¡Ceremonia de muestra creada en PostgreSQL!");
      await loadPlants();
    } catch (err) {
      toast.error("Error al crear ceremonia de muestra: " + err.message);
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
        {/* Background Image centered on Mikael, Shaman with glowing staff and jaguar */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Medicinas Naturales"
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
              Medicinas Naturales
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              El conocimiento ancestral de la naturaleza como fuente viva de sanación, memoria y despertar interior.
            </p>
          </div>
        </div>

        {/* Scroll button */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToMedicines}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d9008f] hover:bg-[#d9008f]/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Ver Medicinas</span>
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
      {/* 2. Medicines Section & Cards (3D Galaxy Background)  */}
      {/* ---------------------------------------------------- */}
      <section id="medicinas-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
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
                Sabiduría de la Selva
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Ceremonias y Plantas Sagradas
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
                + Agregar Medicina
              </button>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#d9008f] shadow-[0_0_20px_rgba(217,0,143,0.5)]" />
              <p className="text-white/80 text-sm tracking-widest uppercase font-mono">Conectando con la medicina ancestral...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mx-auto max-w-xl my-12 rounded-3xl border border-red-500/40 bg-red-950/60 p-8 text-center backdrop-blur-xl shadow-2xl">
              <h3 className="text-lg font-bold text-red-400">Error de conexión</h3>
              <p className="mt-2 text-sm text-white/80">{error}</p>
              <button
                onClick={loadPlants}
                className="mt-5 rounded-2xl bg-white/15 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && plants.length === 0 && (
            <div className="mx-auto my-12 max-w-xl rounded-[2.5rem] border border-white/20 bg-white/10 p-12 text-center backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9008f]/25 text-[#d9008f] shadow-[0_0_30px_rgba(217,0,143,0.4)]">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-2xl font-bold text-white">No hay medicinas registradas</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Registra una medicina sagrada o carga una ceremonia de prueba para visualizar la tarjeta con cupos.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3 text-sm font-semibold text-white shadow-lg transition"
                >
                  Agregar Medicina
                </button>
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-7 py-3 text-sm font-medium text-white transition"
                >
                  Cargar medicina de prueba
                </button>
              </div>
            </div>
          )}

          {/* Cards List matching Image 5 */}
          {!loading && !error && plants.length > 0 && (
            <div className="mt-12 space-y-20">
              {plants.map((item) => {
                const formattedPrice = item.medicinalPrice
                  ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
                      item.medicinalPrice
                    )
                  : "$ 000000";

                const pId = item.medicinalPlantId || item.medicinalId || item.id;
                const currentReserved = reservationCounts[pId] ?? 0;
                const totalSpots = item.medicinalSpots || 50;
                const spotsDisplay = `${currentReserved} / ${totalSpots}`;

                return (
                  <div
                    key={item.medicinalId}
                    className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-emerald-400/40"
                  >
                    {/* Title */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {item.medicinalName}
                      </h3>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Left Column: Image */}
                      <div className="relative aspect-[4/3] w-full max-w-[380px] mx-auto overflow-hidden rounded-[2rem] border border-white/25 bg-black/60 shadow-2xl">
                        <img
                          src={item.medicinalImage || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800"}
                          alt={item.medicinalName}
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      {/* Right Column: Info & Cupos */}
                      <div className="flex flex-col justify-center text-left space-y-5">
                        <p className="text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
                          {item.medicinalDescription}
                        </p>

                        <div className="space-y-1">
                          <span className="block text-xl font-bold text-white tracking-wide">{formattedPrice}</span>
                          <div className="text-sm text-white/80">
                            <span className="font-semibold text-white block">Cupos</span>
                            <span className="text-xs text-white/70 tracking-wider font-mono">{spotsDisplay}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenReservation(item)}
                            className="rounded-2xl bg-neutral-200 hover:bg-white text-neutral-900 px-7 py-3 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            Obtener cupo
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-5 py-3 text-sm font-bold transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Agregar Medicina (Admin)                   */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#d9008f]">🌿</span> Registrar Medicina o Ceremonia
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Registra una nueva planta o ceremonia medicinal para habilitar la reserva de cupos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlant} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre de la Medicina / Ceremonia
              </label>
              <input
                type="text"
                name="medicinalName"
                required
                value={newPlant.medicinalName}
                onChange={handleAdminInputChange}
                placeholder="Ej. Ceremonia de Yage"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Imagen
              </label>
              <input
                type="url"
                name="medicinalImage"
                value={newPlant.medicinalImage}
                onChange={handleAdminInputChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Descripción
              </label>
              <textarea
                name="medicinalDescription"
                required
                rows="3"
                value={newPlant.medicinalDescription}
                onChange={handleAdminInputChange}
                placeholder="Describe los beneficios, origen y propósito ceremonial..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  name="medicinalPrice"
                  value={newPlant.medicinalPrice}
                  onChange={handleAdminInputChange}
                  placeholder="Ej. 180000"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Cupos Totales
                </label>
                <input
                  type="number"
                  name="medicinalSpots"
                  value={newPlant.medicinalSpots}
                  onChange={handleAdminInputChange}
                  placeholder="Ej. 50"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>
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
                {submittingAdmin ? "Guardando..." : "Guardar Medicina"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 4. Modal: Obtener Cupo (Patient Reservation)         */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">🌿</span> Reserva de Cupo Medicinal
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedPlant?.medicinalName || "Ceremonia Ancestral"} — Ingresa tus datos para asegurar tu cupo.
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
                placeholder="Ej. Andrés Morales"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                placeholder="+57 320 555 6789"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                placeholder="andres@ejemplo.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                placeholder="Bogotá / Dirección"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                className="rounded-xl bg-neutral-200 hover:bg-white text-neutral-900 px-6 py-2.5 text-sm font-semibold shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submittingReservation ? "Reservando..." : "Confirmar Cupo"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    
      {/* Modal: Ver Reservas de Plantas Medicinales */}
      <Dialog open={isViewReservationsOpen} onOpenChange={setIsViewReservationsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🌿 Reservas de Cupos — Medicinas Naturales</span>
              <span className="text-xs text-cyan-400 font-semibold">({allReservations.length})</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60">
              Listado de personas inscritas a las medicinas sagradas.
            </DialogDescription>
          </DialogHeader>

          {loadingReservations ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs text-white/60 uppercase tracking-widest">Consultando base de datos...</p>
            </div>
          ) : allReservations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 my-4">
              <p className="text-base text-white/80 font-medium">Aún no hay reservas registradas para las medicinas.</p>
              <p className="text-xs text-white/50 mt-1">Los cupos reservados aparecerán aquí en tiempo real.</p>
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
                      <span className="text-sm font-bold text-white">{res.patientsFullName || "Participante"}</span>
                      {res.plantName && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {res.plantName}
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
                      ✓ Cupo Asignado
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
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{plantToDelete?.medicinalName}</strong>?
              Esta acción eliminará también en cascada todas las reservas asociadas a esta medicina sagrada.
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
