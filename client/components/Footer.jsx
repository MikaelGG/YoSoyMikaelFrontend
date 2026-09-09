const galleryImages = [
{
  src: "/imagen-41@2x.png",
  alt: "Retrato circular en tonos oscuros",
  shape: "portrait"
},
{
  src: "/imagen-42@2x.png",
  alt: "Captura vertical con luz suave",
  shape: "portrait"
},
{
  src: "/imagen-43@2x.png",
  alt: "Retrato circular con alto contraste",
  shape: "round"
},
{
  src: "/imagen-13@2x.png",
  alt: "Escena editorial en formato vertical",
  shape: "portrait"
},
{
  src: "/imagen-12@2x.png",
  alt: "Composición fotográfica en exterior",
  shape: "portrait"
},
{
  src: "/imagen-15@2x.png",
  alt: "Registro visual de viaje",
  shape: "portrait"
},
{
  src: "/imagen-14@2x.png",
  alt: "Imagen documental de paisaje",
  shape: "portrait"
}];


export default function Footer() {
  // left: social icons (7), center: logo, right: text+button
  const socialTop = galleryImages.slice(0, 4);
  const socialBottom = galleryImages.slice(4);
  const logoSrc = "/LogoFooter.png"; // center image from public

  return (
    <footer className="relative mt-0 border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* LEFT: social icons column */}
        <div className="hidden w-1/3 flex-col lg:flex">
          <div className="grid grid-cols-4 gap-3">
            {socialTop.map((img) =>
            <figure key={img.src} className="overflow-hidden rounded-lg">
                <img
                src={img.src}
                alt={img.alt}
                className="h-16 w-16 object-cover"
                loading="lazy" />
              
              </figure>
            )}
          </div>

          <div className="mt-4 flex justify-center gap-4">
            {socialBottom.map((img) =>
            <figure key={img.src} className="overflow-hidden rounded-lg">
                <img
                src={img.src}
                alt={img.alt}
                className="h-16 w-16 object-cover"
                loading="lazy" />
              
              </figure>
            )}
          </div>
        </div>

        {/* CENTER: logo */}
        <div className="hidden w-full justify-center lg:flex lg:w-1/3">
          <div className="relative z-20 h-40 overflow-hidden rounded-3xl sm:h-52">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-full w-auto object-contain"
              loading="lazy" />
            
          </div>
        </div>

        {/* RIGHT: text + button */}
        <div className="hidden w-1/3 flex-1 flex-col items-center justify-center gap-4 text-center lg:flex">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            CREATED &amp; EDITED
          </p>
          <p className="text-lg font-semibold leading-none">
            Mikael Gaviria Garcia
          </p>
          <p className="text-lg font-semibold leading-none">M&amp;K&amp;</p>
          <a
            href="mailto:mikael2g3g@gmail.com"
            className="mt-2 inline-flex items-center justify-center rounded-lg border border-white/80 px-6 py-2 text-sm font-semibold tracking-[0.2em] text-white transition hover:bg-white/10">
            
            CONTACT ME
          </a>
        </div>

        {/* Mobile / stacked layout */}
        <div className="flex w-full flex-col gap-4 lg:hidden">
          <div className="flex items-center justify-center">
            <div className="w-28 overflow-hidden rounded-lg">
              <img
                src={logoSrc}
                alt="Logo"
                className="w-full object-contain"
                loading="lazy" />
              
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-8 px-4 pb-8 pt-4">
            {/* Redes sociales */}
            <div className="flex flex-wrap justify-center gap-3">
              {galleryImages.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className="h-14 w-14 rounded-xl object-cover shadow-md"
                  loading="lazy"
                />
              ))}
            </div>

            {/* Botón */}
            <a
              href="mailto:hello@mikael.com"
              className="inline-flex w-full max-w-[280px] items-center justify-center rounded-xl border border-white/80 bg-white/5 px-6 py-4 text-sm font-semibold tracking-[0.2em] text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
            >
              CONTACT ME
            </a>

            {/* Texto CREATED & EDITED */}
            <div className="flex flex-col items-center gap-2 text-center mt-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                CREATED &amp; EDITED
              </p>
              <p className="text-base font-semibold leading-none text-white/90">
                Mikael Gaviria Garcia
              </p>
              <p className="text-base font-bold leading-none text-brand-blue">M&amp;K&amp;</p>
            </div>
          </div>
        </div>
      </div>
    </footer>);

}