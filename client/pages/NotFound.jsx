import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-ink px-6 pt-16 text-center text-white">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="text-white/70">Esta página no existe.</p>
      <Link
        to="/"
        className="rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
        
        Volver al inicio
      </Link>
    </div>);

};

export default NotFound;
