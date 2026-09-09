import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Eventos from "./pages/Eventos";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Proposito from "./pages/Proposito";
import CaminoSER from "./pages/CaminoSER";
import ClasesEnVivo from "./pages/ClasesEnVivo";
import MeditacionesGuiadas from "./pages/MeditacionesGuiadas";
import ProgramasSanacion from "./pages/ProgramasSanacion";
import PlantasMedicinales from "./pages/PlantasMedicinales";
import Viajes from "./pages/Viajes";
import Musica from "./pages/Musica";
import Libros from "./pages/Libros";
import Documentos from "./pages/Documentos";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

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
  "/Blog.webp"
];

function ImagePreloader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      PRELOAD_IMAGES.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }, 1500); // 1.5 second delay so it doesn't block initial page load
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

const App = () =>
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ImagePreloader />
      <BrowserRouter>
        <ScrollToTop />
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
              element={<ClasesEnVivo />} />
            
              <Route
              path="/iniciacion/meditaciones-guiadas"
              element={<MeditacionesGuiadas />} />
            
              <Route
              path="/iniciacion/programas-de-sanacion"
              element={<ProgramasSanacion />} />
            
              <Route
              path="/iniciacion/plantas-medicinales"
              element={<PlantasMedicinales />} />
            
              <Route path="/iniciacion/viajes" element={<Viajes />} />
              <Route path="/musica" element={<Musica />} />
              <Route path="/shop" element={<PlaceholderPage title="Shop" />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;


createRoot(document.getElementById("root")).render(<App />);