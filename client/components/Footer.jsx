import React from "react";

const socialLinks = [
  {
    id: "facebook",
    name: "Facebook",
    src: "/imagen-41@2x.webp",
    fallback: "/imagen-41@2x.png",
    alt: "Facebook Yo Soy Mikael",
    href: "https://www.facebook.com",
    glow: "hover:from-blue-500/60 hover:to-blue-600/40 hover:shadow-[0_0_22px_rgba(24,119,242,0.45)]"
  },
  {
    id: "instagram",
    name: "Instagram",
    src: "/imagen-42@2x.webp",
    fallback: "/imagen-42@2x.png",
    alt: "Instagram Yo Soy Mikael",
    href: "https://www.instagram.com",
    glow: "hover:from-pink-500/60 hover:to-rose-600/40 hover:shadow-[0_0_22px_rgba(225,48,108,0.45)]"
  },
  {
    id: "tiktok",
    name: "TikTok",
    src: "/imagen-43@2x.webp",
    fallback: "/imagen-43@2x.png",
    alt: "TikTok Yo Soy Mikael",
    href: "https://www.tiktok.com",
    glow: "hover:from-cyan-400/60 hover:to-teal-500/40 hover:shadow-[0_0_22px_rgba(0,242,254,0.45)]"
  },
  {
    id: "spotify",
    name: "Spotify",
    src: "/imagen-13@2x.webp",
    fallback: "/imagen-13@2x.png",
    alt: "Spotify Yo Soy Mikael",
    href: "https://open.spotify.com",
    glow: "hover:from-emerald-400/60 hover:to-green-600/40 hover:shadow-[0_0_22px_rgba(29,185,84,0.45)]"
  },
  {
    id: "youtube",
    name: "YouTube",
    src: "/imagen-12@2x.webp",
    fallback: "/imagen-12@2x.png",
    alt: "YouTube Yo Soy Mikael",
    href: "https://www.youtube.com",
    glow: "hover:from-red-500/60 hover:to-red-600/40 hover:shadow-[0_0_22px_rgba(255,0,0,0.45)]"
  },
  {
    id: "deezer",
    name: "Deezer",
    src: "/imagen-15@2x.webp",
    fallback: "/imagen-15@2x.png",
    alt: "Deezer Yo Soy Mikael",
    href: "https://www.deezer.com",
    glow: "hover:from-purple-500/60 hover:to-indigo-600/40 hover:shadow-[0_0_22px_rgba(162,56,255,0.45)]"
  },
  {
    id: "applemusic",
    name: "Apple Music",
    src: "/imagen-14@2x.webp",
    fallback: "/imagen-14@2x.png",
    alt: "Apple Music Yo Soy Mikael",
    href: "https://music.apple.com",
    glow: "hover:from-rose-500/60 hover:to-pink-600/40 hover:shadow-[0_0_22px_rgba(250,36,60,0.45)]"
  }
];

