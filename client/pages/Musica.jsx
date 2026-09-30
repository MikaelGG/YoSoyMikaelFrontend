import { useState, useEffect } from "react";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { musicApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Musica.webp";

export default function Musica() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newMusic, setNewMusic] = useState({
    musicNameSong: "",
    musicDescription: "",
    musicVideoUrl: "",
    spotifyUrl: "",
    youtubeUrl: "",
    appleUrl: "",
  });

  const handleOpenDelete = (song) => {
    setSongToDelete(song);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!songToDelete) return;
    const sId = songToDelete.musicId || songToDelete.id;
    try {
      setDeleting(true);
      await musicApi.delete(sId);
      toast.success("¡Obra musical eliminada con éxito!");
      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
      loadMusic();
    } catch (err) {
      console.error("Error al eliminar obra:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadMusic = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await musicApi.getAll();
      setMusicList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar la música:", err);
      setError(err.message || "No se pudo conectar con el servidor de música.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMusic();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMusic((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMusic = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const platforms = {};
      if (newMusic.spotifyUrl.trim()) platforms["Spotify"] = newMusic.spotifyUrl.trim();
      if (newMusic.youtubeUrl.trim()) platforms["YouTube"] = newMusic.youtubeUrl.trim();
      if (newMusic.appleUrl.trim()) platforms["AppleMusic"] = newMusic.appleUrl.trim();

      const payload = {
        musicNameSong: newMusic.musicNameSong.trim(),
        musicDescription: newMusic.musicDescription.trim(),
        musicVideoUrl: newMusic.musicVideoUrl.trim() || null,
        musicAvailablePlatforms: platforms,
      };

      await musicApi.create(payload);
      toast.success("¡Obra musical agregada exitosamente!");
      setIsAddModalOpen(false);
      setNewMusic({
        musicNameSong: "",
        musicDescription: "",
        musicVideoUrl: "",
        spotifyUrl: "",
        youtubeUrl: "",
        appleUrl: "",
      });
      loadMusic();
    } catch (err) {
      console.error("Error al guardar música:", err);
      toast.error(err.message || "Error al registrar la música en el backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrollToMusica = () => {
    const el = document.getElementById("musica-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper for YouTube embed URL
  
  // Helper for platform badges & large icons
  const getPlatformIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("spotify")) {
      return (
        <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.309c-.218.358-.684.473-1.042.254-2.857-1.745-6.453-2.14-10.69-1.171-.409.094-.814-.16-.908-.57-.094-.41.16-.814.57-.908 4.636-1.06 8.604-.614 11.82 1.353.358.218.473.684.254 1.042zm1.469-3.264c-.275.447-.864.59-1.311.315-3.27-2.01-8.254-2.593-12.122-1.418-.501.152-1.034-.131-1.186-.632-.152-.501.131-1.034.632-1.186 4.417-1.34 9.907-.692 13.672 1.62.447.275.59.864.315 1.311zm.126-3.41c-3.921-2.328-10.379-2.542-14.113-1.408-.6.182-1.239-.158-1.421-.758-.182-.6.158-1.239.758-1.421 4.293-1.303 11.417-1.054 15.938 1.629.54.32.719 1.022.399 1.562-.32.54-1.022.719-1.562.399z"/>
        </svg>
      );
    }
    if (n.includes("youtube")) {
      return (
        <svg className="w-5 h-5 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (n.includes("apple")) {
      return (
        <svg className="w-5 h-5 text-[#FC3C44]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.56.64-.99 1.7-.87 2.72 1.01.08 1.99-.47 2.6-1.22z"/>
        </svg>
      );
    }
    if (n.includes("amazon")) {
      return (
        <svg className="w-5 h-5 text-[#00A8E1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.958 10.09c0 1.272-.047 2.338-.727 3.447-.565.918-1.388 1.483-2.306 1.483-1.294 0-1.882-1.012-1.882-2.494 0-2.942 2.071-3.483 4.915-3.483v1.047zm3.436 7.413c-.235.188-.588.212-.847.07-1.177-.94-1.389-1.388-2.024-2.282-1.93 2.047-3.294 2.635-5.342 2.635-2.423 0-4.329-1.482-4.329-4.353 0-2.259 1.341-3.765 3.082-4.518 1.506-.659 3.647-.776 5.247-.965v-.376c0-.683-.07-1.483-.564-2.024-.447-.494-1.247-.706-1.906-.706-1.318 0-2.494.541-2.824 1.882-.07.283-.282.518-.565.542l-2.682-.283c-.259-.047-.518-.235-.447-.588.635-3.059 3.341-4.212 6.447-4.212 1.624 0 3.741.424 4.988 1.694 1.365 1.365 1.247 3.177 1.247 5.083v4.612c0 1.389.588 2 1.13 2.753.188.259.212.565-.024.753l-2.05 1.554zm7.606 2.378c-.282.212-.682.306-.965.118-4.541-3.294-13.883-3.294-18.706.376-.376.282-.776.094-.965-.188-.329-.494-.094-.894.282-1.177 5.341-4.047 15.694-4.023 20.73 0 .329.235.4.612-.376.871z"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    );
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube-nocookie.com/embed/${match[2]}`
      : null;
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. First Viewport (Hero centered on Mikael & Sacred Sound) */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Música y Frecuencias Sagradas"
            className="h-full w-full object-cover object-[18%_6%] sm:object-[18%_4%] md:object-[20%_2%]"
            fetchpriority="high"
          />
          {/* Blue Spiritual Tint & Seamless Compact Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/35" />
          <div className="absolute inset-0 bg-brand-blue/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/30 via-transparent via-80% to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title & Message */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              Arte &amp; Frecuencias
            </p>
            
            {/* 90-Degree Intersecting Typographic Layout: M & K & with Música & description inside angle */}
            <div className="mt-4 select-none">
              <h1 className="sr-only">Música M&amp;K&amp;</h1>
              <div className="flex items-start" aria-hidden="true">
                {/* Columna vertical: M, &, K, & */}
                <div className="flex flex-col items-center flex-shrink-0 font-sans">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                    M
                  </span>
                  <div className="mt-2 flex flex-col items-center gap-1.5 sm:mt-2.5 sm:gap-2 lg:gap-3">
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      &amp;
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      K
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      &amp;
                    </span>
                  </div>
                </div>

                {/* Extensión horizontal "úsica" y descripción dentro del ángulo de 90° */}
                <div className="flex flex-col pl-2 sm:pl-2.5 lg:pl-3">
                  {/* Resto de la palabra "úsica" con los mismos espacios idénticos a &K& */}
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 select-none">
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      ú
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      s
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      i
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      c
                    </span>
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none text-white drop-shadow-lg">
                      a
                    </span>
                  </div>

                  {/* Descripción ubicada DENTRO del ángulo de 90° (bajo "úsica" y a la derecha de "& K &") */}
                  <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-md lg:max-w-lg text-sm sm:text-base leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    Composiciones sagradas, cantos del alma y frecuencias sonoras afinadas para elevar la vibración del espíritu y recordar la melodía del Ser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToMusica}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Explorar Música</span>
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
      <section id="musica-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
        {/* Infinite 3D Galaxy Canvas Background with Neon Lights & 3D Yantras */}
        <CosmicGalaxyBackground />
        {/* Seamless Compact Blend from Hero */}
        <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-transparent pointer-events-none z-10" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-14 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d9008f] font-semibold">
                Armonía Cuántica
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Obras Musicales &amp; Frecuencias
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Sonidos grabados con intención ceremonial para meditación, apertura del corazón y expansión de la consciencia.
              </p>
            </div>

            {/* Admin Add Music Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d9008f] to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(217,0,143,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,143,0.6)] active:scale-95 shrink-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base leading-none">
                +
              </span>
              <span>Agregar Música</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando frecuencias cósmicas...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadMusic}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && musicList.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                🎵
              </div>
              <h3 className="text-xl font-bold text-white">Aún no hay música registrada</h3>
              <p className="mt-2 text-sm text-white/70">
                La biblioteca musical está lista. Usa el botón superior para agregar la primera canción o frecuencia.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Agregar primera obra
              </button>
            </div>
          )}

          {/* Music Cards List (Full Width with Enhanced Player & Large Platform Badges) */}
          {!loading && !error && musicList.length > 0 && (
            <div className="flex flex-col gap-10 pt-12">
              {musicList.map((item) => {
                const embedUrl = getEmbedUrl(item.musicVideoUrl);
                const platforms = item.musicAvailablePlatforms || {};

                return (
                  <div
                    key={item.musicId}
                    className="group relative w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-900/75 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch"
                  >
                    {/* Left: Video Embed or Audio Visualizer Banner */}
                    <div className="relative aspect-video w-full lg:w-5/12 xl:w-1/2 overflow-hidden rounded-2xl bg-black/80 border border-white/10 shrink-0 shadow-lg flex items-center justify-center">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={item.musicNameSong}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-4xl shadow-[0_0_25px_rgba(0,229,255,0.4)] mb-3 animate-pulse">
                            🎶
                          </div>
                          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                            Frecuencia Ceremonial
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Title, Long Description, and Large Platform Badges */}
                    <div className="flex flex-col justify-between flex-1 space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                            Obra Sonora &amp; Armonía Cuántica
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                          {item.musicNameSong}
                        </h3>

                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/85 whitespace-pre-line">
                          {item.musicDescription || "Composición sagrada afinada en proporciones áureas para elevar el estado vibratorio del espíritu, armonizar la biología celular y abrir el espacio a la contemplación serena del Ser."}
                        </p>
                      </div>

                      {/* Large Platform Badges */}
                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">
                            Disponible en Plataformas Oficiales:
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            {Object.entries(platforms).map(([platform, link]) => (
                              <a
                                key={platform}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:scale-105 shadow-md"
                              >
                                {getPlatformIcon(platform)}
                                <span>{platform}</span>
                              </a>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(item)}
                          className="self-end sm:self-center rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0"
                        >
                          🗑️ Eliminar
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
      {/* 3. Modal: Agregar Música (Admin)                     */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#d9008f]">🎵</span> Agregar Nueva Obra Musical
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Registra una canción, canto sagrado o frecuencia sonora con sus enlaces en plataformas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMusic} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Nombre de la Canción / Frecuencia *
              </label>
              <input
                type="text"
                name="musicNameSong"
                required
                value={newMusic.musicNameSong}
                onChange={handleInputChange}
                placeholder="Ej. Canto al Gran Espíritu (432Hz)"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Descripción / Intención *
              </label>
              <textarea
                name="musicDescription"
                required
                rows={3}
                value={newMusic.musicDescription}
                onChange={handleInputChange}
                placeholder="Describe los instrumentos, la frecuencia y la intención de la melodía..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Video / Audio (YouTube o Enlace)
              </label>
              <input
                type="url"
                name="musicVideoUrl"
                value={newMusic.musicVideoUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Spotify URL
                </label>
                <input
                  type="url"
                  name="spotifyUrl"
                  value={newMusic.spotifyUrl}
                  onChange={handleInputChange}
                  placeholder="https://open.spotify.com/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  YouTube Music
                </label>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={newMusic.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://music.youtube.com/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Apple Music
                </label>
                <input
                  type="url"
                  name="appleUrl"
                  value={newMusic.appleUrl}
                  onChange={handleInputChange}
                  placeholder="https://music.apple.com/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>
            </div>

            <DialogFooter className="pt-5 flex gap-3 sm:justify-end">
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
                {submitting ? "Guardando..." : "Guardar Canción"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Música (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{songToDelete?.musicName}</strong>?
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
