import { useState, useEffect, useRef } from "react";
import { Play, ArrowUpRight, ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import { AIFilm } from "../portfolioData";

interface AIFilmsProps {
  films: AIFilm[];
  onSelectFilm: (film: AIFilm) => void;
  onOpenExplorer: () => void;
}

export default function AIFilms({ films, onSelectFilm, onOpenExplorer }: AIFilmsProps) {
  // Use all films or slice a subset for the cinematic carousel
  const displayedFilms = films.length > 0 ? films : [];
  
  // Set default starting active index to the center card
  const [activeIndex, setActiveIndex] = useState(
    displayedFilms.length > 0 ? Math.floor(displayedFilms.length / 2) : 0
  );
  const [viewport, setViewport] = useState<"sm" | "md" | "lg">("lg");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewport("lg");
      } else if (window.innerWidth >= 768) {
        setViewport("md");
      } else {
        setViewport("sm");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayedFilms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayedFilms.length - 1 ? 0 : prev + 1));
  };

  // Click handler for direct focusing on a side card
  const handleCardClick = (index: number, film: AIFilm) => {
    if (index === activeIndex) {
      // If we clicked the active card, launch the player modal
      onSelectFilm(film);
    } else {
      // Otherwise, scroll/roller to this card
      setActiveIndex(index);
    }
  };

  // Define custom cinematic metadata for rendering beautiful realistic elements
  const getCinematicMeta = (id: string, index: number) => {
    const ratings = ["9.1", "8.7", "8.5", "8.9", "9.0", "8.4", "8.8", "8.6"];
    const durations = ["1h 45min", "2h 10min", "1h 15min", "0h 45min", "2h 05min", "1h 30min", "1h 55min", "2h 15min"];
    const ages = ["13+", "PG-13", "16+", "G", "R", "PG-13", "13+", "18+"];
    
    return {
      rating: ratings[index % ratings.length],
      duration: durations[index % durations.length],
      age: ages[index % ages.length],
    };
  };

  return (
    <section id="ai-work" className="py-20 md:py-28 bg-white border-t border-neutral-200 relative overflow-hidden select-none">
      
      {/* Background Cinematic Luminous Blue/Amethyst Accents */}
      <div className="absolute top-1/4 left-[-10%] w-[550px] h-[550px] rounded-full bg-[#FF6A00]/3 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/2 blur-[160px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 text-center">
          <p className="text-[#FF6A00] font-mono text-xs uppercase tracking-[0.3em] mb-3">CINEMATIC CAROUSEL</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black tracking-[0.25em] text-neutral-900 uppercase">
            AI Films
          </h2>
          <p className="text-neutral-500 font-sans text-xs md:text-sm tracking-[0.05em] mt-3 max-w-lg mx-auto">
            Click side cards to roll left or right, hover to reveal custom controls, or select the active center film to watch immediately.
          </p>
        </div>

        {/* 3D Cover Flow Roller Stage Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-7xl mx-auto flex items-center justify-center py-8 px-4"
          style={{ perspective: "1200px" }}
        >
          
          {/* Active Roller Wrapper with responsive minimum height */}
          <div className="relative w-full flex items-center justify-center h-[340px] md:h-[480px] lg:h-[550px] overflow-visible">
            
            {displayedFilms.map((film, index) => {
              const diff = index - activeIndex;
              const isCenter = diff === 0;
              const isVisible = Math.abs(diff) <= 2; // only render adjacent cards to keep viewport clean

              if (!isVisible && viewport !== "sm") return null;
              if (viewport === "sm" && !isCenter) return null; // on mobile only show active center card for space parity

              // Compute precise 3D Transformations depending on how far the card is from activeIndex
              let rotateYVal = 0;
              let translateXVal = 0;
              let scaleVal = 1;
              let opacityVal = 1;
              let zIndexVal = 10;

              if (diff < 0) {
                // Left side cards
                rotateYVal = viewport === "lg" ? 42 : 32;
                translateXVal = viewport === "lg" ? diff * 280 - 130 : diff * 180 - 70;
                scaleVal = viewport === "lg" ? 0.76 : 0.72;
                opacityVal = Math.abs(diff) === 1 ? 0.65 : 0.35;
                zIndexVal = 10 + diff; // lower z-index as it goes further back
              } else if (diff > 0) {
                // Right side cards
                rotateYVal = viewport === "lg" ? -42 : -32;
                translateXVal = viewport === "lg" ? diff * 280 + 130 : diff * 180 + 70;
                scaleVal = viewport === "lg" ? 0.76 : 0.72;
                opacityVal = Math.abs(diff) === 1 ? 0.65 : 0.35;
                zIndexVal = 10 - diff; // lower z-index as it goes further back
              } else {
                // Centered fully focused card
                rotateYVal = 0;
                translateXVal = 0;
                scaleVal = 1.0;
                opacityVal = 1;
                zIndexVal = 20; // top layer
              }

              const meta = getCinematicMeta(film.id, index);

              return (
                <div
                  key={film.id}
                  onClick={() => handleCardClick(index, film)}
                  className="absolute w-[240px] h-[320px] md:w-[320px] md:h-[420px] lg:w-[410px] lg:h-[480px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.2,1)] cursor-pointer rounded-2xl overflow-hidden select-none group border border-neutral-200/80 bg-neutral-100 shadow-2xl"
                  style={{
                    transform: `translateX(${translateXVal}px) translateZ(${isCenter ? "120px" : "0px"}) rotateY(${rotateYVal}deg) scale(${scaleVal})`,
                    opacity: opacityVal,
                    zIndex: zIndexVal,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glass halftone dynamic texture overlay */}
                  <div className="absolute inset-0 halftone-overlay opacity-[0.04] mix-blend-overlay pointer-events-none z-[2]" />

                  {/* High Quality Cinematic Ambient Poster Background */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mapping matching movie artwork cover Flow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition-all duration-500" />
                    
                    {/* Adjacent items get covered in additional dark overlay to create deep contrast hierarchy */}
                    {!isCenter && (
                      <div className="absolute inset-0 bg-black/55 hover:bg-black/40 transition-colors duration-300" />
                    )}
                  </div>

                  {/* Active Film Details Overlay & Functional Items */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10 pointer-events-none">
                    
                    {/* Top Level Metadata Row */}
                    <div className="flex items-center justify-between pointer-events-auto">
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-500 text-black rounded-md tracking-wider">
                        {meta.age}
                      </span>
                      <span className="text-[11px] font-sans font-medium text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-800/40">
                        {meta.duration}
                      </span>
                    </div>

                    {/* Bottom Info and Interactive CTA Cards (Transitions into active view state) */}
                    <div className="flex flex-col gap-3 pointer-events-auto text-left">
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h3 className="text-xl md:text-2xl font-sans font-black text-white tracking-wide leading-tight group-hover:text-[#FF6A00] transition-colors">
                            {film.title}
                          </h3>
                        </div>
                        
                        {/* Rating Row with star and specific category metadata */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-amber-400 gap-0.5 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold ml-0.5">{meta.rating}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">|</span>
                          <span className="text-[10px] text-neutral-400 font-mono tracking-wider max-w-[200px] truncate">
                            {film.category}
                          </span>
                        </div>
                      </div>

                      {/* Watch & Add List Responsive Action Panel (Visible/Interactive on active center card) */}
                      {isCenter && (
                        <div className="flex items-center gap-3 mt-2 pr-2 animate-fade-in">
                          {/* Crimson red primary watch CTA button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFilm(film);
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-red-900/30 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>WATCH</span>
                          </button>

                          {/* Bright Golden-yellow plus Add List button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Simply mock standard interactions elegantly
                              alert(`Successfully added "${film.title}" to your list!`);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-sans font-bold text-xs py-2 px-3.5 rounded-lg flex items-center justify-center gap-1 transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-yellow-600/20 cursor-pointer"
                            title="Add to Watchlist"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>LIST</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Left Side Shadow Cast Accent to increase realistic 3D appearance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-[1] opacity-60 mix-blend-multiply" />
                </div>
              );
            })}

          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-[30] w-12 h-12 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md text-neutral-800 hover:text-[#FF6A00] hover:border-neutral-300 hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg group cursor-pointer"
            aria-label="Previous film"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-[30] w-12 h-12 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md text-neutral-800 hover:text-[#FF6A00] hover:border-neutral-300 hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg group cursor-pointer"
            aria-label="Next film"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>

        </div>

        {/* Carousel Roller Navigation Dot Indices */}
        <div className="flex justify-center items-center gap-2 mt-8 z-20 relative">
          {displayedFilms.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 relative cursor-pointer ${
                i === activeIndex 
                  ? "w-8 bg-[#FF6A00]" 
                  : "w-2.5 bg-neutral-200 hover:bg-neutral-350"
              }`}
            />
          ))}
        </div>

        {/* Explore More Option Footer */}
        <div className="flex justify-center mt-12 relative z-10">
          <button
            onClick={onOpenExplorer}
            className="group px-8 py-3.5 rounded-full border border-neutral-200 bg-neutral-50/60 backdrop-blur-md text-[11px] uppercase tracking-[0.25em] text-neutral-600 font-bold cursor-pointer hover:bg-[#FF6A00] hover:text-white hover:border-[#FF6A00] hover:shadow-lg hover:shadow-[#FF6A00]/25 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Explore All Media</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
