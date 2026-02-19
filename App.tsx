import React, { useState, useLayoutEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene, { PLANET_DATA } from './components/Scene';
import { SECTIONS } from './constants';
import { generatePlanetFact } from './services/geminiService';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const handleGeminiAsk = async (planetName: string) => {
    setLoading(true);
    setActiveFact(null);
    const fact = await generatePlanetFact(planetName);
    setActiveFact(fact);
    setLoading(false);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        
        const wrapper = section.querySelector('.parallax-wrapper');
        
        if (wrapper) {
          gsap.fromTo(wrapper, 
            { y: 100, opacity: 0 }, 
            {
              y: -100,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "center center",
                scrub: 1.5,
              }
            }
          );
        }
      });
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-black text-white">
      {/* 1. Fixed 3D Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Canvas
          camera={{ position: [30, 0, 15], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* 2. Scrollable Content Container */}
      <div className="scroll-container relative z-10 w-full">
        {/* Intro Section */}
        <section className="h-screen flex items-center justify-center pointer-events-none">
          <div className="text-center bg-slate-950/80 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-2xl">
            <h1 className="text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              COSMOS
            </h1>
            <p className="text-xl text-blue-100 font-medium">Scroll to begin your journey</p>
            <div className="animate-bounce mt-8 text-2xl text-white">↓</div>
          </div>
        </section>

        {/* Planet Sections */}
        {SECTIONS.map((section, index) => (
          <section 
            key={section.id} 
            ref={(el) => { sectionsRef.current[index] = el }}
            className="h-[150vh] flex items-center justify-start px-8 md:px-24 pointer-events-none"
          >
            {/* Wrapper for Parallax GSAP Animation */}
            <div className="parallax-wrapper">
              {/* Inner Card for Content & CSS Hover Effects */}
              <div className="pointer-events-auto max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-md">{section.title}</h2>
                <p className="text-xl text-blue-200 mb-4 font-medium">{section.subtitle}</p>
                <p className="text-gray-100 mb-6 leading-relaxed font-light">
                  {PLANET_DATA[section.planetIndex].description}
                </p>
                
                <div className="border-t border-gray-600 pt-4">
                  <button
                    onClick={() => handleGeminiAsk(section.title)}
                    disabled={loading}
                    className="group flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {loading ? (
                      <span className="animate-pulse">Consulting AI...</span>
                    ) : (
                      <>
                        <span>Ask Gemini AI a Fact</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </button>
                  
                  {activeFact && activeFact.toLowerCase().includes(section.title.toLowerCase()) && (
                    <div className="mt-4 p-4 bg-black/60 border-l-4 border-purple-500 rounded-r text-sm text-purple-100 italic animate-fadeIn shadow-inner">
                      "{activeFact}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Footer spacer to allow scrolling past the last planet */}
        <section className="h-screen flex items-center justify-center pointer-events-none">
             <div className="text-center bg-slate-950/80 backdrop-blur-xl p-8 rounded-xl border border-white/10">
                <h3 className="text-3xl font-bold text-white">End of Transmission</h3>
                <p className="text-gray-300 mt-2">Built with React, Three.js, and Gemini</p>
             </div>
        </section>
      </div>
      
      {/* UI Overlay for controls or status */}
      <div className="fixed bottom-4 right-4 z-50 text-xs font-bold text-gray-400 mix-blend-difference pointer-events-none tracking-widest uppercase">
        Scroll Position Synced
      </div>
    </div>
  );
};

export default App;