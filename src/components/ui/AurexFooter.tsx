import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Twitter, Github, Mail, MapPin, Phone, Camera, PackageOpen } from 'lucide-react';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

// "Shot on AUREX ONE" gallery — real Unsplash DSLR-quality photos
const galleryImages = [
  // ROW 1
  {
    // LEFT: SUNRISE
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    caption: 'Morning Valley, Yosemite',
    photographer: 'Elena R.',
  },
  {
    // MIDDLE: AFTERNOON
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    caption: 'Lake Braies, Italy',
    photographer: 'James K.',
  },
  {
    // RIGHT: NIGHT
    src: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=600&q=80',
    caption: 'Galactic Core over the Rockies',
    photographer: 'Paul E.',
  },
  
  // ROW 2
  {
    // LEFT: SUNRISE
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    caption: 'Morning Mist, Dolomites',
    photographer: 'Marcus T.',
  },
  {
    // MIDDLE: AFTERNOON
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80',
    caption: 'Autumn Fields, Vermont',
    photographer: 'Sofia L.',
  },
  {
    // RIGHT: NIGHT
    src: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=600&q=80',
    caption: 'Night Sky Symphony',
    photographer: 'Vincent C.',
  },
];

const footerColumns = [
  {
    title: 'Products',
    links: ['AUREX ONE', 'AUREX Lenses', 'Accessories', 'Compare Cameras', 'AUREX Care'],
  },
  {
    title: 'Support',
    links: ['Firmware Updates', 'Contact Support', 'Warranty Info', 'User Manuals', 'Community'],
  },
  {
    title: 'Company',
    links: ['About AUREX', 'Careers', 'Press Room', 'Investors', 'Blog'],
  },
];

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
];

const contactInfo = [
  { icon: Mail, text: 'support@aurex.camera' },
  { icon: Phone, text: '+1 (800) 287-3901' },
  { icon: MapPin, text: 'San Francisco, CA, USA' },
];

const legalLinks = ['Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Accessibility'];

