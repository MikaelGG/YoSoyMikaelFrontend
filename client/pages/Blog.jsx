import { useState, useEffect } from "react";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import { blogsApi, blogTopicsApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BG_IMAGE = "/Blog.webp";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Article Reader Modal state
  const [readingBlog, setReadingBlog] = useState(null);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [commentData, setCommentData] = useState({
    authorName: "",
    commentText: "",
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Admin Create Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    blogName: "",
    blogImage: "",
    blogTopicId: "",
    newTopicName: "",
    blogText: "",
  });

  const handleOpenDelete = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    const bId = blogToDelete.blogId || blogToDelete.id;
    try {
      setDeleting(true);
      await blogsApi.delete(bId);
      toast.success("¡Artículo y comentarios eliminados con éxito!");
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
      loadData();
    } catch (err) {
      console.error("Error al eliminar artículo:", err);
      toast.error("Error al eliminar artículo: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [topicsData, blogsData] = await Promise.all([
        blogTopicsApi.getAll().catch(() => []),
        blogsApi.getAll(selectedTopicId).catch(() => []),
      ]);
      setTopics(Array.isArray(topicsData) ? topicsData : []);
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (err) {
      console.error("Error al cargar blogs:", err);
      setError(err.message || "No se pudo conectar con el servidor de bitácora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTopicId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      setSubmittingBlog(true);
      let targetTopicId = newBlog.blogTopicId;

      // Create topic if user specified a new topic name
      if (!targetTopicId && newBlog.newTopicName.trim()) {
        const createdTopic = await blogTopicsApi.create({
          topicName: newBlog.newTopicName.trim(),
        });
        targetTopicId = createdTopic.blogTopicId;
      }

      const payload = {
        blogName: newBlog.blogName.trim(),
        blogImage: newBlog.blogImage.trim() || null,
        blogText: newBlog.blogText.trim(),
      };

      await blogsApi.create(payload, targetTopicId || null);
      toast.success("¡Artículo publicado exitosamente!");
      setIsAddModalOpen(false);
      setNewBlog({
        blogName: "",
        blogImage: "",
        blogTopicId: "",
        newTopicName: "",
        blogText: "",
      });
      loadData();
    } catch (err) {
      console.error("Error al publicar artículo:", err);
      toast.error(err.message || "Error al publicar el artículo en el backend.");
    } finally {
      setSubmittingBlog(false);
    }
  };

  const handleOpenReader = (blog) => {
    setReadingBlog(blog);
    setIsReadModalOpen(true);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!readingBlog) return;
    try {
      setSubmittingComment(true);
      const payload = {
        reviewersfullName: commentData.authorName?.trim() || "Buscador de Luz",
        reviewersMail: commentData.authorEmail?.trim() || "comunidad@yosoymikael.com",
        reviewersComment: commentData.commentText.trim(),
      };
      await blogsApi.createComment(readingBlog.blogId, payload);
      toast.success("¡Comentario añadido a la reflexión!");
      setCommentData({ authorName: "", authorEmail: "", commentText: "" });
      // Reload blog to update comments
      const updated = await blogsApi.getById(readingBlog.blogId);
      setReadingBlog(updated);
      loadData();
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      toast.error(err.message || "Error al registrar el comentario.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleScrollToBlog = () => {
    const el = document.getElementById("blog-section");
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
      {/* 1. First Viewport (Hero centered on Mikael & Wisdom)  */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image centered on Mikael */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={BG_IMAGE}
            alt="Bitácora y Artículos de Sabiduría"
            className="h-full w-full object-cover object-[35%_10%] sm:object-[34%_8%] md:object-[35%_6%]"
            fetchpriority="high"
          />
          {/* Blue Spiritual Tint & Seamless Bottom Melt */}
          <div className="absolute inset-0 bg-[#0A0D3F]/20" />
          <div className="absolute inset-0 bg-brand-blue/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/40 via-transparent via-55% to-brand-ink" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-ink via-brand-ink/80 to-transparent" />
        </div>

        {/* Hero Title & Message */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 flex justify-end text-left">
          <div className="max-w-md sm:max-w-lg">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              Reflexiones del Alma
            </p>
            <h1 className="mt-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Bitácora &amp; Artículos
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
              Escritos canalizados, crónicas de viajes dimensionales y enseñanzas vivas para acompañarte en tu retorno al corazón consciente.
            </p>
          </div>
        </div>

        {/* Scroll button to second section */}
        <div className="relative z-10 mx-auto pb-10 text-center">
          <button
            type="button"
            onClick={handleScrollToBlog}
            className="group inline-flex flex-col items-center gap-2 rounded-full border border-white/25 bg-black/50 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:scale-105"
          >
            <span className="tracking-widest uppercase text-xs">Leer Artículos</span>
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
      <section id="blog-section" className="relative z-10 w-full min-h-screen py-24 px-6 lg:px-10 overflow-hidden bg-brand-ink">
        {/* Infinite 3D Galaxy Canvas Background with Neon Lights & 3D Yantras */}
        <CosmicGalaxyBackground />
        {/* Seamless Blend from Hero */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-transparent pointer-events-none z-10" />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d9008f] font-semibold">
                Pensamiento Universal
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                Crónicas &amp; Enseñanzas
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl">
                Artículos periódicos para cultivar discernimiento, claridad interior y paz mental.
              </p>
            </div>

            {/* Admin Add Article Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d9008f] to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(217,0,143,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(217,0,143,0.6)] active:scale-95 shrink-0"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base leading-none">
                +
              </span>
              <span>Nuevo Artículo</span>
            </button>
          </div>

          {/* Topics Category Tabs */}
          {topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => setSelectedTopicId(null)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedTopicId === null
                    ? "bg-cyan-500 text-brand-ink shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 border border-white/10 text-white/70 hover:border-cyan-400 hover:text-white"
                }`}
              >
                Todos los Temas
              </button>
              {topics.map((t) => (
                <button
                  key={t.blogTopicId}
                  type="button"
                  onClick={() => setSelectedTopicId(t.blogTopicId)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedTopicId === t.blogTopicId
                      ? "bg-cyan-500 text-brand-ink shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-white/5 border border-white/10 text-white/70 hover:border-cyan-400 hover:text-white"
                  }`}
                >
                  {t.topicName}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
              <p className="text-white/70 text-sm tracking-widest uppercase">Cargando bitácora cósmica...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="my-12 mx-auto max-w-xl rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-red-400">Error al sincronizar con el servidor</h3>
              <p className="mt-2 text-sm text-white/70">{error}</p>
              <button
                onClick={loadData}
                className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && blogs.length === 0 && (
            <div className="my-16 mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-white">Aún no hay artículos publicados</h3>
              <p className="mt-2 text-sm text-white/70">
                La bitácora está lista para tus enseñanzas. Usa el botón superior para crear el primer artículo.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-brand-ink shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400"
              >
                + Escribir primer artículo
              </button>
            </div>
          )}

          {/* Blog Cards Grid */}
          {!loading && !error && blogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              {blogs.map((item) => {
                const commentCount = Array.isArray(item.comments) ? item.comments.length : 0;

                return (
                  <div
                    key={item.blogId}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/60 p-7 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                  >
                    <div>
                      {/* Image Preview Banner */}
                      <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-black/60 border border-white/10">
                        <img
                          src={item.blogImage || BG_IMAGE}
                          alt={item.blogName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {item.blogTopic?.topicName && (
                          <span className="absolute bottom-3 left-3 rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30 backdrop-blur-sm">
                            {item.blogTopic.topicName}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                        {item.blogName}
                      </h3>

                      {/* Text Snippet */}
                      <p className="mt-3 text-sm leading-relaxed text-white/75 line-clamp-3">
                        {item.blogText}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenReader(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 px-4 py-2 text-xs font-bold tracking-wider text-cyan-300 transition hover:bg-cyan-500 hover:text-brand-ink"
                      >
                        <span>Leer completo</span>
                        <span>({commentCount} 💬)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDelete(item)}
                        className="rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/30 text-red-300 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
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
      {/* 3. Modal: Leer Artículo & Comentarios                */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReadModalOpen} onOpenChange={setIsReadModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          {readingBlog && (
            <div>
              <DialogHeader>
                {readingBlog.blogTopic?.topicName && (
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
                    {readingBlog.blogTopic.topicName}
                  </span>
                )}
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
                  {readingBlog.blogName}
                </DialogTitle>
              </DialogHeader>

              {readingBlog.blogImage && (
                <div className="my-4 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={readingBlog.blogImage}
                    alt={readingBlog.blogName}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Full Text */}
              <div className="my-6 whitespace-pre-line text-sm sm:text-base leading-relaxed text-white/85">
                {readingBlog.blogText}
              </div>

              {/* Comments Section */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>Comentarios &amp; Reflexiones</span>
                  <span className="text-xs text-cyan-400">
                    ({Array.isArray(readingBlog.comments) ? readingBlog.comments.length : 0})
                  </span>
                </h4>

                {/* Comment list */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                  {Array.isArray(readingBlog.comments) && readingBlog.comments.length > 0 ? (
                    readingBlog.comments.map((c, i) => (
                      <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold mb-1">
                          <span>{c.reviewersfullName || c.authorName || "Buscador de Luz"}</span>
                          {c.reviewersMail && <span className="text-[10px] text-white/40">{c.reviewersMail}</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-white/80">{c.reviewersComment || c.commentText}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-white/50 italic">Sé el primero en compartir tu reflexión.</p>
                  )}
                </div>

                {/* Add comment form */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre o firma"
                    value={commentData.authorName}
                    onChange={(e) => setCommentData((prev) => ({ ...prev, authorName: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Escribe tu reflexión sobre este artículo..."
                    value={commentData.commentText}
                    onChange={(e) => setCommentData((prev) => ({ ...prev, commentText: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2 text-xs font-bold uppercase tracking-wider text-brand-ink transition disabled:opacity-50"
                  >
                    {submittingComment ? "Enviando..." : "Publicar Comentario"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* 4. Modal: Nuevo Artículo (Admin)                     */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-[#d9008f]">✍️</span> Publicar Nuevo Artículo
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Escribe un artículo para la bitácora asignándolo a un tema o creando uno nuevo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBlog} className="space-y-4 py-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Título del Artículo *
              </label>
              <input
                type="text"
                name="blogName"
                required
                value={newBlog.blogName}
                onChange={handleInputChange}
                placeholder="Ej. El Salto Cuántico de la Consciencia"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Tema / Categoría
                </label>
                <select
                  name="blogTopicId"
                  value={newBlog.blogTopicId}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-3 text-sm text-white focus:border-[#d9008f] focus:outline-none"
                >
                  <option value="">-- Seleccionar Tema --</option>
                  {topics.map((t) => (
                    <option key={t.blogTopicId} value={t.blogTopicId}>
                      {t.topicName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  O Crear Nuevo Tema
                </label>
                <input
                  type="text"
                  name="newTopicName"
                  value={newBlog.newTopicName}
                  onChange={handleInputChange}
                  placeholder="Ej. Sanación Energética"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                URL de Imagen Ilustrativa
              </label>
              <input
                type="url"
                name="blogImage"
                value={newBlog.blogImage}
                onChange={handleInputChange}
                placeholder="https://.../imagen.webp"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                Contenido del Artículo *
              </label>
              <textarea
                name="blogText"
                required
                rows={5}
                value={newBlog.blogText}
                onChange={handleInputChange}
                placeholder="Escribe aquí el cuerpo del artículo o enseñanza..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
              />
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
                disabled={submittingBlog}
                className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submittingBlog ? "Publicando..." : "Publicar Artículo"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación de Artículo (Admin) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-red-500/30 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-white/70">
              ¿Estás seguro de que deseas eliminar este artículo del blog?
              Esta acción también eliminará en cascada todos los comentarios asociados.
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
