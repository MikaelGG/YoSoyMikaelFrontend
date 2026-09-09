const BG_IMAGE = "/Musica.webp";

export default function Musica() {
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
              Arte
            </p>
            <div className="mt-4">
              <h1 className="sr-only">Música M&amp;K&amp;</h1>
              <div className="inline-flex items-start" aria-hidden="true">
                {/* Columna vertical: M, &, K, & */}
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                    M
                  </span>
                  <div className="mt-2 flex flex-col items-center gap-1.5 sm:mt-3 sm:gap-2 lg:mt-4 lg:gap-3">
                    <span className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                      &amp;
                    </span>
                    <span className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                      K
                    </span>
                    <span className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                      &amp;
                    </span>
                  </div>
                </div>

                {/* Resto de la palabra "úsica" */}
                <span className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                  úsica
                </span>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Vibraciones, sonidos y atmósferas que hablan de identidad, emoción
              y presencia.
            </p>
          </div>
        </div>
      </div>
    </main>);

}
