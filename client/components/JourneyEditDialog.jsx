import { useState, useEffect } from "react";
import { journeysApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DEFAULT_GALLERY_TEMPLATES = [
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80",
];

const DEFAULT_ITINERARY_TEMPLATE = [
  {
    day: "Día 1",
    title: "Llegada, Recepción y Círculo de Apertura",
    time: "14:00 - 21:00",
    desc: "Encuentro en el punto de concentración, traslado privado en vehículos 4x4 hacia la reserva natural y eco-lodge. Instalación en habitaciones, cena orgánica de bienvenida y círculo ceremonial de palabra con fuego sagrado para sintonizar las intenciones del retiro.",
  },
  {
    day: "Día 2",
    title: "Caminata a Cascadas Sagradas & Baño de Plantas",
    time: "07:00 - 18:00",
    desc: "Amanecer con meditación sonora y respiración prāṇāyāma frente a las montañas. Desayuno energético y senderismo guiado a través del bosque primario hasta cascadas cristalinas. Ritual de purificación con plantas maestras y armonización con cuencos de cuarzo.",
  },
  {
    day: "Día 3",
    title: "Encuentro con Sabedores & Noche Ceremonial",
    time: "08:00 - Noche",
    desc: "Círculo de enseñanza tradicional con sabedores y taitas de la región sobre la cosmovisión ancestral, el orden cósmico y el linaje de la Tierra. Tarde de preparación corporal y descanso. Al anochecer, inicio de la ceremonia de conexión profunda y cantos de curación.",
  },
  {
    day: "Día 4",
    title: "Integración en Silencio, Arte & Geometría Sagrada",
    time: "09:00 - 20:00",
    desc: "Día dedicado a la digestión espiritual y asimilación de la experiencia. Taller vivencial de geometría sagrada aplicada a la bioenergética, sesiones individuales de orientación espiritual con Mikael y descanso en hamacas junto al río.",
  },
  {
    day: "Día 5",
    title: "Círculo de Florecimiento, Gratitud y Retorno",
    time: "07:30 - 14:00",
    desc: "Ceremonia final de ofrenda a las aguas y a la montaña. Círculo de agradecimiento, entrega de memorias y almuerzo de celebración. Traslado de retorno hacia la ciudad y aeropuerto con el corazón renovado.",
  },
];

export default function JourneyEditDialog({ open, onOpenChange, journey, onSuccess }) {
  const isEditing = Boolean(journey && (journey.journeyId || journey.id));

  const [activeTab, setActiveTab] = useState("basico");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [journeyName, setJourneyName] = useState("");
  const [journeyDescription, setJourneyDescription] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [journeyPrice, setJourneyPrice] = useState("");
  const [journeyImage, setJourneyImage] = useState("");

  // Detailed State
  const [badge, setBadge] = useState("Expedición Sagrada");
  const [tagline, setTagline] = useState("Retiro Iniciático de Alta Vibración");
  const [gallery, setGallery] = useState(DEFAULT_GALLERY_TEMPLATES);
  const [itinerary, setItinerary] = useState(DEFAULT_ITINERARY_TEMPLATE);
  const [routes, setRoutes] = useState([
    "Punto de Encuentro: Aeropuerto o terminal principal de la ciudad sede con recepción privada.",
    "Transporte Terrestre: Camionetas 4x4 privadas y climatizadas acondicionadas para terrenos rurales.",
    "Cruce Fluvial / Senderismo: Botes seguros para ingreso a reservas y caminatas guiadas.",
  ]);
  const [lodging, setLodging] = useState([
    "Eco-Lodge & Reserva Natural: Cabañas bioclimáticas inmersas en la selva o montaña.",
    "Alimentación Consciente: Menú vegetariano orgánico de alta frecuencia con productos locales.",
    "Habitaciones & Silencio: Espacios privados y compartidos armónicos para meditación y descanso.",
  ]);
  const [practices, setPractices] = useState([
    "Ceremonia Sagrada de Reconexión: Espacio guiado de alineación energética y cantos de medicina.",
    "Meditación Prānāyāma y Sonoterapia: Sesiones matutinas al amanecer con cuencos de cuarzo y tambores.",
    "Círculos de Palabra y Sabiduría Ancestral: Diálogos de integración y geometría sagrada aplicada.",
  ]);
  const [includes, setIncludes] = useState([
    "Alojamiento completo en eco-lodges de alta vibración",
    "Alimentación consciente durante toda la estadía",
    "Todas las ceremonias, talleres y materiales",
    "Transporte terrestre y fluvial privado durante la expedición",
    "Acompañamiento espiritual continuo de Mikael",
  ]);
  const [notIncludes, setNotIncludes] = useState([
    "Tiquetes aéreos o traslados hasta la ciudad sede",
    "Gastos personales o compras en comunidades artesanales",
  ]);

  // Load journey data when editing
  useEffect(() => {
    if (journey) {
      setJourneyName(journey.journeyName || "");
      setJourneyDescription(journey.journeyDescription || "");
      setJourneyDate(journey.journeyDate || "");
      setJourneyPrice(journey.journeyPrice ? String(journey.journeyPrice) : "");
      setJourneyImage(journey.journeyImage || "");

      if (journey.journeyDetails) {
        try {
          const parsed = typeof journey.journeyDetails === "string" 
            ? JSON.parse(journey.journeyDetails) 
            : journey.journeyDetails;

          if (parsed.badge) setBadge(parsed.badge);
          if (parsed.tagline) setTagline(parsed.tagline);
          if (Array.isArray(parsed.gallery) && parsed.gallery.length > 0) setGallery(parsed.gallery);
          if (Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) setItinerary(parsed.itinerary);
          if (Array.isArray(parsed.routes) && parsed.routes.length > 0) setRoutes(parsed.routes);
          if (Array.isArray(parsed.lodging) && parsed.lodging.length > 0) setLodging(parsed.lodging);
          if (Array.isArray(parsed.practices) && parsed.practices.length > 0) setPractices(parsed.practices);
          if (Array.isArray(parsed.includes) && parsed.includes.length > 0) setIncludes(parsed.includes);
          if (Array.isArray(parsed.notIncludes) && parsed.notIncludes.length > 0) setNotIncludes(parsed.notIncludes);
        } catch (e) {
          console.error("Error parsing journeyDetails:", e);
        }
      }
    } else {
      // Reset for new creation
      setJourneyName("");
      setJourneyDescription("");
      setJourneyDate("");
      setJourneyPrice("");
      setJourneyImage("");
      setBadge("Expedición Sagrada");
      setTagline("Retiro Iniciático de Alta Vibración");
      setGallery(DEFAULT_GALLERY_TEMPLATES);
      setItinerary(DEFAULT_ITINERARY_TEMPLATE);
    }
  }, [journey, open]);

  // Gallery handlers
  const handleGalleryChange = (idx, val) => {
    setGallery((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  // Itinerary handlers
  const handleAddItineraryDay = () => {
    const nextDayNum = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev,
      {
        day: `Día ${nextDayNum}`,
        time: "08:00 - 18:00",
        title: "Nueva Jornada Sagrada",
        desc: "Describe aquí las ceremonias, traslados y actividades correspondientes a este día...",
      },
    ]);
  };

  const handleItineraryChange = (idx, field, val) => {
    setItinerary((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleRemoveItineraryDay = (idx) => {
    setItinerary((prev) => prev.filter((_, i) => i !== idx));
  };

  // Generic List helpers (Routes, Lodging, Practices, Includes, NotIncludes)
  const handleAddListItem = (setter) => {
    setter((prev) => [...prev, "Nuevo ítem informativo..."]);
  };

  const handleUpdateListItem = (setter, idx, val) => {
    setter((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleRemoveListItem = (setter, idx) => {
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const detailsObj = {
        badge: badge.trim() || "Expedición Sagrada",
        tagline: tagline.trim() || "Retiro Iniciático de Alta Vibración",
        gallery: gallery.filter((url) => Boolean(url && url.trim())),
        itinerary,
        routes,
        lodging,
        practices,
        includes,
        notIncludes,
      };

      const payload = {
        journeyName: journeyName.trim(),
        journeyDescription: journeyDescription.trim(),
        journeyDate: journeyDate || null,
        journeyPrice: journeyPrice ? parseFloat(journeyPrice) : null,
        journeyImage: journeyImage.trim() || null,
        journeyDetails: JSON.stringify(detailsObj),
      };

      let result;
      if (isEditing) {
        const id = journey.journeyId || journey.id;
        result = await journeysApi.update(id, payload);
        toast.success("¡Ruta de viaje y detalles actualizados con éxito!");
      } else {
        result = await journeysApi.create(payload);
        toast.success("¡Nueva ruta iniciática creada con éxito en la base de datos!");
      }

      onOpenChange(false);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("Error saving journey:", err);
      toast.error(err.message || "Error al guardar el viaje.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#d9008f]">🌍</span>
            <span>{isEditing ? "Editar Ruta de Viaje & Detalles" : "Programar Nueva Ruta de Viaje"}</span>
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Configura el itinerario completo día por día, fotos de galería, rutas, eco-lodges y prácticas sagradas.
          </DialogDescription>
        </DialogHeader>

        {/* Modal Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 pt-2">
          {[
            { id: "basico", label: "📋 Información Principal" },
            { id: "galeria", label: "📸 Galería (6 Fotos)" },
            { id: "itinerario", label: "🗓️ Itinerario Día por Día" },
            { id: "logistica", label: "🗺️ Rutas & Eco-Lodges" },
            { id: "practicas", label: "✨ Prácticas & Inclusiones" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-brand-ink shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-3">
          {/* TAB 1: BÁSICO */}
          {activeTab === "basico" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Nombre de la Ruta / Destino *
                </label>
                <input
                  type="text"
                  required
                  value={journeyName}
                  onChange={(e) => setJourneyName(e.target.value)}
                  placeholder="Ej. Peregrinaje a las Pirámides de Egipto y Monte Sinaí"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Etiqueta Superior (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ej. Expedición Sagrada"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-cyan-300 placeholder-white/30 focus:border-cyan-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Subtítulo / Tagline del Retiro
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Ej. Retiro Iniciático de Alta Vibración"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-pink-300 placeholder-white/30 focus:border-pink-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Descripción General del Viaje *
                </label>
                <textarea
                  required
                  rows={3}
                  value={journeyDescription}
                  onChange={(e) => setJourneyDescription(e.target.value)}
                  placeholder="Detalla los lugares sagrados a visitar, propósito místico y esencia del retiro..."
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Fecha del Viaje *
                  </label>
                  <input
                    type="date"
                    required
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full rounded-xl bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white focus:border-[#d9008f] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Valor / Inversión Total (COP)
                  </label>
                  <input
                    type="number"
                    value={journeyPrice}
                    onChange={(e) => setJourneyPrice(e.target.value)}
                    placeholder="Ej. 4500000"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1 font-medium">
                  URL de Imagen Principal (Hero Banner)
                </label>
                <input
                  type="url"
                  value={journeyImage}
                  onChange={(e) => setJourneyImage(e.target.value)}
                  placeholder="https://.../foto-portada.jpg"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#d9008f] focus:outline-none transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: GALERÍA (6 FOTOS) */}
          {activeTab === "galeria" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">
                  Ingresa las URLs de las 6 fotografías que se desplegarán en la galería interactiva del viaje:
                </p>
                <button
                  type="button"
                  onClick={() => setGallery(DEFAULT_GALLERY_TEMPLATES)}
                  className="text-xs text-cyan-300 hover:underline"
                >
                  Restaurar fotos sugeridas
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="rounded-2xl border border-white/15 bg-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">Fotografía #{idx + 1}</span>
                      {gallery[idx] && (
                        <span className="text-[10px] text-emerald-400 font-semibold">✓ Imagen cargada</span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={gallery[idx] || ""}
                      onChange={(e) => handleGalleryChange(idx, e.target.value)}
                      placeholder={`https://.../foto${idx + 1}.jpg`}
                      className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                    />
                    {gallery[idx] && (
                      <div className="h-24 w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                        <img
                          src={gallery[idx]}
                          alt={`Preview ${idx + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ITINERARIO */}
          {activeTab === "itinerario" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">
                  Configura cada jornada del itinerario día a día. Puedes agregar más días o editarlos:
                </p>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 px-4 py-1.5 text-xs font-bold transition"
                >
                  + Agregar Día
                </button>
              </div>

              <div className="space-y-4">
                {itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={item.day}
                          onChange={(e) => handleItineraryChange(idx, "day", e.target.value)}
                          placeholder="Día 1"
                          className="w-24 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 text-xs font-bold text-cyan-300"
                        />
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleItineraryChange(idx, "time", e.target.value)}
                          placeholder="Horario (ej. 08:00 - 18:00)"
                          className="w-40 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 text-xs text-white/80"
                        />
                      </div>

                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="text-xs text-red-400 hover:text-red-300 transition"
                        >
                          ✕ Eliminar día
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                      placeholder="Título de la jornada sagrada..."
                      className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm font-bold text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none"
                    />

                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => handleItineraryChange(idx, "desc", e.target.value)}
                      placeholder="Descripción profunda de las actividades, ceremonias y lugares..."
                      className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white/90 placeholder-white/30 focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOGÍSTICA (RUTAS & ECO-LODGES) */}
          {activeTab === "logistica" && (
            <div className="space-y-6">
              {/* Rutas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>🗺️</span> Rutas &amp; Logística de Traslados
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setRoutes)}
                    className="text-xs text-cyan-300 hover:underline"
                  >
                    + Agregar punto de ruta
                  </button>
                </div>
                {routes.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={r}
                      onChange={(e) => handleUpdateListItem(setRoutes, idx, e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                    {routes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem(setRoutes, idx)}
                        className="text-xs text-red-400 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Eco-Lodges */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>🏡</span> Hospedaje &amp; Eco-Lodges Sagrados
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setLodging)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    + Agregar hospedaje
                  </button>
                </div>
                {lodging.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={l}
                      onChange={(e) => handleUpdateListItem(setLodging, idx, e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                    {lodging.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem(setLodging, idx)}
                        className="text-xs text-red-400 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRÁCTICAS & INCLUSIONES */}
          {activeTab === "practicas" && (
            <div className="space-y-6">
              {/* Prácticas Espirituales */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-pink-300 flex items-center gap-1.5">
                    <span>✨</span> Prácticas &amp; Ceremonias Espirituales
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setPractices)}
                    className="text-xs text-pink-300 hover:underline"
                  >
                    + Agregar práctica
                  </button>
                </div>
                {practices.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => handleUpdateListItem(setPractices, idx, e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white focus:border-pink-400 focus:outline-none"
                    />
                    {practices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem(setPractices, idx)}
                        className="text-xs text-red-400 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Incluye */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>🎒</span> Qué Incluye la Expedición
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setIncludes)}
                    className="text-xs text-cyan-300 hover:underline"
                  >
                    + Agregar inclusión
                  </button>
                </div>
                {includes.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inc}
                      onChange={(e) => handleUpdateListItem(setIncludes, idx, e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                    {includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem(setIncludes, idx)}
                        className="text-xs text-red-400 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* No Incluye */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/60 flex items-center gap-1.5">
                    <span>❌</span> Qué NO Incluye
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddListItem(setNotIncludes)}
                    className="text-xs text-white/60 hover:underline"
                  >
                    + Agregar exclusión
                  </button>
                </div>
                {notIncludes.map((ninc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ninc}
                      onChange={(e) => handleUpdateListItem(setNotIncludes, idx, e.target.value)}
                      className="flex-1 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                    />
                    {notIncludes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem(setNotIncludes, idx)}
                        className="text-xs text-red-400 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-white/10 flex gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#d9008f] hover:bg-[#b00074] px-7 py-2.5 text-sm font-semibold text-white shadow-lg transition disabled:opacity-50"
            >
              {submitting ? "Guardando en BD..." : isEditing ? "Guardar Cambios" : "Crear Viaje"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
