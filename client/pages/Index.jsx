import React, { useState } from "react";
import SacredGeometryLogoOverlay from "@/components/SacredGeometryLogoOverlay";

const BG_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/683e0d206437c1771c3cf37d85a1d2f1a73eef5a?width=2400";
const CIRCLE_IMAGE = "/MikaelEneagrama.webp";
const BLUE_FRAME_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/37a04ddffdaf23cd9eaed126a718e41359b8e97c?width=1600";
const YELLOW_FRAME_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/c3b5a7308d93bb362559202e5b31d2ae5c373aae?width=1600";

const CARDS_DATA = [
  {
    id: "azul",
    number: "I",
    badge: "AZUL CELESTIAL",
    badgeColor: "bg-blue-500/25 text-blue-200 border-blue-400/40",
    title: "La Memoria del Alma",
    subtitle: "Desde Bebé · La Semilla Cósmica",
    image: BLUE_FRAME_IMAGE,
    imageAlt: "Mikael, retrato con marco azul",
    glowClass: "animate-glow-blue",
    floatClass: "animate-card-float-1",
    shapeClass: "aspect-[2/3] w-[80%] max-w-[420px] rounded-[28px]",
    outerBorder: "border-[6px] border-blue-500/70 hover:border-blue-400",
    // Fondo de color Azul
    bgColorBack: "bg-gradient-to-br from-[#0c2354] via-[#071738] to-[#020716]",
    backBorder: "border-[5px] border-blue-400/80 shadow-[0_0_40px_rgba(59,130,246,0.6),inset_0_0_25px_rgba(59,130,246,0.3)]",
    cardAccent: "text-blue-400",
    pillTag: "✦ ETAPA I · ORIGEN",
    story: [
      "Desde que era un bebé en los brazos de este mundo, mis ojos no solo contemplaban las formas del entorno físico, sino los hilos invisibles, las frecuencias y las geometrías de luz que entretejen la realidad. Llegué a este plano con un recuerdo latente que jamás se extinguió: la certeza de que la existencia humana no empieza con el primer aliento terrenal, sino que es la continuación viva de un viaje cósmico infinito.",
      "En mi infancia más temprana, la sensibilidad hacia el sonido, el silencio y la vibración de las personas era abrumadora y al mismo tiempo sagrada. Sentía las emociones del entorno antes de que se pronunciaran las palabras, escuchaba la música oculta en cada rincón de la naturaleza y buscaba en el firmamento estrellado un hogar profundamente familiar. Nacer en esta dimensión fue un pacto de amor: aprender a caminar con pies de barro mientras el alma preservaba la memoria viva del origen.",
      "Aquel bebé que fui no vino a construir una máscara ni a encajar en moldes ajenos, sino a recordar quién Yo Soy y sembrar la semilla de un propósito que hoy florece en servicio al despertar de la consciencia."
    ],
    quote: "«El alma nunca olvida su origen; la infancia es el susurro eterno de las estrellas en el corazón.»",
    keywords: ["Memoria Celular", "Inocencia Primordial", "Semilla Estelar"]
  },
  {
    id: "negro",
    number: "II",
    badge: "NEGRO SAGRADO",
    badgeColor: "bg-neutral-800/90 text-white border-white/40",
    title: "El Vientre del Vacío",
    subtitle: "Crecimiento · Noche Oscura & Transmutación",
    image: CIRCLE_IMAGE,
    imageAlt: "Mikael, retrato sagrado con Eneagrama",
    glowClass: "animate-glow-black",
    floatClass: "animate-card-float-2",
    shapeClass: "aspect-square w-[80%] max-w-[480px] rounded-full",
    outerBorder: "border-[6px] border-black hover:border-white/70",
    // Fondo de color Negro
    bgColorBack: "bg-gradient-to-br from-[#121217] via-[#08080b] to-[#000000]",
    backBorder: "border-[5px] border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.3),0_0_80px_rgba(99,102,241,0.3),inset_0_0_25px_rgba(255,255,255,0.15)]",
    cardAccent: "text-purple-300",
    pillTag: "✦ ETAPA II · EL VACÍO",
    isCircle: true,
    story: [
      "Al crecer, el peso del mundo y las densidades de la experiencia intentaron moldear aquello que nació libre. Llegó el tiempo ineludible de atravesar la noche oscura del alma: el cuestionamiento de las identidades impuestas, los dolores del crecimiento y el silencio abisal donde parece no haber respuestas.",
      "En ese abismo negro descubrí el mayor de los tesoros: la oscuridad no es un castigo ni la ausencia de luz, sino el útero fértil donde germina la consciencia. En el vacío absoluto aprendí a despojarme de los miedos heredados, a morir a las viejas versiones del personaje y a encontrar la paz inquebrantable en el centro del huracán.",
      "El círculo negro representa ese punto cero: el regreso al origen primordial, el silencio que precede a toda nota musical y a toda manifestación de vida. Allí, donde ya no queda ego ni pretensión, se revela la verdadera inmortalidad del SER: comprender que en la nada más profunda reside la totalidad."
    ],
    quote: "«En el vacío más hondo no hay soledad, hay origen; es el templo donde el SER se reconoce a sí mismo.»",
    keywords: ["Punto Cero", "Muerte del Ego", "Alquimia Sagrada"]
  },
  {
    id: "amarillo",
    number: "III",
    badge: "AMARILLO SOLAR",
    badgeColor: "bg-amber-500/25 text-amber-200 border-amber-400/40",
    title: "El Amanecer Dorado",
    subtitle: "Presente · La Radiación del Yo Soy",
    image: YELLOW_FRAME_IMAGE,
    imageAlt: "Mikael, retrato con marco amarillo",
    glowClass: "animate-glow-yellow",
    floatClass: "animate-card-float-3",
    shapeClass: "aspect-[49/87] w-[80%] max-w-[400px] rounded-[28px]",
    outerBorder: "border-[6px] border-amber-400/70 hover:border-amber-300",
    // Fondo de color Amarillo
    bgColorBack: "bg-gradient-to-br from-[#452e05] via-[#241702] to-[#0d0901]",
    backBorder: "border-[5px] border-amber-300/80 shadow-[0_0_40px_rgba(245,158,11,0.6),inset_0_0_25px_rgba(245,158,11,0.3)]",
    cardAccent: "text-amber-400",
    pillTag: "✦ ETAPA III · RADIACIÓN",
    story: [
      "De la noche más profunda emergió el sol interior. La integración de la memoria inocente de la infancia y las pruebas alquímicas del camino encendieron la llama viva de la presencia: el Yo Soy en plena manifestación, soberanía espiritual y verdad.",
      "Hoy, esa energía se canaliza a través de la música sagrada que despierta códigos dormidos, la comunión con las plantas maestras de la Madre Tierra, los viajes de iniciación y la palabra viva que recuerda a cada caminante su propia chispa creadora. No busco seguidores ni títulos exteriores; soy un espejo que refleja la luz que ya habita en ti.",
      "El color amarillo es la radiación de la verdad: el despertar solar que disipa las dudas, ilumina la materia y afirma con cada latido: 'Yo Soy la presencia viva, el amor en movimiento y el puente de regreso a casa'."
    ],
    quote: "«Yo Soy la llama viva que recuerda su origen, abraza su silencio y enciende su propia luz.»",
    keywords: ["Consciencia Solar", "Música del Alma", "Propósito Sagrado"]
  }
];

