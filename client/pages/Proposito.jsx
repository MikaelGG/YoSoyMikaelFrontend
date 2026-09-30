import React from "react";

const BG_IMAGE = "/PropositoImage.webp";

const MILESTONES = [
  {
    number: "01",
    title: "Subtitle 01",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Despertar de la memoria celular y reconexión con las aguas primordiales de la vida.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Costa y rocas frente al mar",
  },
  {
    number: "02",
    title: "Subtitle 02",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Unión sagrada y reciprocidad para sembrar una nueva consciencia colectiva.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Manos unidas al atardecer",
  },
  {
    number: "03",
    title: "Subtitle 03",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. El templo del silencio interior y la presencia viva en cada respiración consciente.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Meditación en la naturaleza",
  },
  {
    number: "04",
    title: "Subtitle 04",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aguas serenas reflejando la inmensidad del cielo y la verdad cristalina del corazón.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Lago y montañas en serenidad",
  },
  {
    number: "05",
    title: "Subtitle 05",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. La lámpara del conocimiento iluminando cada paso en el sendero del buscador.",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Luz brillante en las manos",
  },
  {
    number: "06",
    title: "Subtitle 06",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. El camino de retorno al hogar, caminando juntos hacia la luz infinita del SER.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&auto=format&fit=crop&q=80",
    imageAlt: "Viajeros caminando hacia el atardecer",
  },
];

export default function Proposito() {
  return (
    <main className="relative overflow-hidden bg-brand-ink min-h-screen text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={BG_IMAGE}
          alt="Propósito Mikael"
          className="h-full w-full object-cover object-[center_top] filter brightness-95"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-[#0A0D3F]/40" />
        <div className="absolute inset-0 bg-brand-blue/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/80 via-transparent via-65% to-brand-ink" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-36">
        {/* Header Section */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            Misión &amp; Trascendencia
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            Propósito
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/90 drop-shadow">
            Aquí encontrarás qué enfoques hay hacia mi tarea consciente con la humanidad y el mundo.
            Un recorrido de vida y sabiduría que fluye como la serpiente sagrada a lo largo del río.
          </p>
        </div>

        {/* River Snake Pathway */}
        <div className="relative mx-auto max-w-5xl py-8">
          {/* Continuous Luminous Serpent SVG */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 2400"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Neon Gradient */}
                <linearGradient id="serpentGlowSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="25%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="75%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>

                <linearGradient id="neonCoreLine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Luminous Aura */}
              <path
                d="M 500,20
                   C 420,180 380,300 500,420
                   C 620,540 620,680 500,800
                   C 380,920 380,1060 500,1180
                   C 620,1300 620,1440 500,1560
                   C 380,1680 380,1820 500,1940
                   C 620,2060 620,2200 500,2340"
                stroke="url(#serpentGlowSkin)"
                strokeWidth="28"
                strokeLinecap="round"
                filter="url(#neonBlur)"
                opacity="0.85"
              />

              {/* Textured Scales */}
              <path
                d="M 500,20
                   C 420,180 380,300 500,420
                   C 620,540 620,680 500,800
                   C 380,920 380,1060 500,1180
                   C 620,1300 620,1440 500,1560
                   C 380,1680 380,1820 500,1940
                   C 620,2060 620,2200 500,2340"
                stroke="#F59E0B"
                strokeWidth="16"
                strokeDasharray="14 10"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Core Neon Light */}
              <path
                d="M 500,20
                   C 420,180 380,300 500,420
                   C 620,540 620,680 500,800
                   C 380,920 380,1060 500,1180
                   C 620,1300 620,1440 500,1560
                   C 380,1680 380,1820 500,1940
                   C 620,2060 620,2200 500,2340"
                stroke="url(#neonCoreLine)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Serpent Head at Top */}
              <g transform="translate(500, 25)">
                <ellipse cx="0" cy="0" rx="20" ry="30" fill="#FBBF24" filter="url(#neonBlur)" />
                <ellipse cx="0" cy="-6" rx="12" ry="18" fill="#FFF" />
                <circle cx="-5" cy="-10" r="3" fill="#B45309" />
                <circle cx="5" cy="-10" r="3" fill="#B45309" />
              </g>
            </svg>
          </div>

          {/* Crossed Alternating Milestones Flow */}
          <div className="relative z-10 space-y-24 md:space-y-36">
            {MILESTONES.map((milestone, idx) => {
              // Crossed alternating: Even rows have image left / text right; Odd rows have text left / image right
              const isImageLeft = idx % 2 === 0;

              return (
                <div
                  key={milestone.number}
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
                >
                  {/* Left Column */}
                  <div className="w-full md:w-5/12 flex justify-center md:justify-end">
                    {isImageLeft ? (
                      /* Image Card on Left */
                      <div className="group relative aspect-[4/3] w-full max-w-[340px] overflow-hidden rounded-[2.25rem] border-2 border-white/25 bg-black/40 shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.35)]">
                        <img
                          src={milestone.image}
                          alt={milestone.imageAlt}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-4">
                          <span className="inline-flex rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm border border-amber-300/40 shadow">
                            Hito {milestone.number}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Text Block on Left */
                      <div className="text-center md:text-right max-w-sm">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-amber-300 drop-shadow">
                          {milestone.title}
                        </h2>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center Node Column (on the Snake River) */}
                  <div className="relative flex items-center justify-center md:w-2/12">
                    <div className="relative flex h-14 w-14 items-center justify-center">
                      <div className="absolute h-14 w-14 rounded-full bg-amber-400/25 animate-ping" />
                      <div className="relative h-10 w-10 rounded-full border-4 border-white bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.9)] flex items-center justify-center text-brand-ink font-extrabold text-xs">
                        {milestone.number}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-full md:w-5/12 flex justify-center md:justify-start">
                    {!isImageLeft ? (
                      /* Image Card on Right */
                      <div className="group relative aspect-[4/3] w-full max-w-[340px] overflow-hidden rounded-[2.25rem] border-2 border-white/25 bg-black/40 shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.35)]">
                        <img
                          src={milestone.image}
                          alt={milestone.imageAlt}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 right-4">
                          <span className="inline-flex rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm border border-amber-300/40 shadow">
                            Hito {milestone.number}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Text Block on Right */
                      <div className="text-center md:text-left max-w-sm">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-amber-300 drop-shadow">
                          {milestone.title}
                        </h2>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/90 drop-shadow">
                          {milestone.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Spiritual Quote */}
        <div className="mt-32 text-center max-w-2xl mx-auto rounded-3xl border border-white/15 bg-black/40 p-8 backdrop-blur-md shadow-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300 font-semibold">
            El Sendero Sagrado
          </p>
          <p className="mt-3 text-lg sm:text-xl font-medium text-white/95 italic leading-relaxed">
            “El río y la serpiente comparten la misma sabiduría: no se resisten a las rocas, danzan con ellas hasta llegar al océano del SER.”
          </p>
        </div>
      </div>
    </main>
  );
}
