import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Image as ImageIcon, ShoppingCart, ShoppingBag, ChevronLeft, ChevronRight, Aperture, Film, Camera, Focus, Zap, Circle, Hexagon } from 'lucide-react';
import cameraImg from '@/assets/camera-main.png';
import AnnotationOverlay from '@/components/AnnotationOverlay';
import ProgressBar from '@/components/ProgressBar';
import AurexFooter from '@/components/ui/AurexFooter';

const TypewriterText = ({ text, delay = 0, speed = 100 }: { text: string, delay?: number, speed?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i+1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);
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

// Hook for scroll-triggered entrance animations (toggles on enter/leave)
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
  const [activeAccessory, setActiveAccessory] = useState<number | null>(null);
  const accessoriesInView = useInView(0.1);
  const footerInView = useInView(0.1);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonialsScrollRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(0.2);

  const scrollTestimonials = (dir: 'left' | 'right') => {
    if (testimonialsScrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 320 : 424; // approx card width + gap
      testimonialsScrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initialize cart count from shared local storage
    const cartStr = localStorage.getItem('aurex_cart');
    if (cartStr) {
      try {
        const parsed = JSON.parse(cartStr);
        if (Array.isArray(parsed)) {
          setCartCount(parsed.reduce((acc: number, c: any) => acc + c.qty, 0));
        }
      } catch(e) {}
    }
  }, []);

  const handleAddToCart = (item: any) => {
    setActiveAccessory(null);
    
    const cartStr = localStorage.getItem('aurex_cart');
    let cart = [];
    try { cart = cartStr ? JSON.parse(cartStr) : []; } catch(e) {}
    
    // If starting fresh, prepend the default camera
    if (cart.length === 0) {
        cart.push({ id: 1, name: "AUREX ONE Body", desc: "Professional Mirrorless", specs: "Full-Frame • Stellar Black", price: 289990, img: cameraImg, qty: 1 });
    }
    
    const existingIdx = cart.findIndex((c: any) => c.name === item.name);
    if (existingIdx !== -1) {
        cart[existingIdx].qty += 1;
    } else {
        const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
        cart.push({
            id: Date.now() + Math.random(),
            name: item.name,
            desc: "Premium Accessory",
            specs: item.specs && item.specs[0] ? item.specs[0].value : "",
            price: priceNum,
            img: item.img,
            qty: 1
        });
    }
    
    localStorage.setItem('aurex_cart', JSON.stringify(cart));
    setCartCount(cart.reduce((acc: number, c: any) => acc + c.qty, 0));
    
    alert(`${item.name} added to cart!`);
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
      setIsHeroVisible(false);
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => setIsHeroVisible(true), 100);
      return () => clearTimeout(timer);
    }
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

      {/* Mobile/Tablet Fixed Feature Text (Top) */}
      <div className={`fixed top-16 md:top-[15vh] inset-x-4 z-[90] pointer-events-none lg:hidden transition-all duration-500 ease-out flex justify-center ${
         activeSection > 0 && activeSection <= 6 && !isPastAnimation && !showWelcome ? 'opacity-100' : 'opacity-0'
      }`}>
         {activeSection > 0 && activeSection <= 6 && (
            <div key={activeSection} className="animate-in fade-in slide-in-from-left-8 duration-700 ease-out text-center p-3 md:p-5 rounded-xl md:rounded-2xl bg-[#050505]/85 backdrop-blur-xl border border-white/[0.05] shadow-2xl max-w-[90%] md:max-w-sm w-full mx-auto">
               <span className="font-mono-code text-[8px] md:text-[10px] tracking-[0.4em] text-primary block mb-1">{sectionMeta[activeSection].num}</span>
               <h3 className="text-base md:text-xl font-bold text-foreground mb-1">{sectionMeta[activeSection].title}</h3>
               <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed mx-auto line-clamp-2">
                 {sectionMeta[activeSection].desc}
               </p>
            </div>
         )}
      </div>

      {/* Navigation Arrow — LEFT (Previous) on extreme LEFT side */}
      <button
        onClick={() => {
          const target = Math.max(0, activeSection - 1);
          window.scrollTo({ top: target * window.innerHeight, behavior: 'smooth' });
        }}
        className={`fixed left-2 md:left-4 bottom-1/2 translate-y-1/2 z-[85] w-12 h-12 flex items-center justify-center rounded-full bg-background/80 border border-border/80 backdrop-blur hover:bg-white/10 hover:border-primary transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPastAnimation || showWelcome || activeSection === 0 ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 hover:scale-110'}`}
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Navigation Arrow — RIGHT (Next) on extreme RIGHT side */}
      <button
        onClick={() => {
          if (isPastAnimation || activeSection === SECTIONS.length - 1) {
            const specsEl = document.getElementById('specs');
            if (specsEl) specsEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            const target = Math.min(SECTIONS.length - 1, activeSection + 1);
            window.scrollTo({ top: target * window.innerHeight, behavior: 'smooth' });
          }
        }}
        className={`fixed right-2 md:right-4 bottom-1/2 translate-y-1/2 z-[85] w-12 h-12 flex items-center justify-center rounded-full bg-background/80 border border-border/80 backdrop-blur hover:bg-white/10 hover:border-primary transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isPastAnimation || showWelcome ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 hover:scale-110'}`}
      >
        <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            transform: `translateX(${activeSection === 0 ? (isMobile ? '0px' : '-20vw') : '0px'}) translateY(${activeSection === 0 && isMobile ? '-15vh' : '0px'}) rotateY(${heroRotateY}deg) rotateX(${heroRotateX}deg) scale(${heroScale})`,
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
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Mobile Fixed Popup for Specs (Rendered outside 3D space to bypass transform) */}
      <div 
        className={`fixed bottom-4 sm:bottom-12 inset-x-4 sm:inset-x-6 z-[95] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobile && activeAnnotation && !isPastAnimation 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-[#050505]/95 backdrop-blur-[24px] border border-white/[0.08] rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden ring-1 ring-white/5 mx-auto max-w-sm">
           {/* Subtle Glow */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] pointer-events-none mix-blend-screen"></div>
           
           <h4 className="text-[10px] font-mono-code text-primary tracking-[0.2em] uppercase mb-2 opacity-90">
             {activeAnnotation ? ANNOTATIONS.find(a => a.id === activeAnnotation)?.label : ''}
           </h4>
           
           <div className="space-y-2 relative z-10 w-full" key={activeAnnotation || 'empty'}>
             {activeAnnotation && SPECS[activeAnnotation]?.map((spec) => (
               <div key={spec.label} className="flex justify-between items-center gap-2 text-[10px] font-mono-code border-b border-white/[0.04] pb-1.5 last:border-0 last:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <span className="text-white/40 uppercase tracking-widest">{spec.label}</span>
                 <span className="text-white/90 font-medium tracking-wide text-[9px]">{spec.value}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Scroll content */}
      <div className="relative z-10 pointer-events-none">
        {/* HERO — camera on left, text on right with sequential animation */}
        <section className="h-screen flex flex-col md:flex-row items-center justify-center md:justify-end px-6 md:pr-20 lg:pr-28 relative">
          <div className={`text-center md:text-right w-full max-w-sm md:max-w-md transition-all duration-1000 ${activeSection === 0 ? 'opacity-100 translate-y-[15vh] md:translate-y-0' : 'opacity-0 blur-xl scale-110 -translate-y-8'}`}>
            <p className="font-mono-code text-xs tracking-[0.5em] text-primary mb-4 h-[20px] flex items-center justify-center md:justify-end transition-all duration-1000" style={{ opacity: isHeroVisible && activeSection === 0 ? 1 : 0, transitionDelay: '500ms' }}>
              INTRODUCING
              <span className={`w-1 h-3 bg-primary ml-1 ${isHeroVisible ? 'animate-pulse' : 'opacity-0'}`}></span>
            </p>
            {/* AUREX appears after INTRODUCING fades in */}
            <h1 className="text-6xl md:text-[10rem] font-bold text-foreground/[0.06] leading-none select-none transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: isHeroVisible && activeSection === 0 ? 1 : 0, filter: isHeroVisible && activeSection === 0 ? 'blur(0px)' : 'blur(20px)', transform: isHeroVisible && activeSection === 0 ? 'scale(1) translateX(0)' : 'scale(0.95) translateX(20px)', transitionDelay: '1000ms' }}>AUREX</h1>
            {/* ONE appears sequentially with typewriter effect + blur */}
            <h2 className="text-3xl md:text-6xl font-bold text-foreground -mt-2 md:-mt-6 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[40px] md:min-h-[72px]" style={{ opacity: isHeroVisible && activeSection === 0 ? 1 : 0, filter: isHeroVisible && activeSection === 0 ? 'blur(0px)' : 'blur(20px)', transform: isHeroVisible && activeSection === 0 ? 'scale(1) translateX(0)' : 'scale(0.95) translateX(20px)', transitionDelay: '1600ms' }}>
              {isHeroVisible && activeSection === 0 ? <TypewriterText text="ONE" delay={1600} speed={400} /> : <span className="opacity-0">ONE</span>}
            </h2>
            {/* Subtitle appears after title */}
            <p className="text-muted-foreground text-sm mt-6 max-w-sm ml-auto transition-all duration-1000" style={{ opacity: isHeroVisible && activeSection === 0 ? 1 : 0, filter: isHeroVisible && activeSection === 0 ? 'blur(0px)' : 'blur(10px)', transitionDelay: '2600ms' }}>
              A masterpiece of optical engineering. Scroll to explore every detail.
            </p>
            <div className={`mt-10 flex justify-end transition-all duration-700 ${isHeroVisible && activeSection === 0 ? 'opacity-100 animate-bounce' : 'opacity-0'}`} style={{ transitionDelay: '3000ms' }}>
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
            <section key={i} className="h-screen flex items-center px-6 md:px-16 pointer-events-none">
              <div
                className={`hidden lg:block max-w-xs transition-all duration-700 w-full transform ${
                  activeSection === i 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                } ${isLeft ? 'mr-auto ml-0 text-left' : 'ml-auto mr-0 text-right'}`}
              >
                <span className="font-mono-code text-xs tracking-[0.3em] text-primary">{meta.num}</span>
                <h3 className="text-3xl font-bold text-foreground mt-1 mb-3">{meta.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{meta.desc}</p>
                <div className={`mt-4 w-12 h-[1px] bg-primary/40 ${isLeft ? 'mx-0' : 'ml-auto'}`} />
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
              AUREX ONE TECHNICAL SPECIFICATIONS
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
              <span className="text-muted-foreground line-through text-sm">₹3,56,990</span>
              <span className="text-3xl font-bold text-foreground">₹2,89,990</span>
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
      {(() => {
        const accessories = [
          { 
            name: "AUREX Prime 50mm f/1.4", 
            price: "₹74,990",  
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=400&q=80",
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
            price: "₹10,990", 
            img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&h=400&q=80",
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
            price: "₹12,490", 
            img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&h=400&q=80",
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
            price: "₹24,990", 
            img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=400&h=400&q=80",
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
            price: "₹6,590", 
            img: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=400&h=400&q=80",
            specs: [
              { label: "Chemistry", value: "Lithium-Ion" },
              { label: "Capacity", value: "2280 mAh" },
              { label: "Voltage", value: "7.2V" },
              { label: "Shot Life", value: "~600 shots" },
              { label: "Charge Time", value: "~2.5 hours" },
            ]
          },
        ];
        return (
        <>
        <div id="accessories" ref={accessoriesInView.ref} className="w-full bg-white pt-24 pb-32 border-y border-gray-200 relative z-30">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className={`text-center mb-16 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${accessoriesInView.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-gray-400 mb-3 block">
                — Enhance Your Setup —
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-black">Essential Accessories</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pt-8">
              {accessories.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                    accessoriesInView.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                  onClick={() => setActiveAccessory(idx)}
                >
                  {/* Rounded product circle */}
                  <div className="w-20 h-20 mb-4 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 ease-out ring-2 ring-gray-200 group-hover:ring-black/30 group-hover:shadow-xl">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-semibold text-xs text-black mb-1 line-clamp-2 min-h-[32px] leading-tight">{item.name}</h4>
                  <p className="text-gray-500 font-mono-code text-[11px]">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accessory Popup Modal with Backdrop Blur */}
        {activeAccessory !== null && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setActiveAccessory(null)}
          >
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-black/40 animate-[fadeIn_0.3s_ease-out]" style={{ backdropFilter: 'blur(12px)' }} />
            
            {/* Modal card */}
            <div 
              className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden bg-white shadow-2xl animate-[popIn_0.35s_cubic-bezier(0.16,1,0.3,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Product image */}
              <div className="relative w-full h-48 overflow-hidden">
                <img 
                  src={accessories[activeAccessory].img} 
                  alt={accessories[activeAccessory].name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h4 className="text-white font-bold text-lg leading-tight">{accessories[activeAccessory].name}</h4>
                  <p className="text-white/70 font-mono text-sm mt-1">{accessories[activeAccessory].price}</p>
                </div>
                {/* Close button */}
                <button 
                  onClick={() => setActiveAccessory(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  ✕
                </button>
              </div>
              
              {/* Specs list */}
              <div className="p-5">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-4">Product Details</span>
                <ul className="space-y-3">
                  {accessories[activeAccessory].specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex justify-between items-baseline gap-4 pb-2 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-400 font-mono">{spec.label}</span>
                      <span className="text-xs text-black font-semibold font-mono text-right">{spec.value}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleAddToCart(accessories[activeAccessory])}
                  className="w-full mt-6 py-3 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-widest transition-colors rounded-full cursor-pointer"
                >
                  Add to Cart — {accessories[activeAccessory].price}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
        );
      })()}

      {/* Testimonials Section (Dark Carousel) */}
      <div id="testimonials" ref={testimonialsInView.ref} className="w-full bg-[#050505] pt-24 pb-32 relative z-30 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-gray-500 mb-3 block">
                — Trusted by Professionals —
              </span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                What Our Customers Say
              </h3>
              <p className="text-gray-500 text-sm">Real Stories. Real Results. Straight From Those Who Know Us Best.</p>
            </div>
            
            {/* Scroll Controls */}
            <div className="flex gap-4">
              <button 
                onClick={() => scrollTestimonials('left')}
                className="w-12 h-12 rounded-full border border-gray-800 bg-[#0a0a0a] flex items-center justify-center text-white hover:bg-gray-800 transition-colors cursor-pointer group"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollTestimonials('right')}
                className="w-12 h-12 rounded-full border border-gray-800 bg-[#0a0a0a] flex items-center justify-center text-white hover:bg-gray-800 transition-colors cursor-pointer group"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={testimonialsScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:-mx-12 md:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`#testimonials ::-webkit-scrollbar { display: none; }`}</style>
            
            {[
              {
                icon: <Hexagon size={24} className="text-white" />,
                quote: "The AUREX ONE has completely transformed how I shoot. The dynamic range is unlike anything else on the market, and the autofocus is almost precognitive.",
                author: "Elena R.",
                role: "Fashion Photographer"
              },
              {
                icon: <Aperture size={24} className="text-white" />,
                quote: "Built like a tank but handles like a sports car. I've dragged it through rainforests and deserts, and it hasn't skipped a single frame.",
                author: "Marcus T.",
                role: "Adventure Journalist"
              },
              {
                icon: <Film size={24} className="text-white" />,
                quote: "Finally, a camera that doesn't get in the way of my vision. The hybrid viewfinder gives me the best of both worlds, bridging analog feel with digital power.",
                author: "David K.",
                role: "Cinematographer"
              },
              {
                icon: <Focus size={24} className="text-white" />,
                quote: "Skin tones straight out of camera are unbelievable. It saves me hours in post-processing every week without compromising on resolution.",
                author: "Sarah J.",
                role: "Portrait Specialist"
              },
              {
                icon: <Zap size={24} className="text-white" />,
                quote: "120 frames per second with full AF tracking. I'm capturing split-second moments that were previously impossible to get. Game changer.",
                author: "James W.",
                role: "Sports Photographer"
              },
              {
                icon: <Camera size={24} className="text-white" />,
                quote: "The compact size combined with the rugged build lets me take this anywhere without attracting too much attention. Pure stealth.",
                author: "Aisha M.",
                role: "Documentary Filmmaker"
              },
              {
                icon: <Circle size={24} className="text-white" />,
                quote: "The lens rendering is clinically perfect yet full of character. A massive leap forward for the format and for modern optical engineering.",
                author: "Chen L.",
                role: "Architecture Photographer"
              }
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className={`
                  min-w-[320px] md:min-w-[400px] w-[320px] md:w-[400px] bg-[#0d0d0d] border border-gray-800 p-8 md:p-10 rounded-[32px] snap-start shrink-0 flex flex-col justify-between 
                  transition-all duration-700 ease-out transform hover:border-gray-600 hover:bg-[#111] cursor-default
                  ${testimonialsInView.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
                `}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
                    {testimonial.icon}
                  </div>
                  <h4 className="font-bold text-white text-lg">{testimonial.author}</h4>
                  <p className="font-mono-code text-[10px] text-gray-500 mt-1 uppercase tracking-wider mb-6">{testimonial.role}</p>
                  <p className="text-[#a1a1aa] leading-relaxed text-sm mt-4">"{testimonial.quote}"</p>
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
                    placeholder="Arjun Mehta"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-gray-500 mb-2 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full bg-white border border-gray-200 focus:border-primary/70 focus:ring-1 focus:ring-primary/70 outline-none px-4 py-3 rounded-sm transition-all text-sm text-black placeholder:text-gray-400"
                    placeholder="arjun.mehta@gmail.com"
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

      {/* Footer */}
      <div ref={footerInView.ref as any}>
        <AurexFooter />
      </div>

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

      {/* Mobile Bottom Action Bar — shows after 3D scroll, hides at footer */}
      <nav className={`fixed bottom-0 left-0 right-0 z-[90] lg:hidden pointer-events-auto flex items-stretch bg-[#0e0e10]/90 backdrop-blur-xl border-t border-white/[0.06] shadow-[0_-4px_24px_rgba(0,0,0,0.6)] transition-all duration-500 ${
        isPastAnimation && !footerInView.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
      }`}>
        <button
          onClick={() => {
            const specEl = document.getElementById('specs');
            if (specEl) specEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span className="font-mono-code text-[10px] tracking-widest uppercase">Specs</span>
        </button>

        <div className="w-[1px] bg-white/[0.06] my-2" />

        <button
          onClick={() => {
            const el = document.getElementById('gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-muted-foreground hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="font-mono-code text-[10px] tracking-widest uppercase">Gallery</span>
        </button>

        <div className="w-[1px] bg-white/[0.06] my-2" />

        <button
          onClick={() => navigate('/checkout')}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-primary/90 hover:bg-primary text-primary-foreground font-bold transition-all outline-none cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-mono-code text-[10px] tracking-widest uppercase">Buy Now</span>
        </button>
      </nav>
        
      {/* Horizontal Nav (Visible during scroll — desktop only) */}
      <nav className={`fixed z-[90] pointer-events-auto hidden lg:flex items-center gap-2 p-1.5 rounded-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out top-6 right-6 ${
        isPastAnimation ? 'opacity-0 translate-x-12 pointer-events-none' : 'opacity-100 translate-x-0'
      }`}>
        <button 
          onClick={() => {
            const specEl = document.getElementById('specs');
            if (specEl) specEl.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="text-[10px] md:text-[11px] px-3 md:px-5 py-2 md:py-2.5 text-muted-foreground font-mono-code tracking-wider cursor-pointer hover:text-white hover:bg-white/5 transition-all rounded-full border-none outline-none uppercase"
        >
          Specs
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-[10px] md:text-[11px] px-3 md:px-5 py-2 md:py-2.5 text-muted-foreground font-mono-code tracking-wider cursor-pointer hover:text-white hover:bg-white/5 transition-all rounded-full border-none outline-none uppercase"
        >
          Gallery
        </button>
        
        {cartCount > 0 && (
          <button 
            onClick={() => navigate('/checkout')} 
            className="px-3 md:px-4 py-1.5 flex items-center gap-2 bg-[#1a1a1c] border border-white/5 hover:bg-white/10 text-white font-mono-code text-[10px] md:text-[11px] tracking-wider transition-all rounded-full cursor-pointer uppercase outline-none"
          >
            Cart
            <span className="bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
              {cartCount}
            </span>
          </button>
        )}

        <button 
          onClick={() => navigate('/checkout')} 
          className="text-[10px] md:text-[11px] px-4 md:px-6 py-2 md:py-2.5 bg-primary/90 hover:bg-primary text-primary-foreground font-bold font-mono-code tracking-wider transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] rounded-full cursor-pointer whitespace-nowrap outline-none uppercase ml-0 md:ml-1"
        >
          Buy Now
        </button>
      </nav>

      {/* Vertical Icon Nav (Visible after scroll — tablet/desktop only) */}
      <nav className={`fixed z-[90] pointer-events-auto hidden md:flex flex-col items-center gap-2 p-1.5 rounded-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out delay-100 right-6 top-1/2 -translate-y-1/2 ${
        isPastAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16 pointer-events-none'
      }`}>
        <button 
          onClick={() => {
            const specEl = document.getElementById('specs');
            if (specEl) specEl.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="p-2 md:p-3 text-muted-foreground cursor-pointer hover:text-white hover:bg-white/5 transition-all outline-none flex items-center justify-center rounded-full"
          title="Specs"
        >
          <FileText className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-2 md:p-3 text-muted-foreground cursor-pointer hover:text-white hover:bg-white/5 transition-all outline-none flex items-center justify-center rounded-full"
          title="Gallery"
        >
          <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        {cartCount > 0 && (
          <button 
            onClick={() => navigate('/checkout')} 
            className="p-2 md:p-3 flex items-center gap-2 bg-[#1a1a1c] border border-white/5 hover:bg-white/10 text-white transition-all cursor-pointer outline-none justify-center relative rounded-full"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            <span className="bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold absolute w-4 h-4 text-[9px] -top-1 -right-1">
              {cartCount}
            </span>
          </button>
        )}

        <button 
          onClick={() => navigate('/checkout')} 
          className="p-2 md:p-3 bg-primary/90 hover:bg-primary text-primary-foreground font-bold transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] cursor-pointer outline-none flex items-center justify-center rounded-full mt-1"
          title="Buy Now"
        >
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </nav>
    </div>
  );
}
