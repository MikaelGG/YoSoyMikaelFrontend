import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Layout from "./components/Layout";

// Lazy-loaded pages for optimal route code-splitting and ultra-fast initial load
const Index = lazy(() => import("./pages/Index"));
const Eventos = lazy(() => import("./pages/Eventos"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Proposito = lazy(() => import("./pages/Proposito"));
const CaminoSER = lazy(() => import("./pages/CaminoSER"));
const ClasesEnVivo = lazy(() => import("./pages/ClasesEnVivo"));
const MeditacionesGuiadas = lazy(() => import("./pages/MeditacionesGuiadas"));
const ProgramasSanacion = lazy(() => import("./pages/ProgramasSanacion"));
const PlantasMedicinales = lazy(() => import("./pages/PlantasMedicinales"));
const Viajes = lazy(() => import("./pages/Viajes"));
const ViajeDetalle = lazy(() => import("./pages/ViajeDetalle"));
const Musica = lazy(() => import("./pages/Musica"));
const Libros = lazy(() => import("./pages/Libros"));
const Documentos = lazy(() => import("./pages/Documentos"));
const Blog = lazy(() => import("./pages/Blog"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min cache
      refetchOnWindowFocus: false,
    },
  },
});

const PRELOAD_IMAGES = [
  "/Viajes.webp",
  "/PropositoImage.webp",
  "/ProgSanacion.webp",
  "/PlantasMedicinales.webp",
  "/Musica.webp",
  "/MeditacionesGuiadas.webp",
  "/Libros.webp",
  "/Eventos.webp",
  "/Documentos.webp",
  "/ClasesVivo.webp",
  "/CaminoSER.webp",
  "/Blog.webp",
  "/MikaelEneagrama.webp"
];

function ImagePreloader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      PRELOAD_IMAGES.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 1800); // Wait 1.8s so initial render is completely free
    return () => clearTimeout(timer);
  }, []);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-brand-ink flex flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ImagePreloader />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/biblioteca/libros" element={<Libros />} />
              <Route path="/biblioteca/documentos" element={<Documentos />} />
              <Route path="/biblioteca/blog" element={<Blog />} />
              <Route path="/dev" element={<PlaceholderPage title="Dev" />} />
              <Route path="/iniciacion/proposito" element={<Proposito />} />
              <Route path="/iniciacion/camino-al-ser" element={<CaminoSER />} />
              <Route
                path="/iniciacion/clases-en-vivo"
                element={<ClasesEnVivo />}
              />
              <Route
                path="/iniciacion/meditaciones-guiadas"
                element={<MeditacionesGuiadas />}
              />
              <Route
                path="/iniciacion/programas-de-sanacion"
                element={<ProgramasSanacion />}
              />
              <Route
                path="/iniciacion/plantas-medicinales"
                element={<PlantasMedicinales />}
              />
              <Route path="/iniciacion/viajes" element={<Viajes />} />
              <Route path="/iniciacion/viajes/:id" element={<ViajeDetalle />} />
              <Route path="/musica" element={<Musica />} />
              <Route path="/shop" element={<PlaceholderPage title="Shop" />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
