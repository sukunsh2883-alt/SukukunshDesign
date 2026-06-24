import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, Palette } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectsExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
}

const FILTERS = [
  { id: "all", label: "all" },
  { id: "illustration", label: "illustration" },
  { id: "motion design", label: "motion design" },
  { id: "ui ux", label: "ui ux" },
  { id: "infographic design", label: "infographic design" },
  { id: "animation", label: "animation" },
  { id: "branding", label: "branding" },
  { id: "logo design", label: "logo design" },
  { id: "game design", label: "game design" },
  { id: "packaging design", label: "packaging design" },
  { id: "other design works", label: "other design works" }
];

const UPCOMING_PROJECTS = [
  {
    id: "upcoming-1",
    title: "Brand Identity Framework",
    type: "branding",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_44_cmxx0z.png"
  },
  {
    id: "upcoming-2",
    title: "Cinematic Motion Graphics",
    type: "motion design",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_45_v8v8q2.png"
  },
  {
    id: "upcoming-3",
    title: "Spatial Interface Lab",
    type: "ui ux",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_46_p7u9p1.png"
  },
  {
    id: "upcoming-4",
    title: "Experimental Risography",
    type: "illustration",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_47_x8c8q3.png"
  },
  {
    id: "upcoming-5",
    title: "Kinetic Identity Monogram",
    type: "logo design",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_48_y2c8p4.png"
  },
  {
    id: "upcoming-6",
    title: "Interactive Wayfinding Study",
    type: "infographic design",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_49_b7v8r5.png"
  }
];

