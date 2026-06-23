import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AIFilm, VideoCard } from "../portfolioData";
import { X } from "lucide-react";

interface AIWorksProps {
  films: AIFilm[];
  videos: VideoCard[];
  onSelectFilm: (film: AIFilm) => void;
  onSelectVideo: (video: VideoCard) => void;
  onOpenExplorer: () => void;
}

export default function AIWorks({
  films,
  videos,
  onSelectFilm,
  onSelectVideo,
  onOpenExplorer,
}: AIWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<any>(null);

  // Get first film as hero card, rest as grid
  const heroFilm = films[0];
  const restFilms = films.slice(1, 4);
  const restVideos = videos.slice(0, 2);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".ai-works-header", {
        opacity: 0,
        y: 60,
        filter: "blur(16px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ai-works-section",
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
      });

      if (!isMobile) {
        // Hero card entrance
        gsap.from(".ai-hero-card", {
          opacity: 0,
          scale: 0.85,
          y: 100,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top 65%",
            end: "center center",
            scrub: 1,
          },
        });

        // Grid cards staggered entrance
        gsap.from(".ai-grid-card", {
          opacity: 0,
          y: 80,
          scale: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top 55%",
            end: "center top",
            scrub: 1,
          },
        });
      } else {
        // Mobile simpler animations
        gsap.from(".ai-hero-card, .ai-grid-card", {
          opacity: 0,
          y: 40,
          scale: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top 65%",
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleExpandCard = (film: AIFilm) => {
    setExpandedData(film);
    setExpandedCardId(film.id);
  };

  const handleCloseExpanded = () => {
    gsap.to(".expanded-card-overlay", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        setExpandedCardId(null);
        setExpandedData(null);
      },
    });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="ai-works-section relative overflow-hidden bg-[#050505] min-h-screen py-20 md:py-32"
        id="ai-works"
      >
        {/* Header */}
        <div className="ai-works-header w-11/12 md:w-[min(900px,90vw)] mx-auto mb-12 md:mb-16 text-center">
          <p className="text-xs md:text-sm font-mono tracking-widest text-white/50 uppercase mb-4">
            AI Works
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold text-white mb-4">
            AI Films & Experiments
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
            Selected AI-powered ads, films, and visual experiments.
          </p>
        </div>

        {/* Hero Card - Full Width */}
        {heroFilm && (
          <div
            className="ai-hero-card group relative w-11/12 md:w-[min(95%,1200px)] mx-auto mb-12 overflow-hidden rounded-3xl bg-black cursor-pointer h-64 md:h-[500px] lg:h-[600px] transform-gpu will-change-transform"
            onClick={() => handleExpandCard(heroFilm)}
          >
            {/* Video/Image Background */}
            <video
              src={heroFilm.videoUrl}
              poster={heroFilm.thumbnail}
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Content - Bottom Left */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
              <span className="inline-block text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase mb-3 md:mb-4 px-3 py-1 border border-white/20 rounded-full">
                Featured AI Film
              </span>
              <h3 className="text-2xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-2 transition-all duration-300 group-hover:text-white">
                {heroFilm.title}
              </h3>
              <p className="text-sm md:text-base text-white/60">
                {heroFilm.category}
              </p>
            </div>

            {/* Play Indicator - Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Grid Cards - Smaller Thumbnails */}
        <div className="w-11/12 md:w-[min(95%,1200px)] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Rest of Films */}
            {restFilms.map((film) => (
              <div
                key={film.id}
                className="ai-grid-card group relative aspect-[4/5] overflow-hidden rounded-2xl bg-black cursor-pointer transform-gpu will-change-transform hover:scale-105 transition-transform duration-500"
                onClick={() => handleExpandCard(film)}
              >
                <video
                  src={film.videoUrl}
                  poster={film.thumbnail}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase mb-1">
                    AI Film
                  </p>
                  <h4 className="text-xs md:text-sm font-sans font-semibold text-white line-clamp-2">
                    {film.title}
                  </h4>
                </div>
              </div>
            ))}

            {/* Rest of Videos */}
            {restVideos.map((video) => (
              <div
                key={video.id}
                className="ai-grid-card group relative aspect-[4/5] overflow-hidden rounded-2xl bg-black cursor-pointer transform-gpu will-change-transform hover:scale-105 transition-transform duration-500"
                onClick={() => onSelectVideo(video)}
              >
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase mb-1">
                    AI Reel
                  </p>
                  <h4 className="text-xs md:text-sm font-sans font-semibold text-white line-clamp-2">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <button
            onClick={onOpenExplorer}
            className="px-8 py-3 text-xs md:text-sm font-mono tracking-widest uppercase text-white border border-white/30 hover:border-white hover:bg-white/5 transition-all rounded-full"
          >
            View All AI Works
          </button>
        </div>
      </section>

      {/* Expanded Fullscreen Card */}
      {expandedCardId && expandedData && (
        <div
          className="expanded-card-overlay fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={handleCloseExpanded}
        >
          <div
            className="w-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video */}
            <video
              src={expandedData.videoUrl}
              poster={expandedData.thumbnail}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />

            {/* Close Button */}
            <button
              onClick={handleCloseExpanded}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 md:p-10">
              <p className="text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase mb-2">
                {expandedData.category}
              </p>
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-white">
                {expandedData.title}
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
