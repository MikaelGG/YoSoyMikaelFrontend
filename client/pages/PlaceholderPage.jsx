import { Link } from "react-router-dom";






export default function PlaceholderPage({
  title,
  description
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pt-16 text-center text-white">
      <span className="h-[3px] w-14 rounded-full bg-brand-yellow" />
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      <p className="max-w-md text-white/70">
        {description ??
        "Esta sección está en construcción. Sigue conversando con Fusion para darle contenido a esta página."}
      </p>
      <Link
        to="/"
        className="rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
        
        Volver al inicio
      </Link>
    </main>);

}
