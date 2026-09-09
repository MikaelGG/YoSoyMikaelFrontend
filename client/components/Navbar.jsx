import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";












const leftLinks = [
{ label: "Dev", to: "https://mikaelportafolio.vercel.app" },
{ label: "Eventos", to: "/eventos" },
{
  label: "8iblioteca",
  to: "/biblioteca",
  submenu: [
  { label: "Libros", to: "/biblioteca/libros" },
  { label: "Documentos", to: "/biblioteca/documentos" },
  { label: "Blog", to: "/biblioteca/blog" }]

}];


const rightLinks = [
{
  label: "Iniciación",
  to: "/iniciacion",
  submenu: [
  { label: "Propósito", to: "/iniciacion/proposito" },
  { label: "Camino al SER", to: "/iniciacion/camino-al-ser" },
  { label: "Viajes", to: "/iniciacion/viajes" }]

},
{ label: "Música", to: "/musica" },
{ label: "Shop", to: "/shop" }];


function NavLink({ label, to, submenu }) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = Boolean(submenu && submenu.length > 0);
  const isExternalLink = to?.startsWith("http");
  const active =
  (to && !isExternalLink ? pathname === to : false) ||
  submenu?.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  const closeTimeoutRef = useRef(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = () => {
    if (!hasSubmenu) return;
    clearCloseTimeout();
    setIsOpen(true);
  };

  const closeMenu = () => {
    if (!hasSubmenu) return;
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 180);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}>
      
      {hasSubmenu ?
      <button
        type="button"
        onFocus={openMenu}
        onBlur={closeMenu}
        className={cn(
          "text-base font-medium tracking-[0.16em] text-white/80 transition-colors hover:text-white sm:text-lg",
          active && "text-white"
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}>
        
          {label}
        </button> :
      isExternalLink ?
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "text-base font-medium tracking-[0.16em] text-white/80 transition-colors hover:text-white sm:text-lg",
          active && "text-white"
        )}>
        
          {label}
        </a> :

      <Link
        to={to ?? "/"}
        className={cn(
          "text-base font-medium tracking-[0.16em] text-white/80 transition-colors hover:text-white sm:text-lg",
          active && "text-white"
        )}>
        
          {label}
        </Link>
      }

      {hasSubmenu ?
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 mt-3 w-44 -translate-x-1/2 rounded-xl border border-white/10 bg-brand-ink/95 p-2 shadow-xl transition-all duration-200",
          isOpen ?
          "pointer-events-auto visible translate-y-0 opacity-100" :
          "pointer-events-none invisible -translate-y-2 opacity-0"
        )}>
        
          {submenu?.map((item) =>
        <Link
          key={item.to}
          to={item.to}
          className="block rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          onClick={() => {
            setIsOpen(false);
            clearCloseTimeout();
          }}>
          
              {item.label}
            </Link>
        )}
        </div> :
      null}
    </div>);

}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-4 xl:px-8">
        <div className="hidden flex-1 items-center justify-between pr-10 lg:flex xl:pr-16">
          {leftLinks.map((link) =>
          <NavLink key={link.to} {...link} />
          )}
        </div>

        <Link
          to="/"
          className="relative mx-8 flex flex-col items-center xl:mx-12">
          
          <span className="font-sans text-2xl font-semibold text-white sm:text-[1.75rem]">
            Yo Soy
          </span>
          <span className="mt-1 h-[3px] w-10 rounded-full bg-brand-blue sm:w-12" />
        </Link>

        <div className="hidden flex-1 items-center justify-between pl-10 lg:flex xl:pl-16">
          {rightLinks.map((link) =>
          <NavLink key={link.to} {...link} />
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Abrir menú"
              className="flex items-center justify-center rounded-md p-2 text-white lg:hidden">
              
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-brand-ink text-white">
            
            <div className="mt-10 flex flex-col gap-4">
              {[...leftLinks, ...rightLinks].map((link) => (
                <div key={link.to} className="flex flex-col gap-2">
                  {link.submenu ? (
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white/90 transition-colors hover:text-white marker:content-['']">
                        {link.label}
                        <svg
                          className="h-4 w-4 transition-transform group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="mt-2 flex flex-col gap-2 pl-4">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className="text-base text-white/70 transition-colors hover:text-white"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : link.to?.startsWith("http") ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to ?? "/"}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-white/90 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>);

}