import { useState, useEffect } from "react";
import { liveClassesApi } from "@/lib/api";
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

const BG_IMAGE = "/ClasesVivo.webp";

export default function ClasesEnVivo() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newLive, setNewLive] = useState({
    liveName: "",
    liveUrl: "",
  });

  const handleOpenDelete = (live) => {
    setClassToDelete(live);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    const cId = classToDelete.liveId || classToDelete.id;
    try {
      setDeleting(true);
      await liveClassesApi.delete(cId);
      toast.success("¡Clase en vivo eliminada con éxito!");
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
      loadClasses();
    } catch (err) {
      console.error("Error al eliminar clase:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await liveClassesApi.getAll();
      setLiveClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar clases en vivo:", err);
      setError(err.message || "No se pudo conectar con el servidor Spring Boot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleScrollToLives = () => {
    const el = document.getElementById("lives-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLive((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateLive = async (e) => {
    e.preventDefault();
    if (!newLive.liveName.trim()) {
      toast.error("Ingresa el título de la clase");
      return;
    }

    try {
      setSubmitting(true);
      await liveClassesApi.create(newLive);
      toast.success("¡Clase en vivo registrada con éxito!", {
        description: newLive.liveName,
      });
      setNewLive({ liveName: "", liveUrl: "" });
      setIsAddModalOpen(false);
      await loadClasses();
    } catch (err) {
      console.error("Error al registrar clase:", err);
      toast.error("No se pudo crear la clase: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSampleLive = async () => {
    try {
      setLoading(true);
      const sample = {
        liveName: "Fundamentos de nuestra sabiduría",
        liveUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      };
      await liveClassesApi.create(sample);
      toast.success("¡Clase de demostración creada en la base de datos!");
      await loadClasses();
    } catch (err) {
      toast.error("Error al crear clase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("embed/")) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. First Viewport (Hero with Exact Centered Image)   */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image exactly centered on the focal scene */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Clases en Vivo - Akasha"
            className="h-full w-full object-cover object-[center_14%] md:object-[center_12%]"
            fetchpriority="high"
          />
          {/* Rich Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/35" />
          <div className="absolute inset-0 bg-brand-blue/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title & Header */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-2xl backdrop-blur-[2px] rounded-3xl p-4">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-amber-300 drop-shadow">
              Camino al SER
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Clases en vivo
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Espacios de encuentro y aprendizaje, con presencia, profundidad y movimiento en tiempo real desde el portal Akasha.
            </p>
          </div>
        </div>

        {/* Scroll down prompt at bottom of first viewport */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToLives}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d9008f] hover:bg-[#d9008f]/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Ver Clases en Vivo</span>
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
      {/* 2. Second Viewport (Infinite 3D Galaxy Background)   */}
      {/* ---------------------------------------------------- */}
      <section id="lives-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
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
                Transmisiones Cósmicas
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Salas de Transmisión
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_25px_rgba(217,0,143,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-pink-400/40"
            >
              Agregar Live
            </button>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#d9008f] shadow-[0_0_20px_rgba(217,0,143,0.5)]" />
              <p className="text-white/80 text-sm tracking-widest uppercase font-mono">Conectando con la sala cuántica...</p>
            </div>
          )}

          {/* Error Alert */}
          {error && !loading && (
            <div className="mx-auto max-w-xl my-12 rounded-3xl border border-red-500/40 bg-red-950/60 p-8 text-center backdrop-blur-xl shadow-2xl">
              <h3 className="text-lg font-bold text-red-400">Error de conexión</h3>
              <p className="mt-2 text-sm text-white/80">{error}</p>
              <button
                onClick={loadClasses}
                className="mt-5 rounded-2xl bg-white/15 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && liveClasses.length === 0 && (
            <div className="mx-auto my-12 max-w-xl rounded-[2.5rem] border border-white/20 bg-white/10 p-12 text-center backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9008f]/25 text-[#d9008f] shadow-[0_0_30px_rgba(217,0,143,0.4)]">
                <span className="text-3xl">🔴</span>
              </div>
              <h3 className="text-2xl font-bold text-white">No hay transmisiones activas</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Actualmente no hay ninguna transmisión en directo programada. Puedes programar la primera ahora mismo.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3 text-sm font-semibold text-white shadow-lg transition"
                >
                  Agregar Live
                </button>
                <button
                  type="button"
                  onClick={handleCreateSampleLive}
                  className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-7 py-3 text-sm font-medium text-white transition"
                >
                  Cargar clase de prueba
                </button>
              </div>
            </div>
          )}

          {/* Live Classes Cards List */}
          {!loading && !error && liveClasses.length > 0 && (
            <div className="mt-12 space-y-20">
              {liveClasses.map((item) => {
                const embedUrl = getEmbedUrl(item.liveUrl);
                return (
                  <div
                    key={item.liveId}
                    className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-pink-400/40"
                  >
                    {/* Card Title */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {item.liveName}
                      </h3>
                    </div>

                    {/* Video / Stream Container */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/20 bg-black/70 shadow-2xl">
                      {/* Pulsing Red LIVE Badge at Top Right */}
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.7)] border border-red-400/50">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                        </span>
                        <span className="text-xs font-black tracking-wider text-white uppercase">LIVE</span>
                      </div>

                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={item.liveName}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center">
                          <img
                            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
                            alt="Transmisión Cósmica"
                            className="absolute inset-0 h-full w-full object-cover filter brightness-75"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
                          <div className="relative z-10 flex flex-col items-center">
                            <a
                              href={item.liveUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/20 border-2 border-white/40 backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white/30"
                            >
                              <svg className="h-8 w-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </a>
                            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/90">
                              Hacer clic para ingresar a la transmisión
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                      <span className="text-xs text-white/50 font-medium">
                        Transmisión programada vía {item.liveUrl && item.liveUrl.includes("youtube") ? "YouTube" : "Enlace directo"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(item)}
                        className="rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 shrink-0"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. Modal: Agregar Live (Admin)                       */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#d9008f]">🔴</span> Programar Clase en Vivo
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Ingresa los datos para habilitar una nueva sala de transmisión en directo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLive} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre de la Clase
              </label>
              <input
                type="text"
                name="liveName"
                required
                value={newLive.liveName}
                onChange={handleInputChange}
                placeholder="Ej. Fundamentos de nuestra sabiduría"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Transmisión (YouTube Live, Zoom, Vimeo)
              </label>
              <input
                type="url"
                name="liveUrl"
                required
                value={newLive.liveUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                disabled={submitting}
                className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Guardando..." : "Crear Clase"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Clase en Vivo (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{classToDelete?.liveName}</strong>?
              Esta acción no se puede deshacer.
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
