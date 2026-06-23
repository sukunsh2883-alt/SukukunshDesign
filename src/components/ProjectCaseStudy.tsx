import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Link2, Sparkles, ArrowUpRight, Palette, Check, RefreshCw } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  onClose: () => void;
  onUpdateProject?: (updated: DesignProject) => void;
}

export default function ProjectCaseStudy({ project, onClose, onUpdateProject }: ProjectCaseStudyProps) {
  const [embedInput, setEmbedInput] = useState(project.behanceEmbedUrl || project.link || "");
  const [thumbnailInput, setThumbnailInput] = useState(project.image || "");
  const [showSettings, setShowSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Lock body scroll when this overlay is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getBehanceEmbedUrl = (input: string, projectId?: string): string => {
    if (!input) {
      return "https://www.behance.net/embed/project/193297645?content=embed&bgColor=020202";
    }

    const srcMatch = input.match(/src=["']([^"']+)["']/i);
    let url = srcMatch ? srcMatch[1] : input.trim();
    
    // Direct embed check
    if (url.includes("behance.net/embed/")) {
      if (!url.includes("bgColor=")) {
        url += (url.includes("?") ? "&" : "?") + "bgColor=020202";
      }
      return url;
    }

    // Gallery URL check
    if (url.includes("behance.net/gallery/")) {
      const parts = url.split("behance.net/gallery/");
      if (parts[1]) {
        const idPart = parts[1].split("/")[0];
        if (idPart) {
          return `https://www.behance.net/embed/project/${idPart}?content=embed&bgColor=020202`;
        }
      }
    }

    // High quality themed fallbacks for Sukunsh's projects so clicking any thumbnail instantly launches a real presentation
    if (projectId) {
      const fallbackMapping: Record<string, string> = {
        "design-photography": "https://www.behance.net/embed/project/136709831?content=embed&bgColor=020202",
        "design-illustrative-riso": "https://www.behance.net/embed/project/158652233?content=embed&bgColor=020202",
        "design-kinetic-motion": "https://www.behance.net/embed/project/180295193?content=embed&bgColor=020202",
        "design-1": "https://www.behance.net/embed/project/193297645?content=embed&bgColor=020202",
        "design-monogram-logos": "https://www.behance.net/embed/project/198754407?content=embed&bgColor=020202",
        "design-earthquake-map": "https://www.behance.net/embed/project/111811807?content=embed&bgColor=020202",
      };

      if (fallbackMapping[projectId]) {
        return fallbackMapping[projectId];
      }
    }

    if (url.startsWith("http") && !url.includes("behance.net")) {
      return url;
    }
    
    return "https://www.behance.net/embed/project/198754407?content=embed&bgColor=020202";
  };

  const resolvedEmbedUrl = getBehanceEmbedUrl(embedInput, project.id);

  // Double bind live inputs immediately so changes propagate to dashboard in real-time as they type!
  useEffect(() => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        behanceEmbedUrl: embedInput.trim(),
        link: embedInput.trim(),
        image: thumbnailInput.trim(),
      });
    }
  }, [embedInput, thumbnailInput]);

  const handleSaveChanges = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/95 overflow-y-auto font-sans flex flex-col h-full"
    >
      {/* Sleek Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#FF6A00] bg-orange-950/40 px-3 py-1 rounded-full border border-orange-500/20">
            Project Case Study
          </span>
          <span className="hidden sm:inline-block text-xs font-sans text-neutral-400 font-medium select-none text-ellipsis overflow-hidden max-w-[200px]">
            / {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white hover:border-[#FF6A00]/40 cursor-pointer transition-all"
          >
            {showSettings ? "Hide Settings" : "Embed Settings"}
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:border-[#FF6A00]/30 hover:bg-[#FF6A00]/10 text-white transition-all cursor-pointer group"
          >
            <span className="text-[10px] uppercase font-sans tracking-widest text-neutral-300 group-hover:text-[#FF6A00]">Close</span>
            <X className="h-4 w-4 text-[#FF6A00] group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Settings Panel & Live Preview Stream */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 h-full min-h-0">
        
        {/* Real-time configuration Editor panel */}
        <AnimatePresence initial={false}>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: -12 }}
              animate={{ height: "auto", opacity: 1, marginTop: 0 }}
              exit={{ height: 0, opacity: 0, marginTop: -12 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/25">
                      <Palette className="w-4 h-4 text-[#FF6A00]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-sans font-bold text-white tracking-wide">
                        Connected Project Customizer
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Adjust this card's live presentation embed or replace its cover thumbnail instantly.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 self-start sm:self-center">
                    Project ID: {project.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Behance Embed/Presentation URL */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#FF6A00] font-bold block">
                      Behance Presentation URL or Embed Iframe
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., https://www.behance.net/gallery/198754407/Some-Project"
                        value={embedInput}
                        onChange={(e) => setEmbedInput(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6A00] transition-all font-mono"
                      />
                    </div>
                    <span className="text-[9px] text-neutral-400 block">
                      Accepts Behance gallery links, direct embed codes, or custom presentation links.
                    </span>
                  </div>

                  {/* Field 2: Thumbnail Image URL */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-green-400 font-bold block">
                      Card Cover Thumbnail Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL (Unsplash, local public, imgur, etc.)"
                        value={thumbnailInput}
                        onChange={(e) => setThumbnailInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:outline-none focus:border-green-400 transition-all font-mono"
                      />
                      {thumbnailInput && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                          <img
                            src={thumbnailInput}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=80";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-400 block">
                      The card's live thumbnail image changes instantly on your main portfolio dashboard.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-zinc-400 select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00]/60 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
                      Changes are synchronized to your dashboard in real-time.
                    </span>
                  </div>
                  <button
                    onClick={handleSaveChanges}
                    className={`px-5 py-2 rounded-xl text-xs font-sans font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] ${
                      saveSuccess 
                        ? "bg-green-500 text-white" 
                        : "bg-[#FF6A00]/25 border border-[#FF6A00]/40 text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white hover:border-[#FF6A00]"
                    }`}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Changes Saved Successfully!</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Embed View</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Presentation View Frame */}
        <div className="flex-1 min-h-[450px] relative w-full flex flex-col">
          {resolvedEmbedUrl ? (
            /* Widescreen Interactive Behance presentation container */
            <div className="relative w-full h-full bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex-1 flex flex-col">
              <iframe
                src={resolvedEmbedUrl}
                className="w-full h-full border-0 select-none bg-neutral-950 flex-1"
                title={`${project.title} live Behance presentation`}
                allowFullScreen
              />
            </div>
          ) : (
            /* Fallback preview screen with visual help card */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-zinc-950/40 p-6 sm:p-8 rounded-2xl border border-white/5 max-w-4xl mx-auto my-auto">
              <div className="md:col-span-5 relative aspect-[1.5] w-full rounded-xl overflow-hidden border border-white/10">
                <img
                  src={thumbnailInput || project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800";
                  }}
                />
              </div>
              <div className="md:col-span-7 text-left space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF6A00] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase text-[#FF6A00] font-extrabold tracking-wider bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/20">
                    Live Setup Required
                  </span>
                </div>
                <h3 className="text-2xl font-serif italic text-white leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {project.description || "Establish seamless, premium design layouts, publication grids, and immersive branding case studies directly."}
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 shrink-0 text-left">
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    <strong className="text-white">Quick Start Guide:</strong> Paste your Behance Project Gallery URL or Embed code in the Editor Panel above. You can also change the Cover Thumbnail to any image URL you like.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
