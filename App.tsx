import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene, { PLANET_DATA } from './components/Scene';
import { SECTIONS } from './constants';
import { generatePlanetFact } from './services/geminiService';

const App: React.FC = () => {
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeminiAsk = async (planetName: string) => {
    setLoading(true);
    setActiveFact(null);
    const fact = await generatePlanetFact(planetName);
    setActiveFact(fact);
    setLoading(false);
  };

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
          <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h1 className="text-6xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500 mb-4">
              COSMOS
            </h1>
            <p className="text-xl text-gray-300">Scroll to begin your journey</p>
            <div className="animate-bounce mt-8 text-2xl">↓</div>
          </div>
        </section>

        {/* Planet Sections */}
        {SECTIONS.map((section) => (
          <section 
            key={section.id} 
            className="h-[150vh] flex items-center justify-start px-8 md:px-24 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-md bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] transform transition-all hover:scale-105">
              <h2 className="text-4xl font-bold mb-2 text-white">{section.title}</h2>
              <p className="text-xl text-blue-300 mb-4">{section.subtitle}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {PLANET_DATA[section.planetIndex].description}
              </p>
              
              <div className="border-t border-gray-700 pt-4">
                <button
                  onClick={() => handleGeminiAsk(section.title)}
                  disabled={loading}
                  className="group flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
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
                  <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500/30 rounded text-sm text-purple-100 italic animate-fadeIn">
                    "{activeFact}"
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* Footer spacer to allow scrolling past the last planet */}
        <section className="h-screen flex items-center justify-center pointer-events-none">
             <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-xl">
                <h3 className="text-3xl font-bold text-white">End of Transmission</h3>
                <p className="text-gray-400 mt-2">Built with React, Three.js, and Gemini</p>
             </div>
        </section>
      </div>
      
      {/* UI Overlay for controls or status */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-500 mix-blend-difference pointer-events-none">
        SCROLL POSITION SYNCED
      </div>
    </div>
  );
};

export default App;
