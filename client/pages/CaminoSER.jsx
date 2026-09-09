import { Link } from "react-router-dom";

const BG_IMAGE = "/CaminoSER.webp";

const services = [
{
  title: "Clases en vivo",
  image: "/ClasesVivo.webp",
  to: "/iniciacion/clases-en-vivo",
  description:
  "Encuentros guiados para aprender, sentir y transformar desde la presencia."
},
{
  title: "Meditaciones guiadas",
  image: "/MeditacionesGuiadas.webp",
  to: "/iniciacion/meditaciones-guiadas",
  description:
  "Rituales de calma y conexión para sostener el silencio interior."
},
{
  title: "Programas de sanación",
  image: "/ProgSanacion.webp",
  to: "/iniciacion/programas-de-sanacion",
  description:
  "Procesos de limpieza, equilibrio y restauración para el cuerpo y la energía."
},
{
  title: "Plantas medicinales",
  image: "/PlantasMedicinales.webp",
  to: "/iniciacion/plantas-medicinales",
  description:
  "Conocimiento vivo de la medicina ancestral y su vínculo con la naturaleza."
}];


export default function CaminoSER() {
  return (
    <main className="relative overflow-hidden bg-brand-ink">
      <section className="relative min-h-[60vh] md:min-h-[88vh]">
        <img
          src={BG_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
          aria-hidden="true"
          fetchpriority="high" />
        
        <div className="absolute inset-0 bg-[#000AC7]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/70 via-transparent to-brand-ink" />

        <div className="relative z-10 mx-auto flex min-h-[60vh] md:min-h-[88vh] w-full max-w-7xl flex-col px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/70">
              Iniciación
            </p>
            <h1 className="mt-4 text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
              Camino al SER
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Un recorrido íntimo para cultivar presencia, sanación y conexión
              con lo esencial.
            </p>
          </div>

          <div className="mt-16 grid w-full gap-6 lg:grid-cols-2">
            {services.map((service, index) =>
            <Link
              key={service.title}
              to={service.to}
              className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow/60 hover:bg-black/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] focus:outline-none focus:ring-2 focus:ring-brand-yellow/70">
              
                <img
                src={service.image}
                alt=""
                className="h-64 w-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105 sm:h-72"
                aria-hidden="true" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                    {service.description}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>);

}
