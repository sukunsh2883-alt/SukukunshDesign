import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Play, Film, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AIFilm, VideoCard, ExplorationItem } from "../portfolioData";

interface AIWorkExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  films: AIFilm[];
  videos: VideoCard[];
  explorations: ExplorationItem[];
  onSelectFilm: (film: AIFilm) => void;
  onSelectVideo: (video: VideoCard) => void;
}

const TABS = [
  { id: "film", label: "AI FILM" },
  { id: "reel", label: "AI REEL" },
  { id: "image", label: "IMAGE" }
];

interface ArchiveImageItem {
  id: string;
  title: string;
  imageUrl: string;
}

export default function AIWorkExplorer({ isOpen, onClose, films, videos, onSelectVideo }: AIWorkExplorerProps) {
  const [selectedTab, setSelectedTab] = useState("film");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const [archiveImages] = useState<ArchiveImageItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_ai_archive_images");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Creative custom AI Midjourney prompt mapping matching each exploration design
  const EXPLORATION_PROMPTS: Record<string, string> = {
    "exp-1": "/imagine prompt: Viscous high-fidelity mercurial chrome liquid floating in zero gravity, neon purple and soft ambient blue studio lighting, photorealistic 8k, unreal engine 5 render --ar 16:9",
    "exp-2": "/imagine prompt: Atmospheric cinematic photography of heavy volumetric fog rolling through old pine trees, moody soft amber backlight, shot on 35mm film, misty morning --ar 16:9",
    "exp-3": "/imagine prompt: A perfect circular neon portal mirror standing in the middle of a desert dune, reflecting a vibrant digital neon garden, dramatic sunset, fantasy art photography --ar 16:9",
    "exp-4": "/imagine prompt: High contrast cinematic night street in Tokyo, glowing neon red transit lines overhead, wet asphalt reflections, moody cyberpunk rain, extremely detailed --ar 16:9",
    "exp-5": "/imagine prompt: Detailed pencil and ink storyboard concept sketch of a futuristic robotic traveler walking through a legendary library, vintage comic book style, deep ink washes --ar 16:9",
    "exp-6": "/imagine prompt: Panoramic matte painting of an endless cyberpunk metropolis glowing silhouette under a toxic orange dust sky, high tech tall spires, dystopian future mood --ar 16:9"
  };

  // Safe fallback lookup for selected image items
  const selectedImgItem = useMemo(() => {
    return archiveImages.find((item) => item.imageUrl === selectedImgUrl) || (selectedImgUrl ? {
      id: "raw-fallback",
      title: "Art Exploration Study",
      imageUrl: selectedImgUrl,
    } : null);
  }, [archiveImages, selectedImgUrl]);

  // Filter dedicated archive images. These are intentionally separate from canvas images.
  const filteredImages = useMemo(() => {
    return archiveImages.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        !query ||
        item.title.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, archiveImages]);

  // Filter films
  const filteredFilms = useMemo(() => {
    return films.filter((film) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        !query ||
        film.title.toLowerCase().includes(query) ||
        film.category.toLowerCase().includes(query) ||
        (film.tags && film.tags.some(t => t.toLowerCase().includes(query)))
      );
    });
  }, [searchQuery, films]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const query = searchQuery.toLowerCase().trim();
      const isAIReel = video.isAI || video.type.toLowerCase().includes("ai");
      return (
        isAIReel &&
        (!query ||
          video.title.toLowerCase().includes(query) ||
          video.type.toLowerCase().includes(query) ||
          video.year.toLowerCase().includes(query) ||
          video.duration.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, videos]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 overflow-y-auto select-none transition-colors duration-700 ${
          activePlayingId ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
        }`}
      >
        {/* Main Immersive Canvas */}
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-20 relative">
          
          {/* Main Back / Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 md:top-12 md:right-12 p-3 rounded-full transition-all scale-95 hover:scale-100 active:scale-90 cursor-pointer border ${
              activePlayingId
                ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-100"
            }`}
            aria-label="Close page"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Epic Hero Title Heading */}
          <div className="mb-10 text-left">
            <h1 className={`text-5xl md:text-8xl font-sans font-semibold tracking-tight select-none transition-colors duration-500 ${
              activePlayingId ? "text-white" : "text-neutral-800"
            }`}>
              AI Archive
            </h1>
          </div>

          {/* Action Row containing filter tabs & searchable micro text boxes */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            
            {/* Filter Pills list */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
              <div className="flex flex-nowrap gap-2">
                {TABS.map((tab) => {
                  const isActive = selectedTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedTab(tab.id);
                        setSearchQuery("");
                        setActivePlayingId(null);
                      }}
                      className={`px-6 py-2 rounded-full text-[11px] font-sans font-extrabold tracking-wider transition-all cursor-pointer select-none uppercase border ${
                        isActive
                          ? activePlayingId
                            ? "bg-white border-white text-neutral-950 shadow-sm"
                            : "bg-black border-black text-white shadow-sm"
                          : activePlayingId
                            ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                            : "bg-white border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-400"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart search filter inputs */}
            <div className="relative w-full sm:w-72 md:w-80 lg:w-96 shrink-0">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                activePlayingId ? "text-neutral-500" : "text-neutral-400"
              }`} />
              <input
                type="text"
                placeholder={`Search ${selectedTab === "film" ? "AI films" : selectedTab === "reel" ? "AI reels" : "images"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-full pl-11 pr-12 py-2.5 text-xs font-sans transition-all outline-none ${
                  activePlayingId
                    ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-700"
                    : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-black"
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-extrabold uppercase transition-colors ${
                    activePlayingId ? "text-neutral-400 hover:text-white" : "text-neutral-400 hover:text-black"
                  }`}
                >
                  CLEAR
                </button>
              )}
            </div>

          </div>

          {/* Component views dependent on the select tab */}
          <div className="relative w-full">
            
            {/* FILM TAB */}
            {selectedTab === "film" && (
              <div className="w-full">
                {filteredFilms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredFilms.map((film) => {
                      return (
                        <div
                          key={film.id}
                          onClick={() => {
                            setActivePlayingId(film.id);
                          }}
                          className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 cursor-pointer"
                        >
                          <video
                            src={film.videoUrl}
                            poster={film.thumbnail}
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload="auto"
                            aria-label={film.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />
                          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-black">
                            AI Film
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-white p-4 text-black opacity-0 scale-90 transition-all group-hover:opacity-100 group-hover:scale-100">
                              <Play className="h-5 w-5 translate-x-0.5 fill-black" />
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <h2 className="font-sans text-xl font-black uppercase leading-tight text-white">
                              {film.title}
                            </h2>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-300">
                              {film.year} / {film.category}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-24 text-center border border-neutral-100 bg-neutral-50/50 rounded-3xl">
                    <Film className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-500">
                      No matching films found
                    </h3>
                  </div>
                )}
              </div>
            )}

            {/* AI REEL TAB */}
            {selectedTab === "reel" && (
              <div className="w-full">
                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredVideos.map((video) => (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => onSelectVideo(video)}
                        className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 text-left cursor-pointer"
                      >
                        <video
                          src={video.videoUrl}
                          poster={video.thumbnail}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="auto"
                          aria-label={video.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />
                        <div className="absolute left-4 top-4 rounded-full bg-[#FF6A00] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                          AI Reel
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white p-4 text-black opacity-0 scale-90 transition-all group-hover:opacity-100 group-hover:scale-100">
                            <Play className="h-5 w-5 translate-x-0.5 fill-black" />
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h2 className="font-sans text-lg font-semibold leading-tight text-white">
                            {video.title}
                          </h2>
                          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-300">
                            {video.duration} / {video.type}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center border border-neutral-100 bg-neutral-50/50 rounded-3xl">
                    <Film className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-500">
                      No matching reels found
                    </h3>
                  </div>
                )}
              </div>
            )}

            {/* IMAGE TAB - Pinterest-inspired Masonry column grid */}
            {selectedTab === "image" && (
              <div className="w-full">
                {filteredImages.length > 0 ? (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-8 [column-fill:_balance]">
                    {filteredImages.map((item) => (
                      <div
                        key={item.id}
                        className="break-inside-avoid relative group rounded-2xl flex flex-col"
                      >
                        {/* Image frame container carrying NO internal padding/margins/borders */}
                        <div 
                          onClick={() => setSelectedImgUrl(item.imageUrl)}
                          className="relative w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-150/40 cursor-pointer shadow-sm z-0"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-auto object-cover rounded-2xl transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-350" />
                          <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-white/30 bg-black/25 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-350 flex items-center justify-center text-[10px] font-sans font-bold text-white tracking-widest uppercase">
                            VIEW
                          </div>
                        </div>

                        {/* Bold text subtitles outside of the card */}
                        <div className="mt-4 px-1 flex flex-col text-left select-none">
                          <h4 className="font-extrabold text-neutral-900 text-sm tracking-tight leading-snug uppercase">
                            {item.title}
                          </h4>
                          <p className="text-neutral-500 text-[11px] font-mono tracking-wider mt-1 uppercase">
                            AI ARCHIVE IMAGE
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center border border-neutral-100 bg-neutral-50/50 rounded-3xl">
                    <ImageIcon className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-500">
                      No archive images yet
                    </h3>
                    <p className="mt-2 text-xs text-neutral-400">
                      Add images from Creator Studio.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Fullscreen Video Streaming Overlay with Side Navigation Arrows */}
        {activePlayingId && (
          (() => {
            const activeIndex = filteredFilms.findIndex(f => f.id === activePlayingId);
            const activeFilm = activeIndex !== -1 ? filteredFilms[activeIndex] : null;
            if (!activeFilm) return null;

            const handleNext = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (filteredFilms.length <= 1) return;
              const nextIndex = (activeIndex + 1) % filteredFilms.length;
              setActivePlayingId(filteredFilms[nextIndex].id);
            };

            const handlePrev = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (filteredFilms.length <= 1) return;
              const prevIndex = (activeIndex - 1 + filteredFilms.length) % filteredFilms.length;
              setActivePlayingId(filteredFilms[prevIndex].id);
            };

            return (
              <div 
                className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 md:p-8"
                onClick={() => setActivePlayingId(null)}
              >
                {/* Immersive Cinematic Background Graphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-black to-neutral-900 pointer-events-none opacity-40" />

                {/* Video Area Container */}
                <div 
                  className="w-full max-w-[95vw] md:max-w-6xl aspect-video relative flex items-center justify-center rounded-2xl overflow-hidden bg-black/70 shadow-2xl border border-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    key={activeFilm.id}
                    src={activeFilm.videoUrl}
                    autoPlay
                    loop
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Bottom Info Bar inside container */}
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex flex-col text-left pointer-events-none select-none z-10 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/5 max-w-sm sm:max-w-md hidden sm:flex">
                    <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      {activeFilm.category}
                    </p>
                    <h3 className="text-lg md:text-xl font-sans font-extrabold tracking-tight text-white uppercase mt-1 leading-tight">
                      {activeFilm.title}
                    </h3>
                    <p className="text-white/60 text-[10px] font-sans mt-0.5">
                      {activeFilm.year} / AI FILM ARCHIVE
                    </p>
                  </div>
                </div>

                {/* Mobile & Small Screen Metadata Header/Footer Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-left pointer-events-none select-none z-10 sm:hidden">
                  <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                    {activeFilm.category}
                  </p>
                  <h3 className="text-lg font-sans font-bold text-white uppercase mt-0.5">
                    {activeFilm.title}
                  </h3>
                </div>

                {/* Back / Close button */}
                <button
                  onClick={() => setActivePlayingId(null)}
                  className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all border border-white/10 backdrop-blur-sm hover:scale-105 active:scale-95 z-50 shadow-md"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Arrow Navigation */}
                {filteredFilms.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 md:p-5 rounded-full bg-black/60 sm:bg-white/5 sm:hover:bg-white/15 text-white hover:bg-neutral-800 cursor-pointer transition-all border border-white/10 backdrop-blur-md hover:scale-110 active:scale-95 z-50 group shadow-xl"
                    aria-label="Previous video"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                )}

                {/* Right Arrow Navigation */}
                {filteredFilms.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 md:p-5 rounded-full bg-black/60 sm:bg-white/5 sm:hover:bg-white/15 text-white hover:bg-neutral-800 cursor-pointer transition-all border border-white/10 backdrop-blur-md hover:scale-110 active:scale-95 z-50 group shadow-xl"
                    aria-label="Next video"
                  >
                    <ChevronRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            );
          })()
        )}

        {/* Cinematic dark lightbox overlay presentation for images with side-by-side title & prompt details */}
        {selectedImgUrl && selectedImgItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-pointer overflow-y-auto"
            onClick={() => setSelectedImgUrl(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImgUrl(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white cursor-pointer transition-all border border-white/10 z-50 hover:scale-105 active:scale-95"
              aria-label="Close presentation"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Interactive Dialog Panel Container */}
            <div 
              className="w-full max-w-5xl bg-neutral-900/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 scale-95 md:scale-100 cursor-default my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Left Image Component Block (60%) */}
              <div className="w-full md:w-[60%] bg-black flex items-center justify-center p-4 md:p-8 min-h-[300px] md:min-h-[500px]">
                <img 
                  src={selectedImgUrl} 
                  alt={selectedImgItem.title} 
                  className="max-h-[50vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Details Panel Block (40%) */}
              <div className="w-full md:w-[40%] p-6 md:p-10 flex flex-col justify-between border-t border-white/10 md:border-t-0 md:border-l bg-neutral-950 text-white select-text">
                <div>
                  {/* Category Stamp */}
                  <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                    AI ARCHIVE IMAGE
                  </span>

                  {/* Title Heading */}
                  <h3 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-white mb-6 uppercase">
                    {selectedImgItem.title}
                  </h3>

                  {/* Prompt Text Segment Header */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2 select-none">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">
                        GENERATION PROMPT
                      </span>
                      {/* Copy Prompt Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const p = EXPLORATION_PROMPTS[selectedImgItem.id] || `/imagine prompt: A masterpiece digital painting of ${selectedImgItem.title}, ultra detailed, cinematic lighting, 8k resolution --ar 16:9`;
                          navigator.clipboard.writeText(p);
                          setCopiedPrompt(true);
                          setTimeout(() => setCopiedPrompt(false), 2000);
                        }}
                        className="text-[10px] font-sans font-extrabold text-neutral-200 hover:text-white transition-all cursor-pointer uppercase bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-1 rounded"
                      >
                        {copiedPrompt ? "COPIED" : "COPY PROMPT"}
                      </button>
                    </div>

                    {/* Preformatted Prompt Panel */}
                    <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-xs text-neutral-300 leading-relaxed break-words">
                      {EXPLORATION_PROMPTS[selectedImgItem.id] || `/imagine prompt: ${selectedImgItem.title}, cinematic visual study, expressive composition, refined art direction --ar 16:9`}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer block inside sidebar card */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500 select-none">
                  <span>ARCHIVE IMAGE</span>
                  <span>LOCAL UPLOAD</span>
                </div>

              </div>

            </div>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
