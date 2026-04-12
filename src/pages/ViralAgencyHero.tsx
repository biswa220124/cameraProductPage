import { useEffect, useState } from 'react';

export default function ViralAgencyHero() {
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled past the hero section
      if (window.scrollY > window.innerHeight * 0.8) {
        setHasScrolledPastHero(true);
      } else {
        setHasScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-[200vh] bg-black selection:bg-white/20">
      {/* 
        HERO SECTION
        Must be full-screen, with fixed video background, 
        and no color overlays or filters. 
      */}
      <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
        
        {/* Full-Screen Video Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4"
          />
        </div>

        {/* Floating Transparent Navigation */}
        <nav className="relative z-20 w-full px-6 py-6 md:px-12 flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <div className="font-barlow font-bold text-white text-xl tracking-wide uppercase">
            Viral Agency
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {['Work', 'Services', 'About', 'Contact'].map((link) => (
              <button
                key={link}
                className="font-barlow text-sm text-white px-5 py-2.5 rounded-full transition-colors duration-300 hover:bg-white/10"
              >
                {link}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Container with 250px bottom padding */}
        <div className="relative z-10 flex flex-col items-center flex-1 pb-[250px] justify-center px-4 md:px-8">
          
          {/* Central Content Box - we need an explicit container to position the 4 corner accents */}
          <div className="relative flex flex-col items-center max-w-4xl w-full py-16">
            
            {/* Corner Accents (4x 7px solid white squares at exact corners of this container) */}
            <div className="absolute top-0 left-0 w-[7px] h-[7px] bg-white"></div>
            <div className="absolute top-0 right-0 w-[7px] h-[7px] bg-white"></div>
            <div className="absolute bottom-0 left-0 w-[7px] h-[7px] bg-white"></div>
            <div className="absolute bottom-0 right-0 w-[7px] h-[7px] bg-white"></div>

            {/* Featured Badge - "liquid glass" effect */}
            <div className="mb-10 p-[1px] rounded-full bg-white/10 backdrop-blur-sm pointer-events-auto transition-colors duration-300 hover:bg-white/20">
              <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full">
                <span className="font-barlow text-xs sm:text-sm font-medium text-black uppercase tracking-wider">
                  Featured in Fortune
                </span>
              </div>
            </div>

            {/* Dynamic Headline */}
            <div className="text-center flex flex-col items-center gap-1 mb-8">
              <h1 className="font-barlow font-light text-white leading-tight" style={{ fontSize: '64px' }}>
                Agency that makes your
              </h1>
              <h1 className="font-instrument italic text-white leading-tight" style={{ fontSize: '64px' }}>
                videos & reels viral
              </h1>
            </div>

            {/* Sub-headline */}
            <p className="font-barlow text-white/75 text-center mt-2 mb-12 max-w-2xl text-lg md:text-xl leading-relaxed">
              We leverage data-driven storytelling and cinematic aesthetics to craft breathtaking daily content that captivates millions and drives exceptional engagement.
            </p>

            {/* CTA Button */}
            <button className="font-barlow font-medium text-[#171717] bg-[#f8f8f8] hover:bg-white px-10 py-4 text-base transition-colors duration-300 pointer-events-auto" style={{ borderRadius: '2px' }}>
              Start Your Project
            </button>
            
          </div>
        </div>
      </section>

      {/* 
        Below the fold content (appears after scroll) 
        "similar background animation after scroll ends not same but similar to this it should not bee too light or eye catch dim and minimal"
      */}
      <section className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] rounded-t-3xl border-t border-white/5">
        
        {/* Minimal Dim Background Animation visible on scroll */}
        <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${hasScrolledPastHero ? 'opacity-100' : 'opacity-0'}`}>
          {/* Subtle noise or grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Very dim, slow breathing orbs to mimic previous effect but much more minimal */}
          <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] bg-teal-500/5 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-barlow font-light text-white/50 text-2xl uppercase tracking-[0.3em] mb-4">
            Discover More
          </h2>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
      </section>

    </div>
  );
}
