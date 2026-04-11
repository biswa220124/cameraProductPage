import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Image as ImageIcon, ShoppingCart, ShoppingBag } from 'lucide-react';
import cameraImg from '@/assets/camera-main.png';
import AnnotationOverlay from '@/components/AnnotationOverlay';
import ProgressBar from '@/components/ProgressBar';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i+1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);
  return <>{displayed}</>;
};

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'hero', label: 'INTRO' },
  { id: 'lens', label: 'LENS' },
  { id: 'viewfinder', label: 'EVF' },
  { id: 'shutter', label: 'SHUTTER' },
  { id: 'sensor', label: 'SENSOR' },
  { id: 'body', label: 'BODY' },
  { id: 'dial', label: 'CONTROLS' },
];

// Annotation positions on the camera image (percentage-based)
const ANNOTATIONS = [
  { id: 'lens', label: 'Lens System', x: 30, y: 65, side: 'left' as const },
  { id: 'viewfinder', label: 'Electronic Viewfinder', x: 62, y: 15, side: 'right' as const },
  { id: 'shutter', label: 'Shutter Button', x: 25, y: 22, side: 'left' as const },
  { id: 'sensor', label: 'Full-Frame Sensor', x: 50, y: 50, side: 'right' as const },
  { id: 'body', label: 'Body & Build', x: 75, y: 55, side: 'right' as const },
  { id: 'dial', label: 'Mode & Control Dials', x: 42, y: 12, side: 'left' as const },
];

const SPECS: Record<string, { label: string; value: string }[]> = {
  lens: [
    { label: 'Focal Length', value: '24-70mm f/2.8' },
    { label: 'Elements', value: '18 elements / 13 groups' },
    { label: 'Coating', value: 'Nano Crystal AR' },
    { label: 'Min Focus', value: '0.38m' },
    { label: 'Filter', value: '82mm' },
  ],
  viewfinder: [
    { label: 'Resolution', value: '5.76M dots OLED' },
    { label: 'Magnification', value: '0.76x' },
    { label: 'Refresh', value: '120fps' },
    { label: 'Diopter', value: '-4 to +2 m⁻¹' },
    { label: 'Blackout', value: 'Zero blackout' },
  ],
  shutter: [
    { label: 'Mechanical', value: '1/8000s – 60s' },
    { label: 'Electronic', value: '1/32000s' },
    { label: 'Sync', value: '1/250s' },
    { label: 'Durability', value: '500K cycles' },
    { label: 'Burst', value: '20 fps' },
  ],
  sensor: [
    { label: 'Resolution', value: '61.0 Megapixels' },
    { label: 'Size', value: '35.7 × 23.8 mm' },
    { label: 'ISO', value: '64 – 102,400' },
    { label: 'Dynamic Range', value: '15.0 EV' },
    { label: 'Bit Depth', value: '14-bit RAW' },
  ],
  body: [
    { label: 'Material', value: 'Magnesium alloy' },
    { label: 'Weight', value: '650g body only' },
    { label: 'Sealing', value: 'IP67 rated' },
    { label: 'IBIS', value: '5-axis, 8 stops' },
    { label: 'Finish', value: 'Ceramic coating' },
  ],
  dial: [
    { label: 'Modes', value: 'P / A / S / M / Custom' },
    { label: 'Custom', value: '3 programmable dials' },
    { label: 'Rear Dial', value: 'Click-less option' },
    { label: 'Fn Buttons', value: '4 customizable' },
    { label: 'Joystick', value: 'Multi-selector AF' },
  ],
};

// Map scroll sections to annotation IDs
const SECTION_TO_ANNOTATION: Record<number, string | null> = {
  0: null,      // hero
  1: 'lens',
  2: 'viewfinder',
  3: 'shutter',
  4: 'sensor',
  5: 'body',
  6: 'dial',
};

// Hook for scroll-triggered entrance animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

