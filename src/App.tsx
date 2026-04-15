import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoRolodex } from './components/ui/animated-logo-rolodex';
import { fetchDriveImages } from './lib/gdrive';
import alumniLogo from './assets/logos/ALUMNI_Blanco@3x.png';

// Fallback in case Proxy is unsupported by the TV
if (typeof motion === 'undefined') {
  throw new Error("FATAL: 'motion' object from framer-motion is UNDEFINED. SystemJS import failed.");
}
const MotionImg = motion.img || (typeof motion === "function" ? motion("img") : null);

if (!MotionImg) {
  throw new Error("FATAL: 'motion.img' and 'motion(\"img\")' are both undefined. TV JS engine unsupported.");
}
if (typeof AnimatePresence === 'undefined') {
  throw new Error("FATAL: 'AnimatePresence' is UNDEFINED.");
}
if (typeof LogoRolodex === 'undefined') {
  throw new Error("FATAL: 'LogoRolodex' is UNDEFINED.");
}

const SvgMaximize = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
);

const SvgMinimize = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
);

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1080&auto=format&fit=crop"
];

export default function App() {
  const [imageIndex, setImageIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mappedArtes, setMappedArtes] = useState<string[]>([]);
  const [mappedLogos, setMappedLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      // Fetch URLs from Drive API
      const artes = await fetchDriveImages('1GaYLdPvpyeMTAVjMhoEsy3q8aqOxoD4b');
      const logos = await fetchDriveImages('1F0QxbtaqnwVpQokuXfoGHG8xsQ2MEAc');
      
      setMappedArtes(artes);
      setMappedLogos(logos);

      // Preload all images so there are no delays during rendering and carousel transitions
      const allImagesToPreload = [...artes, ...logos];
      await Promise.all(
        allImagesToPreload.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Ignore individual failures to not block forever
          });
        })
      );

      setIsLoading(false);
    }
    loadImages();
  }, []);

  const IMAGES = mappedArtes.length > 0 ? mappedArtes : FALLBACK_IMAGES;

  useEffect(() => {
    if (isLoading) return; // Do not start the interval until loaded

    const interval = setInterval(() => {
      // 1. Empezamos a desvanecer la imagen a negro
      setOpacity(0);
      
      // 2. Esperamos a que termine el fade (1 segundo), cambiamos la imagen
      // y la volvemos a aparecer
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % IMAGES.length);
        setOpacity(1);
      }, 1000);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [IMAGES.length, isLoading]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center font-sans">
        <div className="animate-pulse text-white/50 text-2xl font-black tracking-widest">
          CARGANDO SISTEMA
        </div>
        <div className="text-white/20 text-sm mt-4 tracking-widest font-light">
          PRE-DESCARGANDO CONTENIDOS
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans group">
      {/* Background Image Slider - Pure CSS para evitar bloqueos del JS thread en TV */}
      <img
        key="single-image-renderer"
        src={IMAGES[imageIndex]}
        style={{ 
          opacity, 
          transition: "opacity 1s ease-in-out",
          willChange: "opacity" 
        }}
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt="background"
      />

      {/* Visual Texture removed to keep background at full color */}

      {/* Main Overlay Plane */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-12">
        {/* Top Header and Carousel */}
        <div className="w-full flex justify-between items-start pointer-events-auto">
          {/* Top Left Carousel */}
          <div className="scale-75 origin-top-left transition-all duration-1000 shadow-2xl rounded-xl">
            {mappedLogos.length > 0 ? (
              <LogoRolodex items={mappedLogos.map((src, i) => (
                <div key={i} className="h-full w-full bg-white flex items-center justify-center relative">
                  <img src={src} className="w-full h-full object-contain p-4 bg-white" alt="logo" />
                </div>
              ))} />
            ) : (
              <LogoRolodex items={[
                <div key={1} className="h-full w-full bg-black grid place-content-center text-3xl font-black text-white text-center">NO LOGOS</div>,
              ]} />
            )}
          </div>
          
          {/* Top Right USFQ Logo */}
          <div className="absolute top-6 right-8 bg-black py-4 px-10 rounded-2xl shadow-2xl border border-neutral-800">
            <img src={alumniLogo} alt="Alumni Logo" className="h-16 object-contain" />
          </div>
        </div>

        <div className="flex-1 w-full">
          {/* Center Content Empty (Letting Background Image Show) */}
        </div>

        {/* Footer Area Area is now empty as requested */}
        <div className="w-full h-10"></div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-6 right-6 z-50 p-4 bg-black/40 hover:bg-black/80 rounded-full text-white/30 hover:text-white transition-all duration-500 backdrop-blur-md opacity-20 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 cursor-pointer shadow-xl border border-white/5 hover:border-white/20 hover:scale-110 active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <SvgMinimize /> : <SvgMaximize />}
        </button>
      </div>
    </div>
  );
}