export default function ProjectsExplorer({ isOpen, onClose, projects, onSelectProject }: ProjectsExplorerProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const matchFilter = (project: DesignProject, filterId: string) => {
    if (filterId === "all") return true;
    const f = filterId.toLowerCase().trim();
    const title = project.title.toLowerCase();
    const desc = project.description.toLowerCase();
    const type = project.type.toLowerCase();

    if (f === "illustration") {
      return type.includes("illustration") || type.includes("photo") || desc.includes("illustration") || desc.includes("art") || desc.includes("risography");
    }
    if (f === "motion design") {
      return type.includes("motion") || type.includes("video") || type.includes("promo") || desc.includes("motion") || desc.includes("video") || desc.includes("after effects");
    }
    if (f === "ui ux") {
      return type.includes("ui") || type.includes("ux") || type.includes("interface") || type.includes("app") || type.includes("web");
    }
    if (f === "infographic design") {
      return type.includes("infographic") || type.includes("diagram") || type.includes("map") || desc.includes("pedagogy") || desc.includes("rules") || desc.includes("map");
    }
    if (f === "animation") {
      return type.includes("animation") || desc.includes("animation") || desc.includes("character run") || desc.includes("anim");
    }
    if (f === "branding") {
      return type.includes("brand") || type.includes("identity") || desc.includes("branding") || desc.includes("corporate");
    }
    if (f === "logo design") {
      return type.includes("logo") || type.includes("monogram") || desc.includes("logo") || desc.includes("calligraphy");
    }
    if (f === "game design") {
      return type.includes("game") || type.includes("board") || desc.includes("game") || desc.includes("aftershock");
    }
    if (f === "packaging design") {
      return type.includes("pack") || type.includes("box") || desc.includes("package") || desc.includes("packaging");
    }
    if (f === "other design works") {
      const standardKeys = ["illustration", "motion", "ui", "ux", "infographic", "animation", "brand", "identity", "logo", "monogram", "game", "board", "pack", "box"];
      const isStandard = standardKeys.some(key => type.includes(key) || desc.includes(key));
      return !isStandard;
    }
    return false;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCat = matchFilter(project, selectedFilter);
      return matchCat;
    });
  }, [selectedFilter, projects]);

  const filteredUpcoming = useMemo(() => {
    return UPCOMING_PROJECTS.filter((project) => {
      if (selectedFilter === "all") return true;
      return project.type === selectedFilter;
    });
  }, [selectedFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white overflow-y-auto select-none"
      >
        {/* Main Content Area */}
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-12 md:pt-32 md:pb-20 relative">
          
          {/* Close Action Portal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-12 md:right-12 p-3 rounded-full hover:bg-neutral-100 text-neutral-800 transition-all active:scale-95 cursor-pointer border border-neutral-200"
            aria-label="Close page"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Section Heading Title */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-5xl md:text-8xl font-sans font-semibold tracking-tight text-neutral-800 select-none">
              Selected Work
            </h1>
          </div>

          {/* Search Box and Filters Bar layout */}
          <div className="flex items-center gap-4 mb-12 overflow-hidden">
            {/* Filter Pill List */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
              <div className="flex flex-nowrap gap-2">
                {FILTERS.map((filter) => {
                  const isActive = selectedFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`shrink-0 whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-sans font-medium tracking-normal transition-all cursor-pointer select-none border ${
                        isActive
                          ? "bg-black border-black text-white shadow-sm font-semibold"
                          : "bg-white border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-400"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seamless Content Grid Streams */}
          {(filteredProjects.length > 0 || filteredUpcoming.length > 0) ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              {filteredProjects.map((project, idx) => (
                <motion.a
                  layout
                  key={project.id}
                  href={project.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProject(project);
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.35) }}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Card container carrying ONLY the image for high-end minimalistic seamless layout */}
                  <div className="relative w-full aspect-[1.5] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-150/40 shadow-sm z-0">
                    
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Translucent overlay matching physical artwork prints */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full bg-[#FF6A00] text-white text-[10px] font-mono font-extrabold tracking-widest uppercase shadow-lg shadow-[#FF6A00]/20 flex items-center gap-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span>VIEW ON BEHANCE</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Heading OUT of card with clean editorial weight */}
                  <div className="mt-4 flex items-baseline flex-wrap gap-2 text-left select-none">
                    <span className="font-medium text-neutral-800 text-sm sm:text-base tracking-normal hover:text-neutral-950">
                      {project.title}
                    </span>
                    <span className="text-neutral-300 font-light select-none">/</span>
                    <span className="text-neutral-500 text-xs sm:text-sm font-sans font-normal">
                      {project.type}
                    </span>
                  </div>

                </motion.a>
              ))}

              {/* Render 6 Upcoming Projects with Adding Soon on Thumbnail */}
              {filteredUpcoming.map((project, idx) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min((filteredProjects.length + idx) * 0.05, 0.45) }}
                  className="group flex flex-col select-none"
                >
                  {/* Card container carrying the overlay image */}
                  <div className="relative w-full aspect-[1.5] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/40 shadow-sm z-0">
                    
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 opacity-20 filter grayscale saturate-50 contrast-125 brightness-[0.4]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Highly polished, vibrant overlay stating ADDING SOON and 6 More Projects */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                      <div className="px-3 py-1.5 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/40 text-[#FF6A00] text-[9px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 mb-2.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                        <span>ADDING SOON</span>
                      </div>
                      <p className="text-white/85 text-[10px] md:text-xs font-mono tracking-widest uppercase font-semibold text-center drop-shadow-sm">
                        6 More Projects
                      </p>
                    </div>
                  </div>

                  {/* Heading OUT of card with clean editorial weight */}
                  <div className="mt-4 flex items-baseline flex-wrap gap-2 text-left">
                    <span className="font-medium text-neutral-400 text-sm sm:text-base tracking-normal">
                      {project.title}
                    </span>
                    <span className="text-neutral-200 font-light select-none">/</span>
                    <span className="text-neutral-500 text-xs sm:text-sm font-sans font-normal uppercase tracking-wider text-[10px]">
                      {project.type}
                    </span>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border border-neutral-100 bg-neutral-50/50 rounded-2xl">
              <Palette className="w-10 h-10 text-neutral-300 mb-4" />
              <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-neutral-600">
                No Projects Spotted
              </h3>
              <p className="text-neutral-400 text-xs font-sans mt-1.5">
                Try adjusting filters.
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
