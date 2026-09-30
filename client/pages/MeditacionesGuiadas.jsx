import { useState, useEffect } from "react";
import { guidedMeditationsApi } from "@/lib/api";
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

const BG_IMAGE = "/MeditacionesGuiadas.webp";

export default function MeditacionesGuiadas() {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio player mock/interactive state per item
  const [playingId, setPlayingId] = useState(null);

  // Admin Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newMeditation, setNewMeditation] = useState({
    meditationName: "",
    meditationDescription: "",
    meditationUrlVideo: "",
    platformSpotify: "",
    platformYoutube: "",
    platformInstagram: "",
    platformTiktok: "",
  });

  const handleOpenDelete = (med) => {
    setMedToDelete(med);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!medToDelete) return;
    const mId = medToDelete.meditationId || medToDelete.id;
    try {
      setDeleting(true);
      await guidedMeditationsApi.delete(mId);
      toast.success("¡Meditación eliminada con éxito!");
      setIsDeleteDialogOpen(false);
      setMedToDelete(null);
      loadMeditaciones();
    } catch (err) {
      console.error("Error al eliminar meditación:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadMeditaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await guidedMeditationsApi.getAll();
      setMeditations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar meditaciones:", err);
      setError(err.message || "No se pudo conectar con el servidor Spring Boot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeditaciones();
  }, []);

  const handleScrollToMeditaciones = () => {
    const el = document.getElementById("meditaciones-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeditation((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMeditation = async (e) => {
    e.preventDefault();
    if (!newMeditation.meditationName.trim()) {
      toast.error("Ingresa el nombre de la meditación");
      return;
    }

    try {
      setSubmitting(true);
      const availablePlatforms = {};
      if (newMeditation.platformSpotify) availablePlatforms.Spotify = newMeditation.platformSpotify;
      if (newMeditation.platformYoutube) availablePlatforms.YouTube = newMeditation.platformYoutube;
      if (newMeditation.platformInstagram) availablePlatforms.Instagram = newMeditation.platformInstagram;
      if (newMeditation.platformTiktok) availablePlatforms.TikTok = newMeditation.platformTiktok;

      const payload = {
        meditationName: newMeditation.meditationName,
        meditationDescription: newMeditation.meditationDescription,
        meditationUrlVideo: newMeditation.meditationUrlVideo || "https://open.spotify.com",
        meditationAvailablePlatforms: availablePlatforms,
      };

      await guidedMeditationsApi.create(payload);
      toast.success("¡Meditación registrada con éxito!", {
        description: newMeditation.meditationName,
      });
      setNewMeditation({
        meditationName: "",
        meditationDescription: "",
        meditationUrlVideo: "",
        platformSpotify: "",
        platformYoutube: "",
        platformInstagram: "",
        platformTiktok: "",
      });
      setIsAddModalOpen(false);
      await loadMeditaciones();
    } catch (err) {
      console.error("Error al registrar meditación:", err);
      toast.error("No se pudo crear la meditación: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      setLoading(true);
      const sample = {
        meditationName: "Meditacion del SER",
        meditationDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu. Un viaje íntimo hacia el silencio del corazón y la reconexión con la verdad interior.",
        meditationUrlVideo: "https://open.spotify.com/album/yosoy",
        meditationAvailablePlatforms: {
          YouTube: "https://youtube.com",
          Facebook: "https://facebook.com",
          Instagram: "https://instagram.com",
          TikTok: "https://tiktok.com",
          Spotify: "https://spotify.com",
        },
      };
      await guidedMeditationsApi.create(sample);
      toast.success("¡Meditación de muestra creada en PostgreSQL!");
      await loadMeditaciones();
    } catch (err) {
      toast.error("Error al crear meditación de muestra: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (id) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. Hero Section (Exact Centered Image)               */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael, lotus circle & temple */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Meditaciones Guiadas"
            className="h-full w-full object-cover object-[center_18%] md:object-[center_16%]"
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
              Meditaciones guiadas
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Un espacio de silencio para volver a la calma, la intuición y la conexión profunda con tu esencia viva.
            </p>
          </div>
        </div>

        {/* Scroll button */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToMeditaciones}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#d9008f] hover:bg-[#d9008f]/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Ver Meditaciones</span>
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
      {/* 2. Meditations Cards Section (3D Galaxy Background)  */}
      {/* ---------------------------------------------------- */}
      <section id="meditaciones-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
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
                Frecuencias y Silencio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Sesiones de Meditación
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_25px_rgba(217,0,143,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-pink-400/40"
            >
              Agregar meditación
            </button>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#d9008f] shadow-[0_0_20px_rgba(217,0,143,0.5)]" />
              <p className="text-white/80 text-sm tracking-widest uppercase font-mono">Cargando meditaciones guiadas...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mx-auto max-w-xl my-12 rounded-3xl border border-red-500/40 bg-red-950/60 p-8 text-center backdrop-blur-xl shadow-2xl">
              <h3 className="text-lg font-bold text-red-400">Error de conexión</h3>
              <p className="mt-2 text-sm text-white/80">{error}</p>
              <button
                onClick={loadMeditaciones}
                className="mt-5 rounded-2xl bg-white/15 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && meditations.length === 0 && (
            <div className="mx-auto my-12 max-w-xl rounded-[2.5rem] border border-white/20 bg-white/10 p-12 text-center backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9008f]/25 text-[#d9008f] shadow-[0_0_30px_rgba(217,0,143,0.4)]">
                <span className="text-3xl">🧘</span>
              </div>
              <h3 className="text-2xl font-bold text-white">No hay meditaciones registradas</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Comienza añadiendo una meditación o carga un ejemplo para visualizar la tarjeta con reproductor.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="rounded-full bg-[#d9008f] hover:bg-[#b00074] px-7 py-3 text-sm font-semibold text-white shadow-lg transition"
                >
                  Agregar meditación
                </button>
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-7 py-3 text-sm font-medium text-white transition"
                >
                  Cargar meditación de prueba
                </button>
              </div>
            </div>
          )}

          {/* Cards List matching Image 3 */}
          {!loading && !error && meditations.length > 0 && (
            <div className="mt-12 space-y-20">
              {meditations.map((item) => {
                const isPlaying = playingId === item.meditationId;
                const platforms = item.meditationAvailablePlatforms || {};

                return (
                  <div
                    key={item.meditationId}
                    className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/25 bg-white/10 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-pink-400/40"
                  >
                    {/* Title */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                        {item.meditationName}
                      </h3>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Left Column: Media Player Box */}
                      <div className="relative aspect-square w-full max-w-[380px] mx-auto overflow-hidden rounded-[2rem] border border-white/25 bg-black/70 shadow-2xl">
                        <img
                          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80"
                          alt="Visualización Meditativa"
                          className="h-full w-full object-cover filter brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                        {/* Interactive Audio Player Controls */}
                        <div className="absolute inset-x-0 bottom-0 p-5 backdrop-blur-md bg-black/50 border-t border-white/10">
                          {/* Progress Bar */}
                          <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer">
                            <div
                              className="h-full bg-brand-yellow rounded-full transition-all duration-300"
                              style={{ width: isPlaying ? "48%" : "15%" }}
                            />
                          </div>

                          {/* Player Buttons */}
                          <div className="flex items-center justify-between text-white/90">
                            <button type="button" className="hover:text-brand-yellow transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h4l4 6 4-6h4M4 20h4l12-16M16 20h4M12 14l4 6" />
                              </svg>
                            </button>

                            <button type="button" className="hover:text-brand-yellow transition">
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => togglePlay(item.meditationId)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-ink shadow-lg transition-transform hover:scale-110 active:scale-95"
                            >
                              {isPlaying ? (
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>

                            <button type="button" className="hover:text-brand-yellow transition">
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                              </svg>
                            </button>

                            <button type="button" className="hover:text-brand-yellow transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Description */}
                      <div className="flex flex-col justify-center text-left">
                        <p className="text-base sm:text-lg leading-relaxed text-white/90 drop-shadow">
                          {item.meditationDescription}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Platforms & Volver */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">Disponible en:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={platforms.YouTube || "https://youtube.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/90 text-white hover:bg-red-600 transition hover:scale-105 shadow"
                            title="YouTube"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </a>
                          <a
                            href={platforms.Spotify || "https://spotify.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600/90 text-white hover:bg-green-600 transition hover:scale-105 shadow"
                            title="Spotify"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                          </a>
                          <a
                            href={platforms.Instagram || "https://instagram.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white hover:opacity-90 transition hover:scale-105 shadow"
                            title="Instagram"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenDelete(item)}
                        className="rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Agregar Meditación (Admin)                 */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#d9008f]">🧘</span> Registrar Meditación Guiada
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Añade una nueva experiencia meditativa a la biblioteca consciente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeditation} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre de la Meditación
              </label>
              <input
                type="text"
                name="meditationName"
                required
                value={newMeditation.meditationName}
                onChange={handleInputChange}
                placeholder="Ej. Meditacion del SER"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Descripción
              </label>
              <textarea
                name="meditationDescription"
                required
                rows="3"
                value={newMeditation.meditationDescription}
                onChange={handleInputChange}
                placeholder="Describe el propósito y enfoque de esta meditación..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Audio o Video
              </label>
              <input
                type="url"
                name="meditationUrlVideo"
                value={newMeditation.meditationUrlVideo}
                onChange={handleInputChange}
                placeholder="https://open.spotify.com/track/... o YouTube"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                  Enlace Spotify
                </label>
                <input
                  type="url"
                  name="platformSpotify"
                  value={newMeditation.platformSpotify}
                  onChange={handleInputChange}
                  placeholder="https://open.spotify.com/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1 font-medium">
                  Enlace YouTube
                </label>
                <input
                  type="url"
                  name="platformYoutube"
                  value={newMeditation.platformYoutube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
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
                disabled={submitting}
                className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Guardando..." : "Guardar Meditación"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Meditación (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{medToDelete?.meditationTitle}</strong>?
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