export default function Footer() {
  const socialTop = socialLinks.slice(0, 4);
  const socialBottom = socialLinks.slice(4);
  const logoSrc = "/LogoFooter.webp";

  return (
    <footer className="relative z-20 w-full overflow-hidden bg-[#02040a] text-white">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Seamless Gradient Horizon (Blends with page background above)  */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent via-[#02040a]/70 to-[#02040a] pointer-events-none" />
      
      {/* Luminous Celestial Horizon Line & Aura */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-blue-500/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-1/4 h-28 bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-2xl pointer-events-none" />

      {/* Ambient Cosmic Lights (Deep black + luminous blue glow) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ----------------------------------------------------------------- */}
      {/* 2. Main Content Container                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-center">
          
          {/* ============================================================== */}
          {/* LEFT: Social & Music Media Icons Grid (Desktop)                */}
          {/* ============================================================== */}
          <div className="hidden w-1/3 flex-col lg:flex">
            {/* Top Row: 4 icons (Facebook, Instagram, TikTok, Spotify) */}
            <div className="grid grid-cols-4 gap-3.5">
              {socialTop.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={item.name}
                  className={`group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-blue-500/20 to-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 ${item.glow}`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-[15px] bg-[#030712]/90 backdrop-blur-sm p-2 transition-colors duration-300 group-hover:bg-[#060c1d]">
                    <img
                      src={item.src}
                      alt={item.alt}
                      onError={(e) => {
                        if (item.fallback && e.currentTarget.src !== item.fallback) {
                          e.currentTarget.src = item.fallback;
                        }
                      }}
                      className="h-full w-full object-contain filter drop-shadow transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {/* Subtle inner light sheen */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/0 via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </a>
              ))}
            </div>

            {/* Bottom Row: 3 icons (YouTube, Deezer, Apple Music) */}
            <div className="mt-3.5 flex justify-center gap-3.5">
              {socialBottom.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={item.name}
                  className={`group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-blue-500/20 to-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 ${item.glow}`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-[15px] bg-[#030712]/90 backdrop-blur-sm p-2 transition-colors duration-300 group-hover:bg-[#060c1d]">
                    <img
                      src={item.src}
                      alt={item.alt}
                      onError={(e) => {
                        if (item.fallback && e.currentTarget.src !== item.fallback) {
                          e.currentTarget.src = item.fallback;
                        }
                      }}
                      className="h-full w-full object-contain filter drop-shadow transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {/* Subtle inner light sheen */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/0 via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </a>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* CENTER: Logo with Radiant Cosmic Backlight                     */}
          {/* ============================================================== */}
          <div className="hidden w-full justify-center lg:flex lg:w-1/3">
            <div className="group relative z-20 flex h-44 sm:h-52 items-center justify-center">
              {/* Pulsing Backlight Orb behind Logo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/25 via-cyan-400/20 to-transparent blur-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-cyan-400/30" />
              <img
                src={logoSrc}
                alt="Logo Yo Soy Mikael"
                onError={(e) => {
                  e.currentTarget.src = "/LogoFooter.png";
                }}
                className="relative z-10 h-full w-auto object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: Spiritual Credits & Glowing Contact Button              */}
          {/* ============================================================== */}
          <div className="hidden w-1/3 flex-1 flex-col items-center justify-center gap-3 text-center lg:flex">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              CREATED &amp; EDITED
            </span>
            <p className="text-xl font-bold tracking-wide text-white drop-shadow-sm">
              Mikael Gaviria Garcia
            </p>
            <p className="text-lg font-extrabold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.7)]">
              M&amp;K&amp;
            </p>

            <a
              href="mailto:mikael2g3g@gmail.com"
              className="relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/15 via-blue-600/20 to-indigo-600/15 px-7 py-2.5 text-xs font-bold tracking-[0.22em] text-white shadow-[0_0_15px_rgba(0,229,255,0.2)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:bg-cyan-500/25 hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                CONTACT ME
                <span className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 hover:translate-x-full" />
            </a>
          </div>

          {/* ============================================================== */}
          {/* MOBILE / RESPONSIVE STACKED LAYOUT                            */}
          {/* ============================================================== */}
          <div className="flex w-full flex-col items-center gap-6 lg:hidden">
            {/* Mobile Logo */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
              <div className="relative z-10 w-32 overflow-hidden">
                <img
                  src={logoSrc}
                  alt="Logo"
                  onError={(e) => {
                    e.currentTarget.src = "/LogoFooter.png";
                  }}
                  className="w-full object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Mobile Social Gallery */}
            <div className="flex flex-wrap justify-center gap-3 px-2 max-w-sm">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  aria-label={item.name}
                  className={`group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-blue-500/20 to-white/5 shadow-md transition-all duration-300 active:scale-95 ${item.glow}`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[15px] bg-[#030712]/90 backdrop-blur-sm p-2 transition-colors duration-300 group-hover:bg-[#060c1d]">
                    <img
                      src={item.src}
                      alt={item.alt}
                      onError={(e) => {
                        if (item.fallback && e.currentTarget.src !== item.fallback) {
                          e.currentTarget.src = item.fallback;
                        }
                      }}
                      className="h-full w-full object-contain filter drop-shadow transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </a>
              ))}
            </div>

            {/* Mobile Contact Button */}
            <a
              href="mailto:mikael2g3g@gmail.com"
              className="inline-flex w-full max-w-[280px] items-center justify-center rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 via-blue-600/25 to-indigo-600/20 px-6 py-3.5 text-xs font-bold tracking-[0.22em] text-white shadow-[0_0_15px_rgba(0,229,255,0.25)] backdrop-blur-md transition-all active:scale-95"
            >
              CONTACT ME
            </a>

            {/* Mobile Credits */}
            <div className="flex flex-col items-center gap-1.5 text-center mt-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                CREATED &amp; EDITED
              </span>
              <p className="text-base font-bold text-white">
                Mikael Gaviria Garcia
              </p>
              <p className="text-base font-extrabold tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                M&amp;K&amp;
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3. Subtle Spiritual Divider & Copyright Bar                       */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-[11px] text-white/40 tracking-wider">
          <p>© {new Date().getFullYear()} YO SOY MIKAEL • Consciencia &amp; Sanación Holística</p>
          <div className="flex items-center gap-4 text-cyan-400/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-[0.2em] uppercase text-[10px]">El Camino al Ser</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
