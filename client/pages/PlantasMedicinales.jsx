const BG_IMAGE = "/PlantasMedicinales.webp";

export default function PlantasMedicinales() {
  return (
    <main className="relative overflow-hidden bg-brand-ink">
      <div className="relative w-full min-h-screen md:min-h-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="absolute md:relative inset-0 h-full md:h-auto w-full object-cover object-center md:object-center"
          fetchpriority="high"
          aria-hidden="true" />
        
        <div className="absolute inset-0 bg-[#0A0D3F]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-transparent to-brand-ink" />

        <div className="absolute inset-0 z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start px-6 py-20 text-left sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/70">
              Camino al SER
            </p>
            <h1 className="mt-4 text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
              Plantas medicinales
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              El conocimiento ancestral de la naturaleza como fuente de sanación
              y memoria viva.
            </p>
          </div>
        </div>
      </div>
    </main>);

}
