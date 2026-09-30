import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { journeysApi } from "@/lib/api";
import CosmicGalaxyBackground from "@/components/CosmicGalaxyBackground";
import JourneyEditDialog from "@/components/JourneyEditDialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=80",
];

const DEFAULT_ITINERARY = [
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

const DEFAULT_ROUTES = [
  "Punto de Encuentro: Aeropuerto o terminal principal de la ciudad sede. Serás recibido personalmente por nuestro equipo de logística y transporte.",
  "Transporte Terrestre: Camionetas 4x4 privadas y climatizadas acondicionadas para terrenos rurales y de montaña.",
  "Cruce Fluvial / Senderismo: Botes seguros con chalecos salvavidas para el ingreso a reservas ecológicas y caminatas guiadas por senderos sagrados.",
];

const DEFAULT_LODGING = [
  "Eco-Habitaciones: Camas cómodas, sábanas de algodón natural, mosquiteros y baños privados con agua de manantial.",
  "Alimentación Consciente: Menú vegetariano orgánico de alta frecuencia vibracional preparado por chefs locales.",
  "Zonas de Silencio & Conexión: Malocas tradicionales, senderos de contemplación y terrazas de yoga sobre el dosel del bosque.",
];

const DEFAULT_PRACTICES = [
  "Alineación Sonora Cuántica: Frecuencias Solfeggio, campanas tibetanas y cuencos de cristal para armonizar centros energéticos.",
  "Baños de Florecimiento y Plantas Maestras: Limpieza áurica guiada bajo el consentimiento de la naturaleza viva.",
  "Círculos de Palabra y Fuego Sagrado: Espacios seguros de escucha profunda y transmutación de cargas emocionales.",
];

const DEFAULT_INCLUDES = [
  "Todos los transportes terrestres y fluviales internos",
  "Hospedaje en acomodación seleccionada",
  "Alimentación completa consciente (Desayuno, Almuerzo, Cena)",
  "Participación en todas las ceremonias y talleres",
  "Acompañamiento espiritual continuo con Mikael",
  "Seguro de asistencia médica para viajeros",
];

const DEFAULT_NOT_INCLUDES = [
  "Tiquetes aéreos hasta la ciudad de llegada",
  "Gastos personales o compras en comunidades artesanales",
];

export default function ViajeDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit journey modal
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Reservation form inside page
  const [isReserving, setIsReserving] = useState(false);
  const [submittingReservation, setSubmittingReservation] = useState(false);
  const [reservationData, setReservationData] = useState({
    travelersFullName: "",
    travelersPhone: "",
    travelersMail: "",
    travelersAddress: "",
  });

  const [activeTab, setActiveTab] = useState("itinerario");
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  const loadJourney = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journeysApi.getById(id);
      setJourney(data);
    } catch (err) {
      console.error("Error al cargar el viaje:", err);
      setError(err.message || "No se pudo cargar la información del viaje.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const handleReservationInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!journey) return;
    try {
      setSubmittingReservation(true);
      const journeyId = journey.journeyId || journey.id || id;
      await journeysApi.createReservation(journeyId, reservationData);
      toast.success("¡Tu cupo ha sido reservado con éxito!", {
        description: "Nos contactaremos contigo por WhatsApp y correo con la guía completa de viaje.",
      });
      setIsReserving(false);
      setReservationData({
        travelersFullName: "",
        travelersPhone: "",
        travelersMail: "",
        travelersAddress: "",
      });
    } catch (err) {
      console.error("Error al reservar viaje:", err);
      toast.error("Error al registrar la reserva: " + err.message);
    } finally {
      setSubmittingReservation(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen bg-brand-ink flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
          <p className="text-sm uppercase tracking-widest text-cyan-300">Cargando detalles de la expedición...</p>
        </div>
      </main>
    );
  }

  if (error || !journey) {
    return (
      <main className="relative min-h-screen bg-brand-ink flex flex-col items-center justify-center text-white px-6">
        <div className="max-w-md text-center p-8 rounded-3xl border border-red-500/30 bg-red-950/30 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-red-400">Viaje no encontrado</h2>
          <p className="mt-2 text-sm text-white/70">{error || "No pudimos localizar esta ruta sagrada."}</p>
          <button
            onClick={() => navigate("/iniciacion/viajes")}
            className="mt-6 rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold hover:bg-white/20 transition"
          >
            ← Volver a Viajes Iniciáticos
          </button>
        </div>
      </main>
    );
  }

  // Parse journeyDetails
  let details = {};
  if (journey.journeyDetails) {
    try {
      details = typeof journey.journeyDetails === "string"
        ? JSON.parse(journey.journeyDetails)
        : journey.journeyDetails;
    } catch (e) {
      console.error("Error parsing journeyDetails:", e);
    }
  }

  const badgeText = details.badge || "Expedición Sagrada";
  const taglineText = details.tagline || "Retiro Iniciático de Alta Vibración";
  const galleryList = (Array.isArray(details.gallery) && details.gallery.length > 0)
    ? details.gallery
    : DEFAULT_GALLERY;
  const itineraryList = (Array.isArray(details.itinerary) && details.itinerary.length > 0)
    ? details.itinerary
    : DEFAULT_ITINERARY;
  const routesList = (Array.isArray(details.routes) && details.routes.length > 0)
    ? details.routes
    : DEFAULT_ROUTES;
  const lodgingList = (Array.isArray(details.lodging) && details.lodging.length > 0)
    ? details.lodging
    : DEFAULT_LODGING;
  const practicesList = (Array.isArray(details.practices) && details.practices.length > 0)
    ? details.practices
    : DEFAULT_PRACTICES;
  const includesList = (Array.isArray(details.includes) && details.includes.length > 0)
    ? details.includes
    : DEFAULT_INCLUDES;
  const notIncludesList = (Array.isArray(details.notIncludes) && details.notIncludes.length > 0)
    ? details.notIncludes
    : DEFAULT_NOT_INCLUDES;

  const formattedDate = journey.journeyDate
    ? new Date(journey.journeyDate).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha por confirmar";

  const formattedPrice = journey.journeyPrice
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(journey.journeyPrice)
    : "Consultar aporte";

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white pb-32">
      {/* Background Ambience */}
      <CosmicGalaxyBackground />

      {/* Top Header / Breadcrumb & Admin Edit Action */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 pt-28 sm:pt-32 pb-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/iniciacion/viajes"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
        >
          <span>←</span>
          <span>Volver a Viajes Iniciáticos</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#d9008f]/50 bg-[#d9008f]/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-pink-300 backdrop-blur-md transition hover:bg-[#d9008f]/30 hover:border-pink-400 hover:text-white"
        >
          <span>✏️</span>
          <span>Editar Viaje &amp; Itinerario</span>
        </button>
      </div>

      {/* Hero Banner with Panorama Image */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-6">
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-h-[420px] sm:min-h-[500px] flex flex-col justify-end p-8 sm:p-12 lg:p-16">
          <img
            src={journey.journeyImage || galleryList[0]}
            alt={journey.journeyName}
            className="absolute inset-0 h-full w-full object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/50 to-transparent" />
          <div className="absolute inset-0 bg-[#0A0D3F]/25" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                📅 {formattedDate}
              </span>
              <span className="rounded-full bg-pink-500/20 border border-pink-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-pink-300 backdrop-blur-md">
                🌟 {taglineText}
              </span>
              <span className="rounded-full bg-purple-500/20 border border-purple-400/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 backdrop-blur-md">
                {badgeText}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {journey.journeyName}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/90 drop-shadow max-w-2xl">
              {journey.journeyDescription}
            </p>

            {/* Quick Action Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-white/15">
              <div>
                <span className="block text-xs uppercase tracking-wider text-white/60">Inversión / Aporte Total</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">{formattedPrice}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsReserving(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-ink shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] active:scale-95"
              >
                <span>Reservar Cupo Ahora</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d9008f]">
              Galería Visual ({galleryList.length} Fotografías)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Portales &amp; Escenarios del Viaje
            </h2>
          </div>
          <span className="text-xs text-white/50 hidden sm:block">Click en cada foto para ampliar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryList.map((src, i) => (
            <div
              key={i}
              onClick={() => setSelectedGalleryImg(src)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-black/50 cursor-pointer shadow-lg transition-all hover:border-cyan-400 hover:scale-105"
            >
              <img
                src={src}
                alt={`Foto del viaje ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-cyan-500/0 transition-colors group-hover:bg-cyan-500/20" />
            </div>
          ))}
        </div>
      </section>

      {/* Detail Navigation Tabs */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: "itinerario", label: "🗓️ Itinerario Completo" },
            { id: "rutas", label: "🗺️ Rutas & Traslados" },
            { id: "hoteles", label: "🏡 Hospedaje & Eco-Lodges" },
            { id: "practicas", label: "✨ Prácticas Espirituales" },
            { id: "incluye", label: "🎒 Qué Incluye & Llevar" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-brand-ink shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Itinerario */}
        {activeTab === "itinerario" && (
          <div className="mt-8 space-y-6 max-w-4xl">
            {itineraryList.map((step, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/15 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl transition hover:border-cyan-400/40 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/30">
                    {step.day || `Día ${idx + 1}`}
                  </span>
                  {step.time && <span className="text-xs text-white/50">{step.time}</span>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-white/80">{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Rutas & Traslados */}
        {activeTab === "rutas" && (
          <div className="mt-8 rounded-3xl border border-white/15 bg-neutral-900/60 p-8 max-w-4xl backdrop-blur-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Logística de Transporte y Puntos de Encuentro</h3>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              Cuidamos cada aspecto de tu traslado para que viajes en un estado de presencia y absoluta tranquilidad:
            </p>
            <ul className="space-y-4 text-sm sm:text-base text-white/85">
              {routesList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Hospedaje & Eco-Lodges */}
        {activeTab === "hoteles" && (
          <div className="mt-8 rounded-3xl border border-white/15 bg-neutral-900/60 p-8 max-w-4xl backdrop-blur-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Descanso Sagrado en Comunión con la Naturaleza</h3>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              Seleccionamos eco-lodges y reservas protegidas diseñadas bajo principios bioclimáticos y de geometría armónica:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {lodgingList.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Prácticas Espirituales */}
        {activeTab === "practicas" && (
          <div className="mt-8 rounded-3xl border border-white/15 bg-neutral-900/60 p-8 max-w-4xl backdrop-blur-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Inmersión Ceremonial &amp; Activación del Ser</h3>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              Cada jornada integra herramientas para trascender los límites del ego y recordar tu esencia multidimensional:
            </p>
            <div className="space-y-4 pt-4">
              {practicesList.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border-l-4 border-cyan-400">
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Qué Incluye */}
        {activeTab === "incluye" && (
          <div className="mt-8 rounded-3xl border border-white/15 bg-neutral-900/60 p-8 max-w-4xl backdrop-blur-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Inclusiones y Equipaje Sugerido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-bold text-emerald-400 mb-3">✓ Todo Incluido</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/80 list-disc list-inside">
                  {includesList.map((inc, idx) => (
                    <li key={idx}>{inc}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 mb-3">❌ Qué NO Incluye</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/80 list-disc list-inside">
                  {notIncludesList.map((ninc, idx) => (
                    <li key={idx}>{ninc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Reservation CTA Banner */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12">
        <div className="rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-brand-ink p-8 sm:p-12 text-center backdrop-blur-2xl shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Asegura tu lugar en esta experiencia transformadora
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-white/80">
            Los cupos son estrictamente limitados para garantizar un trabajo íntimo, personalizado y de profundo cuidado ceremonial.
          </p>
          <button
            type="button"
            onClick={() => setIsReserving(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-10 py-4 text-base font-bold text-brand-ink shadow-[0_0_35px_rgba(0,229,255,0.5)] transition hover:bg-cyan-300 hover:scale-105 active:scale-95"
          >
            Formulario de Reserva — {formattedPrice}
          </button>
        </div>
      </section>

      {/* Modal: Reserva de Viaje */}
      <Dialog open={isReserving} onOpenChange={setIsReserving}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border border-white/20 text-white shadow-2xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Reserva de Cupo — {journey.journeyName}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70">
              Ingresa tus datos para registrar tu solicitud de viaje. Nos comunicaremos contigo de inmediato.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReservation} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="travelersFullName"
                required
                value={reservationData.travelersFullName}
                onChange={handleReservationInputChange}
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                placeholder="Ej. Sofia Martínez"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Teléfono de Contacto (WhatsApp) *
              </label>
              <input
                type="tel"
                name="travelersPhone"
                required
                value={reservationData.travelersPhone}
                onChange={handleReservationInputChange}
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                placeholder="Ej. +57 310 1234567"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="travelersMail"
                required
                value={reservationData.travelersMail}
                onChange={handleReservationInputChange}
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                placeholder="Ej. sofia@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                Ciudad o Dirección de Origen *
              </label>
              <input
                type="text"
                name="travelersAddress"
                required
                value={reservationData.travelersAddress}
                onChange={handleReservationInputChange}
                className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-cyan-400 focus:outline-none"
                placeholder="Ej. Medellín, Colombia"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsReserving(false)}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submittingReservation}
                className="rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-bold text-brand-ink hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50"
              >
                {submittingReservation ? "Enviando..." : "Confirmar Reserva"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ampliación de Foto de Galería */}
      <Dialog open={!!selectedGalleryImg} onOpenChange={() => setSelectedGalleryImg(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border border-white/20">
          {selectedGalleryImg && (
            <img src={selectedGalleryImg} alt="Ampliación" className="w-full h-auto rounded-xl object-contain max-h-[80vh]" />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Viaje & Itinerario (Admin) */}
      <JourneyEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        journey={journey}
        onSuccess={() => loadJourney()}
      />
    </main>
  );
}