export default function Index() {
  const [flippedState, setFlippedState] = useState({
    azul: false,
    negro: false,
    amarillo: false
  });

  const toggleCard = (id) => {
    setFlippedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* ---------------------------------------------------- */}
      {/* 1. Permanent Visible Background (Fixed Image)        */}
      {/* ---------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="h-full w-full object-cover object-top md:object-[center_-500px]"
          aria-hidden="true"
          fetchpriority="high"
          onError={(e) => {
            e.currentTarget.src = "/YoSoyImage.webp";
          }}
        />
        {/* Subtle Brand Tint & Top/Bottom Gradient */}
        <div className="absolute inset-0 bg-brand-blue/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/50 via-transparent to-brand-ink/90" />
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Floating 3D Sacred Geometry Integrated with Logo  */}
      {/* ---------------------------------------------------- */}
      <SacredGeometryLogoOverlay />

      {/* ---------------------------------------------------- */}
      {/* 3. Main Content: Header & 3 Vertical Cards           */}
      {/* ---------------------------------------------------- */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-32 pt-36 text-center sm:pt-48">
        <h1 className="font-sans text-4xl font-semibold text-white sm:text-6xl drop-shadow-2xl">
          Yo Soy Mikael
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg leading-relaxed drop-shadow">
          Música, eventos e historias contadas a través de un universo visual
          propio. Explora mi mundo y forma parte de él.
        </p>

        {/* -------------------------------------------------- */}
        {/* Vertical Cards Stack (Como estaban originalmente)  */}
        {/* Con estilo prémium, brillo, flotación y volteo 3D  */}
        {/* -------------------------------------------------- */}
        <div className="mt-16 flex w-full flex-col items-center gap-14 sm:mt-24 sm:gap-20">
          {CARDS_DATA.map((card) => {
            const isFlipped = flippedState[card.id];

            return (
              <div
                key={card.id}
                className={`relative perspective-1200 cursor-pointer select-none transition-all duration-500 ${card.shapeClass} ${card.floatClass}`}
                onClick={() => toggleCard(card.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(card.id);
                  }
                }}
                aria-label={`Carta ${card.title}. Haz clic para ${isFlipped ? "ver retrato" : "leer historia"}`}
              >
                {/* 3D Flip Card Inner Container */}
                <div
                  className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-out ${
                    card.isCircle ? "rounded-full" : "rounded-[28px]"
                  } ${isFlipped ? "rotate-y-180" : ""}`}
                >
                  {/* ============================================== */}
                  {/* FRONT FACE: Retrato Original con Brillo y Clic */}
                  {/* ============================================== */}
                  <div
                    className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden ${
                      card.isCircle ? "rounded-full" : "rounded-[28px]"
                    } ${card.outerBorder} ${card.glowClass} shadow-2xl transition-all duration-300 group`}
                  >
                    {/* Shimmer light beam sweep */}
                    <div className="shimmer-active" />

                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

                    {/* Top Stage Badge */}
                    <div className="absolute top-4 inset-x-0 flex justify-center z-10 pointer-events-none">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md border shadow-lg ${card.badgeColor}`}
                      >
                        <span>{card.number}</span>
                        <span>·</span>
                        <span>{card.badge}</span>
                      </span>
                    </div>

                    {/* Bottom Interactive Click Invitation with Pulsing Beacon */}
                    <div className="absolute bottom-5 inset-x-0 z-10 flex flex-col items-center justify-center px-4 pointer-events-none">
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/60 border border-white/20 px-4 py-1.5 backdrop-blur-md shadow-xl text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-cyan-300 group-hover:text-white transition">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-80" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                        </span>
                        <span className="animate-pulse">👆 Haz clic para revelar quién Yo Soy</span>
                      </div>
                    </div>
                  </div>

                  {/* ============================================== */}
                  {/* BACK FACE: Fondo de Color + Texto desde Bebé   */}
                  {/* (Azul, Negro, Amarillo)                        */}
                  {/* ============================================== */}
                  <div
                    className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 overflow-hidden ${
                      card.isCircle ? "rounded-full" : "rounded-[28px]"
                    } ${card.bgColorBack} ${card.backBorder} p-6 sm:p-8 flex flex-col justify-between backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)]`}
                  >
                    {/* Top Bar with Stage & Close Icon */}
                    <div className={`relative z-10 flex items-center justify-between pb-2 border-b border-white/15 ${card.isCircle ? "px-6 pt-2" : ""}`}>
                      <span className={`text-[11px] font-bold tracking-widest uppercase ${card.cardAccent}`}>
                        {card.pillTag}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(card.id);
                        }}
                        className="rounded-full bg-white/10 hover:bg-white/20 p-1.5 text-white/80 hover:text-white transition shadow-sm"
                        title="Volver al retrato"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <div className={`relative z-10 pt-2 ${card.isCircle ? "px-6" : ""}`}>
                      <p className="text-[10px] font-mono tracking-widest uppercase text-white/60">
                        {card.subtitle}
                      </p>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5 tracking-tight drop-shadow">
                        {card.title}
                      </h3>
                    </div>

                    {/* Scrollable Story Section */}
                    <div
                      className={`relative z-10 my-2 flex-1 overflow-y-auto text-left space-y-2.5 custom-scrollbar ${
                        card.isCircle ? "px-8 max-h-[220px] sm:max-h-[260px]" : "pr-1 max-h-[300px] sm:max-h-[360px]"
                      }`}
                    >
                      {card.story.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-xs sm:text-[13px] leading-relaxed text-white/90 font-normal drop-shadow-sm"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {/* Sacred Quote */}
                      <div className="mt-3 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                        <p className="text-[11px] sm:text-xs italic text-white/95 leading-relaxed font-serif">
                          {card.quote}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action: Flip Back to Portrait */}
                    <div className={`relative z-10 pt-2 border-t border-white/15 flex items-center justify-between ${card.isCircle ? "px-6 pb-2" : ""}`}>
                      <div className="flex gap-1.5 flex-wrap">
                        {card.keywords.slice(0, 2).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white/70"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(card.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-cyan-300 transition shrink-0 ml-2"
                      >
                        <span>↩ Retrato</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