export default function AurexFooter() {
  const galleryInView = useInView(0.1);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="w-full bg-[#050505] relative z-30">
      
      {/* ── "Shot on AUREX ONE" Gallery ── */}
      <div id="gallery" className="border-t border-white/5 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary">
                Shot on AUREX ONE
              </span>
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Captured by Our Community
            </h3>
            <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
              Every frame tells a story. See what photographers around the world are creating with AUREX ONE.
            </p>
          </div>

          <div ref={galleryInView.ref} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 overflow-hidden py-4">
            {galleryImages.map((img, idx) => {
              // Determine initial offset based on column (0: left, 1: middle, 2: right)
              let transformClass = "";
              if (!galleryInView.isVisible) {
                if (idx % 3 === 0) transformClass = "-translate-x-24 opacity-0";
                else if (idx % 3 === 1) transformClass = "translate-y-24 opacity-0";
                else transformClass = "translate-x-24 opacity-0";
              } else {
                transformClass = "translate-x-0 translate-y-0 opacity-100";
              }

              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformClass}`}
                  style={{ transitionDelay: `${Math.floor(idx / 3) * 150}ms` }}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-semibold">{img.caption}</p>
                    <p className="text-white/60 text-xs mt-0.5">by {img.photographer}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Camera className="w-3 h-3 text-primary" />
                      <span className="text-[9px] text-primary font-mono uppercase tracking-widest">
                        Shot on AUREX ONE
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Community Newsletter Parallax Section ── */}
      <div className="border-t border-white/5 overflow-hidden relative bg-[#0a0a0a]">
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
           {/* Glass Container */}
           <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {/* Center Radial Glow for depth */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.06] via-transparent to-transparent pointer-events-none" />

              <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-center min-h-[450px] md:min-h-[400px] p-4 md:p-6 lg:p-10">
              
              {/* Left Column - Scrolls Down */}
              <div className="relative h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden opacity-40 md:opacity-100" 
                   style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
                  <div className="absolute top-[-840px] left-0 right-0 flex flex-col gap-6" 
                       style={{ transform: `translateY(${(scrollY * 0.45) % 840}px)` }}>
                     {/* Tripled the images to allow infinite modulo scroll */}
                     {[0, 1, 2].map((i) => (
                        <React.Fragment key={`left-${i}`}>
                           <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Aurex DSLR setup" />
                           <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Lens collection" />
                           <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Camera focus" />
                        </React.Fragment>
                     ))}
                  </div>
              </div>

              {/* Center Text (Overlay on Mobile, Column on Desktop) */}
              <div className="absolute inset-0 md:static flex flex-col items-center justify-center text-center z-10 px-4 md:px-2 lg:px-4 pointer-events-none md:pointer-events-auto">
                 <div className="bg-[#050505]/70 md:bg-transparent backdrop-blur-[24px] md:backdrop-blur-none border border-white/10 md:border-none p-8 md:p-0 rounded-3xl md:rounded-none w-[90%] md:w-full mx-auto shadow-2xl md:shadow-none pointer-events-auto">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                       Join The<br className="hidden md:block"/> Community
                    </h2>
                    <p className="text-white/80 md:text-white/50 text-sm mb-10 leading-relaxed max-w-sm mx-auto">
                       Stay ahead with exclusive updates, insights, and tips sharing design, development, and marketing. Sign up now to be part of the future.
                    </p>
                    
                    <div className="relative w-full max-w-[420px] mx-auto bg-white/[0.05] md:bg-white/[0.03] border border-white/10 md:border-white/5 backdrop-blur-md rounded-full flex items-center p-2 shadow-2xl transition-all hover:bg-white/[0.08] focus-within:bg-white/[0.08] focus-within:border-white/30">
                       <input 
                          type="email" 
                          placeholder="Email" 
                          className="flex-1 bg-transparent px-5 py-2 text-sm text-white placeholder:text-gray-300 md:placeholder:text-gray-500 outline-none w-full"
                       />
                       <button className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-2.5 rounded-full text-sm font-bold shadow-md z-10 whitespace-nowrap">
                          Subscribe
                       </button>
                    </div>
                 </div>
              </div>

              {/* Right Column - Scrolls Up */}
              <div className="relative h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden opacity-40 md:opacity-100" 
                   style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
                  <div className="absolute top-[0px] left-0 right-0 flex flex-col gap-6" 
                       style={{ transform: `translateY(-${(scrollY * 0.45) % 840}px)` }}>
                     {/* Tripled the images to allow infinite modulo scroll */}
                     {[0, 1, 2].map((i) => (
                        <React.Fragment key={`right-${i}`}>
                           <img src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Vintage lens" />
                           <img src="https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Flash photography" />
                           <img src="https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=400&q=80" className="w-full h-64 object-cover rounded-2xl border border-white/10" alt="Macro lens" />
                        </React.Fragment>
                     ))}
                  </div>
              </div>

              </div>
           </div>
        </div>
      </div>

      {/* ── Footer Columns ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 mb-12">
            
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xl font-bold text-white tracking-[0.15em]">AUREX</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
                Pioneering the future of optical engineering and digital capture technologies for professionals worldwide.
              </p>
              
              {/* Social links */}
              <div className="flex gap-3 mb-8">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Contact info */}
              <ul className="space-y-3 mb-8">
                {contactInfo.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary/70 shrink-0" />
                    <span className="text-white/40 text-xs">{text}</span>
                  </li>
                ))}
              </ul>

              {/* Highlighted Track Order */}
              <a href="/track-order" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500/10 border border-orange-500/50 hover:bg-orange-500 hover:border-orange-500 text-orange-500 hover:text-white transition-all rounded-lg text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                 <PackageOpen className="w-4 h-4" /> Track Your Order
              </a>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((text) => (
                    <li key={text}>
                      <a
                        href="#"
                        className="text-white/40 text-sm hover:text-primary transition-colors duration-200"
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs">
              &copy; {new Date().getFullYear()} AUREX Imaging Corp. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              {legalLinks.map((text) => (
                <a
                  key={text}
                  href="#"
                  className="text-white/25 text-xs hover:text-white/50 transition-colors"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
