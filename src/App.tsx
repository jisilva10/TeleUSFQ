import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoRolodex } from './components/ui/animated-logo-rolodex';
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

const arteUrls = import.meta.glob<{ default: string }>('@/assets/artes/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const MAPPED_ARTES = Object.values(arteUrls).map(mod => mod.default);

const logoUrls = import.meta.glob<{ default: string }>('@/assets/logos/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const MAPPED_LOGOS = Object.values(logoUrls).map(mod => mod.default);

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2941&auto=format&fit=crop"
];

const IMAGES = MAPPED_ARTES.length > 0 ? MAPPED_ARTES : FALLBACK_IMAGES;

export default function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans group">
      {/* Background Image Slider */}
      <AnimatePresence>
        <MotionImg
          key={currentImage}
          src={IMAGES[currentImage]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }} // Reducido a 1 segundo para evitar OOM de memoria GPU en la TV
          style={{ willChange: "opacity" }}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      {/* Visual Texture removed to keep background at full color */}

      {/* Main Overlay Plane */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-12">
        {/* Top Header and Carousel */}
        <div className="w-full flex justify-between items-start pointer-events-auto">
          {/* Top Left Carousel */}
          <div className="scale-75 origin-top-left transition-all duration-1000">
            {MAPPED_LOGOS.length > 0 ? (
              <LogoRolodex items={MAPPED_LOGOS.map((src, i) => (
                <div key={i} className="grid h-36 w-52 place-content-center rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden relative">
                  <img src={src} className="absolute inset-0 w-full h-full object-contain p-4 bg-white" alt="logo" />
                </div>
              ))} />
            ) : (
              <LogoRolodex items={[
                <div key={1} className="grid h-36 w-52 place-content-center rounded-lg bg-red-600 text-3xl font-black text-white text-center">AGREGA<br/>LOGOS</div>,
                <div key={2} className="grid h-36 w-52 place-content-center rounded-lg bg-white text-3xl font-black text-black text-center">A LA<br/>CARPETA</div>
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
