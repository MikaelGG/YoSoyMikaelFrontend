

const BG_IMAGE =
"https://api.builder.io/api/v1/image/assets/TEMP/683e0d206437c1771c3cf37d85a1d2f1a73eef5a?width=2400";
const CIRCLE_IMAGE =
"https://api.builder.io/api/v1/image/assets/TEMP/e9f05152bcb4365d0b89fc34e8774e8bbd8e764d?width=1600";
const BLUE_FRAME_IMAGE =
"https://api.builder.io/api/v1/image/assets/TEMP/37a04ddffdaf23cd9eaed126a718e41359b8e97c?width=1600";
const YELLOW_FRAME_IMAGE =
"https://api.builder.io/api/v1/image/assets/TEMP/c3b5a7308d93bb362559202e5b31d2ae5c373aae?width=1600";

export default function Index() {
  return (
    <main className="relative overflow-hidden bg-brand-ink">
      <div className="absolute inset-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="h-full w-full object-cover object-top md:object-[center_-500px]"
          aria-hidden="true"
          fetchpriority="high" />
        
        <div className="absolute inset-0 bg-brand-blue/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/60 via-transparent to-brand-ink" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-40 text-center sm:pt-48">
        <h1 className="font-sans text-4xl font-semibold text-white sm:text-6xl">
          Yo Soy Mikael
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
          Música, eventos e historias contadas a través de un universo visual
          propio. Explora mi mundo y forma parte de él.
        </p>

        <div className="mt-20 flex w-full flex-col items-center gap-8 sm:mt-28 sm:gap-10">
          <div className="mx-auto aspect-[2/3] w-[70%] max-w-[420px] overflow-hidden rounded-[28px] border-[6px] border-brand-blue">
            <img
              src={BLUE_FRAME_IMAGE}
              alt="Mikael, retrato"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async" />
            
          </div>

          <div className="mx-auto aspect-square w-[70%] max-w-[500px] overflow-hidden rounded-full border-[6px] border-black">
            <img
              src={CIRCLE_IMAGE}
              alt="Mikael, retrato circular"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async" />
            
          </div>

          <div className="mx-auto aspect-[49/87] w-[70%] max-w-[400px] overflow-hidden rounded-[28px] border-[6px] border-brand-yellow">
            <img
              src={YELLOW_FRAME_IMAGE}
              alt="Mikael, retrato"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async" />
            
          </div>
        </div>
      </div>
    </main>);

}
