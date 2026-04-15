import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoRolodex } from './components/ui/animated-logo-rolodex';
import { fetchDriveImages } from './lib/gdrive';
import alumniLogo from './assets/logos/ALUMNI_Blanco@3x.png';
import usfqBg from './assets/artes/usfq.jpg';

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
];

const CarouselColumn = ({ title, logos, colorStyle }: { title: string, logos: string[], colorStyle: React.CSSProperties }) => (
  <div className="flex flex-col items-center z-50 flex-1 mx-2 lg:mx-6">
    <h2 className="text-xl lg:text-[2rem] font-black tracking-[0.2em] lg:tracking-[0.4em] uppercase mb-6 lg:mb-10 text-center" style={colorStyle}>
      {title}
    </h2>
    <div className="w-full origin-center transition-all duration-1000 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-2xl flex justify-center">
      {logos.length > 0 ? (
        <LogoRolodex items={logos.map((src, i) => (
          <div key={i} className="h-full w-full bg-white flex items-center justify-center relative rounded-xl overflow-hidden shadow-inner">
            <img src={src} className="w-full h-full object-contain p-6 bg-white" alt={`${title} logo ${i}`} />
          </div>
        ))} />
      ) : (
        <LogoRolodex items={[
          <div key={1} className="h-full w-full bg-neutral-900 grid place-content-center text-xl font-black text-white/40 text-center rounded-xl">PRÓXIMAMENTE</div>,
        ]} />
      )}
    </div>
  </div>
);

