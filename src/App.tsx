import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoRolodex } from './components/ui/animated-logo-rolodex';
import alumniLogo from './assets/logos/ALUMNI_Blanco@3x.png';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* Background Image Slider */}
      <AnimatePresence>
        <motion.img
          key={currentImage}
          src={IMAGES[currentImage]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }} // 2 seconds cross fade
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

      </div>
    </div>
  );
}