export default function Index() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPastAnimation, setIsPastAnimation] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [specsMousePos, setSpecsMousePos] = useState({ x: 500, y: 500 });
  const specsInView = useInView(0.08);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    alert("Added to cart!");
  };

  useEffect(() => {
    if (localStorage.getItem('hasVisitedAurex') === 'true') {
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showWelcome]);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisitedAurex', 'true');
    const overlay = document.querySelector('.welcome-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setShowWelcome(false),
      });
    } else {
      setShowWelcome(false);
    }
  };

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = window.scrollY;
    // Cap 3D scroll progress exactly at the end of the 8 spacer sections
    const maxScrollForAnimation = (SECTIONS.length - 1) * window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollTop / maxScrollForAnimation));
    setScrollProgress(progress);
    setActiveSection(Math.min(SECTIONS.length - 1, Math.floor(progress * SECTIONS.length)));
    setIsPastAnimation(scrollTop > maxScrollForAnimation + 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Camera rotation based on scroll — flat on hero, rotates after first scroll
  const scrollIntoFeatures = Math.max(0, (scrollProgress * SECTIONS.length - 1) / (SECTIONS.length - 1)); // 0 during hero, ramps 0→1 during features
  const rotateY = -15 + scrollIntoFeatures * 30; // starts at -15, goes to 15
  const rotateX = 5 - scrollIntoFeatures * 10;
  const heroScale = activeSection === 0 ? 1 : 0.85 + Math.sin(scrollProgress * Math.PI) * 0.15;
  const heroRotateY = activeSection === 0 ? 0 : rotateY;
  const heroRotateX = activeSection === 0 ? 0 : rotateX;
  const activeAnnotation = SECTION_TO_ANNOTATION[activeSection] || null;

  // Section title/subtitle that shows on the side
  const sectionMeta: Record<number, { num: string; title: string; desc: string }> = {
    1: { num: '01', title: 'Precision Optics', desc: 'Multi-coated glass for unmatched clarity and color accuracy.' },
    2: { num: '02', title: 'Electronic Viewfinder', desc: 'See your image exactly as it will be captured, in real time.' },
    3: { num: '03', title: 'Hybrid Shutter', desc: 'Mechanical precision meets electronic speed. Silent when you need it.' },
    4: { num: '04', title: 'BSI CMOS Sensor', desc: 'Back-illuminated full-frame sensor with extraordinary dynamic range.' },
    5: { num: '05', title: 'Built to Endure', desc: 'Weather-sealed magnesium alloy body with 5-axis stabilization.' },
    6: { num: '06', title: 'Intuitive Controls', desc: 'Every dial and button placed for instinctive operation.' },
  };

  const currentMeta = sectionMeta[activeSection];

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Welcome Screen Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background welcome-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-gradient-primary">
              AUREX ONE
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-lg mb-10 leading-relaxed">
              Experience the pinnacle of optical engineering. An entirely new way to capture the world.
            </p>
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-3 bg-transparent text-primary overflow-hidden border border-primary/50 hover:border-primary transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
              <span className="relative z-10 font-mono-code tracking-[0.2em] text-sm group-hover:text-primary-foreground transition-colors duration-500 flex items-center gap-2 uppercase">
                Get Started
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrow — UP on LEFT side */}
      <button
        onClick={() => {
          const target = Math.max(0, activeSection - 1);
          window.scrollTo({ top: target * window.innerHeight, behavior: 'smooth' });
        }}
        className={`fixed left-6 md:left-10 bottom-1/2 translate-y-1/2 z-[85] w-12 h-12 flex items-center justify-center rounded-full bg-background/80 border border-border/80 backdrop-blur hover:bg-white/10 hover:border-primary transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPastAnimation || showWelcome || activeSection === 0 ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 hover:scale-110'}`}
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Navigation Arrow — DOWN on RIGHT side */}
      <button
        onClick={() => {
          if (isPastAnimation) {
            const specsEl = document.getElementById('specs');
            if (specsEl) specsEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            const target = Math.min(SECTIONS.length - 1, activeSection + 1);
            window.scrollTo({ top: target * window.innerHeight, behavior: 'smooth' });
          }
        }}
        className={`fixed right-6 md:right-10 bottom-1/2 translate-y-1/2 z-[85] w-12 h-12 flex items-center justify-center rounded-full bg-background/80 border border-border/80 backdrop-blur hover:bg-white/10 hover:border-primary transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPastAnimation || showWelcome ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 hover:scale-110'}`}
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Fixed camera view */}
      <div 
        className={`fixed inset-0 z-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${isPastAnimation ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
        style={{ perspective: '1200px' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, hsl(24 80% 53% / 0.06) 0%, transparent 70%)`,
          }}
        />

        {/* Camera image with 3D transform */}
        <div
          className="relative transition-all duration-700 ease-out"
          style={{
            transform: `translateX(${activeSection === 0 ? '-20vw' : '0px'}) rotateY(${heroRotateY}deg) rotateX(${heroRotateX}deg) scale(${heroScale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src={cameraImg}
            alt="AUREX ONE Camera"
            width={560}
            height={560}
            className="w-[350px] md:w-[500px] lg:w-[560px] drop-shadow-2xl select-none"
            draggable={false}
          />

          {/* Annotation dots and lines */}
          <AnnotationOverlay
            annotations={ANNOTATIONS}
            activeId={activeAnnotation}
            specs={SPECS}
          />
        </div>
      </div>

      {/* Scroll content */}
      <div className="relative z-10 pointer-events-none">
        {/* HERO — camera on left, text on right with sequential animation */}
        <section className="h-screen flex items-center justify-end pr-10 md:pr-20 lg:pr-28">
          <div className={`text-right max-w-md transition-all duration-1000 ${activeSection === 0 ? 'opacity-100' : 'opacity-0 blur-xl scale-110 -translate-y-8'}`}>
            <p className="font-mono-code text-xs tracking-[0.5em] text-primary mb-4 h-[20px] flex items-center justify-end">
              {activeSection === 0 && <TypewriterText text="INTRODUCING" delay={500} />}
              {activeSection === 0 && <span className="w-1 h-3 bg-primary ml-1 animate-pulse"></span>}
            </p>
            {/* AUREX appears after INTRODUCING finishes (~500ms delay + 11 chars * 100ms = 1600ms) */}
            <h1 className="text-6xl md:text-[10rem] font-bold text-foreground/[0.06] leading-none select-none transition-all duration-700" style={{ opacity: activeSection === 0 ? 1 : 0, filter: activeSection === 0 ? 'blur(0px)' : 'blur(12px)', transitionDelay: '1800ms' }}>AUREX</h1>
            {/* ONE appears 300ms after AUREX */}
            <h2 className="text-3xl md:text-6xl font-bold text-foreground -mt-2 md:-mt-6 transition-all duration-700" style={{ opacity: activeSection === 0 ? 1 : 0, filter: activeSection === 0 ? 'blur(0px)' : 'blur(12px)', transitionDelay: '2100ms' }}>ONE</h2>
            {/* Subtitle appears after title */}
            <p className="text-muted-foreground text-sm mt-6 max-w-sm ml-auto transition-all duration-700" style={{ opacity: activeSection === 0 ? 1 : 0, transitionDelay: '2500ms' }}>
              A masterpiece of optical engineering. Scroll to explore every detail.
            </p>
            <div className="mt-10 flex justify-end animate-bounce transition-all duration-700" style={{ opacity: activeSection === 0 ? 1 : 0, transitionDelay: '2800ms' }}>
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Feature sections — each one is a scroll spacer with side text */}
        {[1, 2, 3, 4, 5, 6].map((i) => {
          const meta = sectionMeta[i];
          const isLeft = i % 2 === 1;
          return (
            <section key={i} className="h-screen flex items-center px-6 md:px-16">
              <div
                className={`max-w-xs transition-all duration-700 ${
                  activeSection === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isLeft ? 'mr-auto' : 'ml-auto'}`}
              >
                <span className="font-mono-code text-xs tracking-[0.3em] text-primary">{meta.num}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-1 mb-3">{meta.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{meta.desc}</p>
                <div className="mt-4 w-12 h-[1px] bg-primary/40" />
              </div>
            </section>
          );
        })}
      </div>

      {/* FULL SPECS & CART SECTION */}
      <div 
        ref={specsInView.ref as any}
        id="specs" 
        className="relative z-20 bg-background border-t border-border/50 pointer-events-auto overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,1)]"
      >
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Subtle breathing orbs */}
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDuration: '11s' }}></div>
          <div className="absolute bottom-[20%] left-[30%] w-[700px] h-[700px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto py-24 px-6 md:px-12">
          <div className={`text-center mb-20 transition-all duration-700 ease-out ${specsInView.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-mono-code text-xs tracking-[0.4em] uppercase text-primary mb-3 block">
              — Detailed Specifications —
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              AUREX ONE TECH SPECS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {Object.entries(SPECS).map(([category, items], catIdx) => (
              <div 
                key={category}
                className={`transition-all duration-700 ease-out ${specsInView.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: specsInView.isVisible ? `${200 + catIdx * 150}ms` : '0ms' }}
              >
                <h3 className="text-xl font-bold mb-6 text-foreground uppercase border-b border-border pb-3 tracking-wider">
                  {category}
                </h3>
                <div className="space-y-4">
                  {items.map((spec, i) => (
                    <div 
                      key={i} 
                      className={`flex justify-between items-baseline gap-4 group transition-all duration-500 ease-out ${specsInView.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: specsInView.isVisible ? `${350 + catIdx * 150 + i * 100}ms` : '0ms' }}
                    >
                      <span className="text-muted-foreground font-mono-code text-sm">
                        {spec.label}
                      </span>
                      <div className="flex-1 border-b border-dashed border-border/50 group-hover:border-primary/50 transition-colors"></div>
                      <span className="text-foreground text-sm text-right max-w-[55%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buy Now Section - Minimal format */}
          <div id="buy-now" className="mt-24 pt-12 border-t border-border/30 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-2">AUREX ONE</h3>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-muted-foreground line-through text-sm">$4,299.00</span>
              <span className="text-3xl font-bold text-foreground">$3,499.00</span>
            </div>
            
            <button onClick={() => navigate('/checkout')} className="px-8 py-3 bg-primary text-primary-foreground font-mono-code text-sm tracking-wider hover:bg-primary/90 transition-colors uppercase rounded-sm cursor-pointer">
              Buy Now
            </button>
            <p className="text-muted-foreground text-xs mt-4">Includes 1-year extended AUREX Care plan & extra battery.</p>

            {/* Scroll to Accessories Button */}
            <button 
              onClick={() => {
                const accEl = document.getElementById('accessories');
                if (accEl) accEl.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="mt-16 text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent outline-none pb-4"
            >
              <span className="text-[10px] uppercase tracking-widest font-mono-code">Explore Accessories</span>
              <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Accessories Section — White, Minimal */}
      <div id="accessories" className="w-full bg-white pt-24 pb-32 border-y border-gray-200 relative z-30">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-gray-400 mb-3 block">
              — Enhance Your Setup —
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-black">Essential Accessories</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 overflow-visible pt-8">
            {[
              { 
                name: "AUREX Prime 50mm f/1.4", 
                price: "$899.00", 
                img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400",
                specs: [
                  { label: "Focal Length", value: "50mm" },
                  { label: "Max Aperture", value: "f/1.4" },
                  { label: "Elements", value: "11 elements / 9 groups" },
                  { label: "Filter Size", value: "72mm" },
                  { label: "Weight", value: "520g" },
                ]
              },
              { 
                name: "Premium Leather Case", 
                price: "$129.00", 
                img: "https://images.unsplash.com/photo-1544007380-4965adba2cf3?auto=format&fit=crop&q=80&w=400&h=400",
                specs: [
                  { label: "Material", value: "Full-grain Calf Leather" },
                  { label: "Base", value: "CNC Aluminum plate" },
                  { label: "Tripod Mount", value: '1/4" Direct' },
                  { label: "Battery Access", value: "Yes, bottom door" },
                  { label: "Strap Lugs", value: "Brass eyelets" },
                ]
              },
              { 
                name: "Pro SDXC Memory Card", 
                price: "$149.00", 
                img: "https://images.unsplash.com/photo-1624434207284-7a1314867c29?auto=format&fit=crop&q=80&w=400&h=400",
                specs: [
                  { label: "Capacity", value: "256GB" },
                  { label: "Speed Class", value: "UHS-II V90" },
                  { label: "Read Speed", value: "300 MB/s max" },
                  { label: "Write Speed", value: "290 MB/s max" },
                  { label: "Compatibility", value: "SD / SDXC / UHS-II" },
                ]
              },
              { 
                name: "Carbon Travel Tripod", 
                price: "$299.00", 
                img: "https://images.unsplash.com/photo-1527011045974-4ec3d11bfc72?auto=format&fit=crop&q=80&w=400&h=400",
                specs: [
                  { label: "Material", value: "10-Layer Carbon Fiber" },
                  { label: "Max Height", value: "155 cm" },
                  { label: "Folded Length", value: "40 cm" },
                  { label: "Weight", value: "1.2 kg" },
                  { label: "Max Load", value: "18 kg" },
                ]
              },
              { 
                name: "BP-FZ100 Battery Pack", 
                price: "$79.00", 
                img: "https://images.unsplash.com/photo-1622323201404-58a44afb639a?auto=format&fit=crop&q=80&w=400&h=400",
                specs: [
                  { label: "Chemistry", value: "Lithium-Ion" },
                  { label: "Capacity", value: "2280 mAh" },
                  { label: "Voltage", value: "7.2V" },
                  { label: "Shot Life", value: "~600 shots" },
                  { label: "Charge Time", value: "~2.5 hours" },
                ]
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center relative group cursor-pointer"
                style={{ isolation: 'isolate' }}
              >
                {/* Specs Popup on Hover — centered with backdrop blur */}
                <div
                  className="
                    pointer-events-none
                    absolute left-1/2 -translate-x-1/2
                    bottom-[calc(100%+16px)]
                    w-[260px]
                    z-[200]
                    opacity-0 scale-95 translate-y-3
                    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out
                  "
                >
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-2xl bg-white/80" style={{ backdropFilter: 'blur(20px) saturate(1.8)' }}>
                    <div className="w-full h-32 overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <span className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">Tech Specs</span>
                      <ul className="space-y-2">
                        {item.specs.map((spec, sIdx) => (
                          <li key={sIdx} className="flex justify-between items-baseline gap-2">
                            <span className="text-[10px] text-gray-400 font-mono-code whitespace-nowrap">{spec.label}</span>
                            <span className="text-[10px] text-black font-semibold font-mono-code text-right leading-tight">{spec.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mx-auto w-3 h-3 rotate-45 border-b border-r border-gray-200 bg-white/80" style={{ marginTop: '-7px' }} />
                </div>

                {/* Rounded product circle */}
                <div className="w-20 h-20 mb-4 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500 ease-out ring-2 ring-gray-200 group-hover:ring-black/20 group-hover:shadow-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h4 className="font-semibold text-xs text-black mb-1 line-clamp-2 min-h-[32px] leading-tight">{item.name}</h4>
                <p className="text-gray-500 font-mono-code text-[11px] mb-4">{item.price}</p>
                <button
                  onClick={handleAddToCart}
                  className="px-5 py-2 bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-full cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section (Dark) */}
      <div id="testimonials" className="w-full bg-[#050505] pt-24 pb-32 relative z-30">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-primary mb-3 block">
              — Trusted by Professionals —
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-white">What They Say</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The AUREX ONE has completely transformed how I shoot. The dynamic range is unlike anything else on the market, and the autofocus is almost precognitive.",
                author: "Elena R.",
                role: "Fashion Photographer"
              },
              {
                quote: "Built like a tank but handles like a sports car. I've dragged it through rainforests and deserts, and it hasn't skipped a single frame.",
                author: "Marcus T.",
                role: "Adventure Journalist"
              },
              {
                quote: "Finally, a camera that doesn't get in the way of my vision. The hybrid viewfinder gives me the best of both worlds, bridging analog feel with digital power.",
                author: "David K.",
                role: "Cinematographer"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-border/20 p-8 rounded-sm hover:border-primary/40 transition-colors flex flex-col justify-between shadow-2xl">
                <div className="mb-6">
                  <svg className="w-8 h-8 text-primary/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[#a1a1aa] leading-relaxed text-sm italic">"{testimonial.quote}"</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{testimonial.author}</h4>
                  <p className="font-mono-code text-[10px] text-primary mt-1 uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section (White Contrast) */}
      <div id="contact" className="w-full bg-white text-black pt-24 pb-32 border-y border-white/20 relative z-30">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-primary mb-3 block">
              — Get in Touch —
            </span>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-black">Contact Us</h3>
          </div>
          <div className="max-w-2xl mx-auto">
            <form 
              className="bg-gray-50 border border-gray-200 p-8 rounded-sm shadow-xl space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for reaching out! We will get back to you shortly.");
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-gray-500 mb-2 uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-white border border-gray-200 focus:border-primary/70 focus:ring-1 focus:ring-primary/70 outline-none px-4 py-3 rounded-sm transition-all text-sm text-black placeholder:text-gray-400"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-gray-500 mb-2 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-white border border-gray-200 focus:border-primary/70 focus:ring-1 focus:ring-primary/70 outline-none px-4 py-3 rounded-sm transition-all text-sm text-black placeholder:text-gray-400"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono-code text-gray-500 mb-2 uppercase tracking-wider">Message</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full bg-white border border-gray-200 focus:border-primary/70 focus:ring-1 focus:ring-primary/70 outline-none px-4 py-3 rounded-sm transition-all text-sm text-black resize-none placeholder:text-gray-400"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-black text-white font-mono-code text-sm tracking-widest hover:bg-primary transition-colors uppercase rounded-sm cursor-pointer shadow-md hover:shadow-primary/50"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-[#050505] border-t border-border/30 pt-16 pb-8 px-6 md:px-12 mt-12 relative z-30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border/20 pb-12">
            
            {/* Brand */}
            <div className="md:col-span-1">
              <h2 className="font-bold text-2xl tracking-[0.2em] text-foreground mb-4">AUREX</h2>
              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6">
                Pioneering the future of optical engineering and digital capture technologies for professionals worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#111] border border-border/40 flex items-center justify-center text-[#a1a1aa] hover:text-primary hover:border-primary transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#111] border border-border/40 flex items-center justify-center text-[#a1a1aa] hover:text-primary hover:border-primary transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Products</h4>
              <ul className="space-y-3 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-primary transition-colors">AUREX ONE</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AUREX Lenses</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compare Cameras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-primary transition-colors">Firmware Updates</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Warranty Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">User Manuals</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-primary transition-colors">About AUREX</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press Room</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Investors</a></li>
              </ul>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#52525b]">
            <p>&copy; {new Date().getFullYear()} AUREX Imaging Corp. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#a1a1aa] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#a1a1aa] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#a1a1aa] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </footer>

      {/* Progress bar */}
      <div className={`transition-opacity duration-500 ease-in-out pointer-events-none ${isPastAnimation ? 'opacity-0' : 'opacity-100'}`}>
        <ProgressBar
          progress={scrollProgress}
          sections={SECTIONS.map((s) => s.label)}
          activeIndex={activeSection}
        />
      </div>

      {/* Logo */}
      <div className="fixed top-0 left-0 right-0 z-[90] pointer-events-none p-6 md:px-12 flex justify-between items-start">
        <div className="font-bold text-sm tracking-[0.2em] text-foreground pointer-events-auto mix-blend-difference">
          AUREX
        </div>
      </div>
        
      {/* Horizontal Nav (Visible during scroll) */}
      <nav className={`fixed z-[90] pointer-events-auto hidden md:flex items-center gap-2 p-1.5 rounded-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out top-6 right-6 ${
        isPastAnimation ? 'opacity-0 translate-x-12 pointer-events-none' : 'opacity-100 translate-x-0'
      }`}>
        <button 
          onClick={() => {
            const specEl = document.getElementById('specs');
            if (specEl) specEl.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="text-[11px] px-5 py-2.5 text-muted-foreground font-mono-code tracking-wider cursor-pointer hover:text-white hover:bg-white/5 transition-all rounded-full border-none outline-none uppercase"
        >
          Specs
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('testimonials');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-[11px] px-5 py-2.5 text-muted-foreground font-mono-code tracking-wider cursor-pointer hover:text-white hover:bg-white/5 transition-all rounded-full border-none outline-none uppercase"
        >
          Gallery
        </button>
        
        {cartCount > 0 && (
          <button 
            onClick={() => navigate('/checkout')} 
            className="px-4 py-1.5 flex items-center gap-2 bg-[#1a1a1c] border border-white/5 hover:bg-white/10 text-white font-mono-code text-[11px] tracking-wider transition-all rounded-full cursor-pointer uppercase outline-none"
          >
            Cart
            <span className="bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
              {cartCount}
            </span>
          </button>
        )}

        <button 
          onClick={() => navigate('/checkout')} 
          className="text-[11px] px-6 py-2.5 bg-primary/90 hover:bg-primary text-primary-foreground font-bold font-mono-code tracking-wider transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] rounded-full cursor-pointer whitespace-nowrap outline-none uppercase ml-1"
        >
          Buy Now
        </button>
      </nav>

      {/* Vertical Icon Nav (Visible after scroll) */}
      <nav className={`fixed z-[90] pointer-events-auto hidden md:flex flex-col items-center gap-2 p-1.5 rounded-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out delay-100 right-6 top-1/2 -translate-y-1/2 ${
        isPastAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16 pointer-events-none'
      }`}>
        <button 
          onClick={() => {
            const specEl = document.getElementById('specs');
            if (specEl) specEl.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="p-3 text-muted-foreground cursor-pointer hover:text-white hover:bg-white/5 transition-all outline-none flex items-center justify-center rounded-full"
          title="Specs"
        >
          <FileText className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('testimonials');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3 text-muted-foreground cursor-pointer hover:text-white hover:bg-white/5 transition-all outline-none flex items-center justify-center rounded-full"
          title="Gallery"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        
        {cartCount > 0 && (
          <button 
            onClick={() => navigate('/checkout')} 
            className="p-3 flex items-center gap-2 bg-[#1a1a1c] border border-white/5 hover:bg-white/10 text-white transition-all cursor-pointer outline-none justify-center relative rounded-full"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold absolute w-4 h-4 text-[9px] -top-1 -right-1">
              {cartCount}
            </span>
          </button>
        )}

        <button 
          onClick={() => navigate('/checkout')} 
          className="p-3 bg-primary/90 hover:bg-primary text-primary-foreground font-bold transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] cursor-pointer outline-none flex items-center justify-center rounded-full mt-1"
          title="Buy Now"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