export default function App() {
  const [displayPhase, setDisplayPhase] = useState<'cards' | 'dragons'>('cards');
  const [cardIndex, setCardIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [mappedArtes, setMappedArtes] = useState<string[]>([]);
  const [platinum, setPlatinum] = useState<string[]>([]);
  const [red, setRed] = useState<string[]>([]);
  const [golden, setGolden] = useState<string[]>([]);
  const [silver, setSilver] = useState<string[]>([]);

  useEffect(() => {
    async function loadImages() {
      const [artesRaw, platRaw, redRaw, goldRaw, silvRaw] = await Promise.all([
        fetchDriveImages('1GaYLdPvpyeMTAVjMhoEsy3q8aqOxoD4b'),
        fetchDriveImages('11I02dhti7MEmG5MOUo24nvjr-5iDEi4I'),
        fetchDriveImages('1XvYlQAwfophzuaK2suzvsJpPy-3knFu8'),
        fetchDriveImages('14hnNDGvQYt4uoCMiC7f4MY8icdkYEnDY'),
        fetchDriveImages('1CSqFvsCF9tz-m5J1hxTYD_8jJadQ-6wX'),
      ]);
      
      setMappedArtes(artesRaw);
      setPlatinum(platRaw);
      setRed(redRaw);
      setGolden(goldRaw);
      setSilver(silvRaw);

      // Preload all images so there are no delays during rendering and carousel transitions
      const allImagesToPreload = [...artesRaw, ...platRaw, ...redRaw, ...goldRaw, ...silvRaw];
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
    if (isLoading) return;

    if (displayPhase === 'cards') {
      const timer = setTimeout(() => {
        // Fade out
        setOpacity(0);
        setTimeout(() => {
          const nextIndex = cardIndex + 1;
          if (nextIndex >= IMAGES.length) {
            setCardIndex(0);
            setDisplayPhase('dragons');
          } else {
            setCardIndex(nextIndex);
          }
          // Fade in
          setOpacity(1);
        }, 1000);
      }, 10000);

      return () => clearTimeout(timer);
    } 
    else if (displayPhase === 'dragons') {
      const maxLogos = Math.max(platinum.length, red.length, golden.length, silver.length, 1);
      // Wait for one full cycle (Rolodex executes transition every 2500ms)
      const displayTime = maxLogos * 2500;

      const timer = setTimeout(() => {
        // Fade out
        setOpacity(0);
        setTimeout(() => {
          setDisplayPhase('cards');
          // Fade in
          setOpacity(1);
        }, 1000);
      }, displayTime);

      return () => clearTimeout(timer);
    }
  }, [cardIndex, displayPhase, isLoading, IMAGES.length, platinum.length, red.length, golden.length, silver.length]);

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
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center font-sans relative z-50">
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
      
      {/* ALUMNI Logo (Always Fixed on Top Right) */}
      <div className="absolute top-6 right-8 bg-black/50 backdrop-blur-md py-4 px-10 rounded-2xl shadow-2xl border border-white/10 z-[100] pointer-events-none transition-all">
        <img src={alumniLogo} alt="Alumni Logo" className="h-12 md:h-16 object-contain drop-shadow-lg" />
      </div>

      {/* PHASE 1: CARDS */}
      <div 
        className="absolute inset-0 w-full h-full z-10"
        style={{
           opacity: displayPhase === 'cards' ? opacity : 0,
           transition: "opacity 1s ease-in-out",
           visibility: (displayPhase === 'cards' || opacity > 0) ? 'visible' : 'hidden'
        }}
      >
        <img
          key="single-image-renderer"
          src={IMAGES[cardIndex]}
          style={{ willChange: "opacity" }}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="background"
        />
      </div>

      {/* PHASE 2: OUR DRAGONS */}
      <div
        className="absolute inset-0 w-full h-full z-20 flex flex-col items-center justify-center space-y-16 lg:space-y-24 px-8"
        style={{
           opacity: displayPhase === 'dragons' ? opacity : 0,
           transition: "opacity 1s ease-in-out",
           pointerEvents: displayPhase === 'dragons' ? 'auto' : 'none',
           visibility: (displayPhase === 'dragons' || opacity > 0) ? 'visible' : 'hidden'
        }}
      >
          {/* Background USFQ image with dark overlay */}
          <div className="absolute inset-0 z-0 bg-black">
            <img src={usfqBg} className="w-full h-full object-cover opacity-50" alt="usfq background" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          </div>

          {/* Dragons Title - Using solid text styles for TV compatibility (bg-clip-text fails on Tizen) */}
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black uppercase z-50 text-center" 
              style={{ color: '#ffffff', letterSpacing: '0.2em', textShadow: '0px 4px 20px rgba(0,0,0,0.8), 0px 0px 30px rgba(250,204,21,0.6)' }}>
            OUR DRAGONS
          </h1>
          
          {/* We use Flexbox instead of Grid because legacy smart TVs do not support CSS Grid well */}
          <div className="flex flex-row justify-center items-center w-full max-w-[100rem]">
             {displayPhase === 'dragons' && (
               <>
                 <CarouselColumn title="PLATINUM" logos={platinum} colorStyle={{ color: '#E5E4E2', textShadow: '0 0 15px rgba(229,228,226,0.6)' }} />
                 <CarouselColumn title="RED" logos={red} colorStyle={{ color: '#ef4444', textShadow: '0 0 15px rgba(239,68,68,0.6)' }} />
                 <CarouselColumn title="GOLDEN" logos={golden} colorStyle={{ color: '#fbbf24', textShadow: '0 0 15px rgba(251,191,36,0.6)' }} />
                 <CarouselColumn title="SILVER" logos={silver} colorStyle={{ color: '#9ca3af', textShadow: '0 0 15px rgba(156,163,175,0.6)' }} />
               </>
             )}
          </div>
      </div>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-6 right-6 z-[100] p-4 bg-black/40 hover:bg-black/80 rounded-full text-white/30 hover:text-white transition-all duration-500 backdrop-blur-md opacity-20 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 cursor-pointer shadow-xl border border-white/5 hover:border-white/20 hover:scale-110 active:scale-95"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <SvgMinimize /> : <SvgMaximize />}
      </button>
    </div>
  );
}
