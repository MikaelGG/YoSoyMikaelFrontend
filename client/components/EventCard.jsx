









export default function EventCard({
  image,
  imageAlt = "",
  description,
  date,
  price,
  ctaLabel = "Participar",
  onParticipate
}) {
  return (
    <div className="flex w-full flex-col items-center gap-8 rounded-[2.5rem] bg-neutral-300 p-6 sm:p-8">
      <img
        src={image}
        alt={imageAlt}
        className="aspect-[485/323] w-full rounded-[1.75rem] object-cover" />
      

      <p className="px-4 text-center text-base text-black sm:px-8 sm:text-lg">
        {description}
      </p>

      <div className="flex flex-col items-center gap-3">
        <span className="text-lg font-medium text-black sm:text-xl">
          {date}
        </span>
        <span className="text-lg font-medium text-black sm:text-xl">
          {price}
        </span>
      </div>

      <button
        type="button"
        onClick={onParticipate}
        className="w-full max-w-xs rounded-2xl bg-neutral-800 py-4 text-base font-medium text-white transition-opacity hover:opacity-90 sm:text-lg">
        
        {ctaLabel}
      </button>
    </div>);

}