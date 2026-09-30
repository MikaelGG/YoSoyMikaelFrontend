import { useState, useEffect } from "react";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { documentsApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Documentos.webp";

export default function Documentos() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newDoc, setNewDoc] = useState({
    documentDescription: "",
    documentPDF: "",
    directUrl: "",
    driveUrl: "",
  });

  const handleOpenDelete = (doc) => {
    setDocToDelete(doc);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    const dId = docToDelete.documentId || docToDelete.id;
    try {
      setDeleting(true);
      await documentsApi.delete(dId);
      toast.success("¡Documento sagrado eliminado con éxito!");
      setIsDeleteDialogOpen(false);
      setDocToDelete(null);
      loadDocuments();
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      toast.error("Error al eliminar: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentsApi.getAll();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
      setError(err.message || "No se pudo conectar con el servidor de documentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoc((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const platforms = {};
      if (newDoc.directUrl.trim()) platforms["Descarga Directa"] = newDoc.directUrl.trim();
      if (newDoc.driveUrl.trim()) platforms["Google Drive"] = newDoc.driveUrl.trim();

      const payload = {
        documentDescription: newDoc.documentDescription.trim(),
        documentPDF: newDoc.documentPDF.trim() || newDoc.directUrl.trim() || "#",
        documentAvailableDownloadPlatforms: platforms,
      };

      await documentsApi.create(payload);
      toast.success("¡Documento sagrado registrado exitosamente!");
      setIsAddModalOpen(false);
      setNewDoc({
        documentDescription: "",
        documentPDF: "",
        directUrl: "",
        driveUrl: "",
      });
      loadDocuments();
    } catch (err) {
      console.error("Error al guardar el documento:", err);
      toast.error(err.message || "Error al registrar el documento en el backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScrollToDocs = () => {
    const el = document.getElementById("documentos-section");
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
      {/* 1. First Viewport (Hero centered on Mikael & Transmissions) */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Archivo de Documentos y Transmisiones"
            className="h-full w-full object-cover object-[50%_12%] sm:object-[50%_10%] md:object-[50%_8%]"
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
              Archivo de Consciencia
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Documentos &amp; Guías
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Manifiestos, tratados espirituales y guías en PDF listas para descargar y nutrir tu proceso de comprensión y estudio personal.
            </p>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToDocs}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Explorar Documentos</span>
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
      <section id="documentos-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
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
                Transmisiones Escritas
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Guías, Tratados &amp; Archivos PDF
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Documentos formativos y diagramas de geometría sagrada disponibles para lectura y descarga gratuita.
              </p>
            </div>

            {/* Admin Add Document Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d9008f] to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(217,0,143,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,143,0.6)] active:scale-95 shrink-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base leading-none">
                +
              </span>
              <span>Agregar Documento</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando documentos sagrados...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadDocuments}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && documents.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                📄
              </div>
              <h3 className="text-xl font-bold text-white">Aún no hay documentos disponibles</h3>
              <p className="mt-2 text-sm text-white/70">
                El repositorio de documentos está listo. Usa el botón superior para registrar el primer archivo PDF.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Agregar primer documento
              </button>
            </div>
          )}

          {/* Document Cards Grid */}
          {!loading && !error && documents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              {documents.map((doc) => {
                const platforms = doc.documentAvailableDownloadPlatforms || {};
                const downloadTarget = doc.documentPDF || "#";

                return (
                  <div
                    key={doc.documentId}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/60 p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                  >
                    <div>
                      {/* PDF Graphic Icon Header */}
                      <div className="relative mb-5 flex h-32 w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-black/60 p-6 border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 text-3xl shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                            📄
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                              Formato PDF
                            </span>
                            <h4 className="text-base font-bold text-white">Tratado Sagrado</h4>
                          </div>
                        </div>
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
                          Digital
                        </span>
                      </div>

                      {/* Description */}
                      <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                        {doc.documentDescription || "Documento sagrado de transmisión y guía espiritual."}
                      </h3>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10">
                      {/* Download Platforms */}
                      {Object.keys(platforms).length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {Object.entries(platforms).map(([platform, link]) => (
                            <a
                              key={platform}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
                            >
                              <span>⬇</span>
                              <span>{platform}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Primary Download Button & Volver button */}
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={downloadTarget}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-ink shadow-[0_0_20px_rgba(0,229,255,0.3)] transition hover:brightness-110 active:scale-95"
                        >
                          <span>Descargar PDF</span>
                          <span>↓</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(doc)}
                          className="rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Agregar Documento (Admin)                  */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#d9008f]">📄</span> Registrar Nuevo Documento PDF
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Ingresa la descripción y los enlaces de descarga del archivo en PDF o Google Drive.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDocument} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Descripción / Título del Documento *
              </label>
              <textarea
                name="documentDescription"
                required
                rows={3}
                value={newDoc.documentDescription}
                onChange={handleInputChange}
                placeholder="Ej. Tratado de los 7 Cuerpos y Guía de Respiración Consciente..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL Directa del Archivo PDF *
              </label>
              <input
                type="url"
                name="documentPDF"
                required
                value={newDoc.documentPDF}
                onChange={handleInputChange}
                placeholder="https://.../documento.pdf"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Enlace de Descarga Directa
                </label>
                <input
                  type="url"
                  name="directUrl"
                  value={newDoc.directUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                  Enlace Google Drive
                </label>
                <input
                  type="url"
                  name="driveUrl"
                  value={newDoc.driveUrl}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
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
                {submitting ? "Guardando..." : "Guardar Documento"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Documento */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar{" "}
              <strong className="text-white font-semibold">{docToDelete?.documentName}</strong>?
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
