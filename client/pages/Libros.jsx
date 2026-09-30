import { useState, useEffect } from "react";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { booksApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Libros.webp";

export default function Libros() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newBook, setNewBook] = useState({
    bookName: "",
    autor: "Mikael Gaviria García",
    bookImage: "",
    bookDescription: "",
    amazonUrl: "",
    tiendaUrl: "",
  });

  const handleOpenDelete = (book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    const bId = bookToDelete.bookId || bookToDelete.id;
    try {
      setDeleting(true);
      await booksApi.delete(bId);
      toast.success("¡Libro eliminado con éxito!");
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
      loadBooks();
    } catch (err) {
      console.error("Error al eliminar libro:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksApi.getAll();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar los libros:", err);
      setError(err.message || "No se pudo conectar con el servidor de biblioteca.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const platforms = {};
      if (newBook.amazonUrl.trim()) platforms["Amazon"] = newBook.amazonUrl.trim();
      if (newBook.tiendaUrl.trim()) platforms["Tienda Oficial"] = newBook.tiendaUrl.trim();

      const payload = {
        bookName: newBook.bookName.trim(),
        autor: newBook.autor.trim() || "Mikael Gaviria García",
        bookImage: newBook.bookImage.trim() || null,
        bookDescription: newBook.bookDescription.trim(),
        bookAvailableShopPlatforms: platforms,
      };

      await booksApi.create(payload);
      toast.success("¡Libro registrado exitosamente en la biblioteca!");
      setIsAddModalOpen(false);
      setNewBook({
        bookName: "",
        autor: "Mikael Gaviria García",
        bookImage: "",
        bookDescription: "",
        amazonUrl: "",
        tiendaUrl: "",
      });
      loadBooks();
    } catch (err) {
      console.error("Error al guardar el libro:", err);
      toast.error(err.message || "Error al registrar el libro en el backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrollToLibros = () => {
    const el = document.getElementById("libros-section");
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
      {/* 1. First Viewport (Hero centered on Mikael & Sacred Books) */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Biblioteca de Libros Sagrados"
            className="h-full w-full object-cover object-[53%_14%] sm:object-[53%_12%] md:object-[53%_10%]"
            fetchpriority="high"
          />
          {/* Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/15" />
          <div className="absolute inset-0 bg-brand-blue/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title & Message */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 text-left">
          <div className="max-w-sm sm:max-w-md">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              Biblioteca Sagrada
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Libros del Despertar
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Palabras canalizadas, sabiduría viva y enseñanzas universales para recordar quién eres en verdad y transitar la maestría del alma.
            </p>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToLibros}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Explorar Libros</span>
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
      <section id="libros-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
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
                Textos de Sabiduría
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Catálogo de Obras &amp; Libros
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Obras literarias, manuales y escritos para profundizar en el viaje de autoindagación y sanación.
              </p>
            </div>

            {/* Admin Add Book Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d9008f] to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(217,0,143,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,143,0.6)] active:scale-95 shrink-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base leading-none">
                +
              </span>
              <span>Agregar Libro</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando biblioteca cósmica...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadBooks}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && books.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                📖
              </div>
              <h3 className="text-xl font-bold text-white">Aún no hay libros en la biblioteca</h3>
              <p className="mt-2 text-sm text-white/70">
                El catálogo de libros está listo. Usa el botón superior para registrar el primer libro.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Agregar primer libro
              </button>
            </div>
          )}

          {/* Book Cards Grid */}
          {!loading && !error && books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              {books.map((book) => {
                const platforms = book.bookAvailableShopPlatforms || {};

                return (
                  <div
                    key={book.bookId}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/60 p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                  >
                    <div>
                      {/* Book Cover Image */}
                      <div className="relative mb-5 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center">
                        <img
                          src={book.bookImage || BG_IMAGE}
                          alt={book.bookName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                        <span className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 backdrop-blur-sm">
                          {book.autor || "Mikael"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                        {book.bookName}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-white/75 line-clamp-3">
                        {book.bookDescription || "Sabiduría canalizada para el despertar de la consciencia y la sanación integral."}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10">
                      {/* Shop Platforms */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {Object.entries(platforms).map(([platform, link]) => (
                            <a
                              key={platform}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/25 hover:text-white shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                            >
                              <span>🛒</span>
                              <span>{platform}</span>
                            </a>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(book)}
                          className="rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Agregar Libro (Admin)                      */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#d9008f]">📖</span> Registrar Nuevo Libro
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Ingresa los detalles de la obra y los enlaces a las tiendas donde está disponible.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBook} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Título del Libro *
              </label>
              <input
                type="text"
                name="bookName"
                required
                value={newBook.bookName}
                onChange={handleInputChange}
                placeholder="Ej. El Retorno al Ser: Guía de Trascendencia"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Autor
                </label>
                <input
                  type="text"
                  name="autor"
                  value={newBook.autor}
                  onChange={handleInputChange}
                  placeholder="Mikael Gaviria García"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  URL de Portada
                </label>
                <input
                  type="url"
                  name="bookImage"
                  value={newBook.bookImage}
                  onChange={handleInputChange}
                  placeholder="https://.../portada.jpg"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Sinopsis / Descripción *
              </label>
              <textarea
                name="bookDescription"
                required
                rows={3}
                value={newBook.bookDescription}
                onChange={handleInputChange}
                placeholder="Resumen del libro, capítulos y propósito..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Enlace Amazon
                </label>
                <input
                  type="url"
                  name="amazonUrl"
                  value={newBook.amazonUrl}
                  onChange={handleInputChange}
                  placeholder="https://amazon.com/dp/..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Tienda Oficial / Web
                </label>
                <input
                  type="url"
                  name="tiendaUrl"
                  value={newBook.tiendaUrl}
                  onChange={handleInputChange}
                  placeholder="https://yosoymikael.com/tienda/..."
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
                {submitting ? "Guardando..." : "Guardar Libro"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Libro */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{bookToDelete?.bookName}</strong>?
              Esta acción no se puede revertir.
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
