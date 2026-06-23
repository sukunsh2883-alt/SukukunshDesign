import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Subcomponents
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMist from "./components/AboutMist";
import Footer from "./components/Footer";
import Lightbox from "./components/Lightbox";
import AdminPanel from "./components/AdminPanel";
import ProjectCaseStudy from "./components/ProjectCaseStudy";
import ProjectsExplorer from "./components/ProjectsExplorer";
import AIWorkExplorer from "./components/AIWorkExplorer";
import FullResumeModal from "./components/FullResumeModal";
import AboutMeModal from "./components/AboutMeModal";
import ScrollShowcase from "./components/ScrollShowcase";

// State Engines and Credentials
import {
  aiFilms as initialFilms,
  designProjects as initialDesigns,
  videos as initialVideos,
  explorations as initialExplorations,
  AIFilm,
  DesignProject,
  VideoCard,
  ExplorationItem,
  profile
} from "./portfolioData";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Dynamic portfolio item states for local uploader simulations with localStorage persistence
  const [profileState, setProfileState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("portfolio_profile");
      if (!saved) return profile;

      const savedProfile = JSON.parse(saved);
      const legacyPortrait = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";
      const hasOldImage = !savedProfile.aboutImage || 
                          savedProfile.aboutImage === legacyPortrait || 
                          savedProfile.aboutImage.includes("Screenshot_2026-06-03_165617_seilm1");

      return {
        ...profile,
        ...savedProfile,
        aboutImage: hasOldImage ? profile.aboutImage : savedProfile.aboutImage,
        aboutImageSecondary: savedProfile.aboutImageSecondary || profile.aboutImageSecondary,
      };
    } catch (e) {
      return profile;
    }
  });

  const [films, setFilms] = useState<AIFilm[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_films");
      if (saved) {
        const savedFilms = JSON.parse(saved);
        const savedFilmIds = new Set(savedFilms.map((film: AIFilm) => film.id));
        const missingInitialFilms = initialFilms.filter((film) => !savedFilmIds.has(film.id));

        if (missingInitialFilms.length > 0) {
          return [...missingInitialFilms, ...savedFilms];
        }

        return savedFilms;
      }
      return initialFilms;
    } catch (e) {
      return initialFilms;
    }
  });

  const [designs, setDesigns] = useState<DesignProject[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_designs");
      if (saved) {
        const savedDesigns = JSON.parse(saved);
        return savedDesigns.map((d: DesignProject) => {
          const matchInitial = initialDesigns.find(init => init.id === d.id);
          if (matchInitial && (d.image.includes("unsplash.com") || d.image.includes("images.unsplash.com"))) {
            return {
              ...d,
              image: matchInitial.image,
              galleryImages: matchInitial.galleryImages || d.galleryImages
            };
          }
          return d;
        });
      }
      return initialDesigns;
    } catch (e) {
      return initialDesigns;
    }
  });

  const [videosState, setVideosState] = useState<VideoCard[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_videos");
      if (saved) {
        const savedVideos = JSON.parse(saved);
        const savedVideoIds = new Set(savedVideos.map((video: VideoCard) => video.id));
        const missingInitialVideos = initialVideos.filter((video) => !savedVideoIds.has(video.id));

        if (missingInitialVideos.length > 0) {
          return [...missingInitialVideos, ...savedVideos];
        }

        return savedVideos;
      }
      return initialVideos;
    } catch (e) {
      return initialVideos;
    }
  });

  const [explorationsState, setExplorationsState] = useState<ExplorationItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_explorations");
      return saved ? JSON.parse(saved) : initialExplorations;
    } catch (e) {
      return initialExplorations;
    }
  });

  const [selectedDesignProject, setSelectedDesignProject] = useState<DesignProject | null>(null);
  
  // Interactive full portal screen triggers
  const [isProjectsExplorerOpen, setIsProjectsExplorerOpen] = useState(false);
  const [isAIWorkExplorerOpen, setIsAIWorkExplorerOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isScrollShowcaseOpen, setIsScrollShowcaseOpen] = useState(false);

  const closePortals = () => {
    setIsProjectsExplorerOpen(false);
    setIsAIWorkExplorerOpen(false);
    setIsResumeOpen(false);
    setIsAboutMeOpen(false);
    setIsScrollShowcaseOpen(false);
  };

  const openPortal = (portal: "projects" | "ai-work" | "resume" | "about" | "scroll-demo") => {
    closePortals();

    if (portal === "projects") {
      setIsProjectsExplorerOpen(true);
    } else if (portal === "ai-work") {
      setIsAIWorkExplorerOpen(true);
    } else if (portal === "resume") {
      setIsResumeOpen(true);
    } else if (portal === "scroll-demo") {
      setIsScrollShowcaseOpen(true);
    } else {
      setIsAboutMeOpen(true);
    }

    window.history.pushState({ portal }, "", `#${portal}`);
  };

  const closePortalWithHistory = () => {
    if (window.history.state?.portal) {
      window.history.back();
      return;
    }
    closePortals();
  };

  useEffect(() => {
    const handlePopState = () => {
      closePortals();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768;
    if (reduceMotion || isTouch || isMobile) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      speed: isScrollShowcaseOpen ? 2 : 1.2,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 350);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", refresh);
      smoother.kill();
    };
  }, [isLoading, isScrollShowcaseOpen]);

  // Synchronize state down to localStorage so data persists securely across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem("portfolio_profile", JSON.stringify(profileState));
    } catch (e) {
      console.error("Failed to persist profile state to localStorage", e);
    }
  }, [profileState]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_films", JSON.stringify(films));
    } catch (e) {
      console.error("Failed to persist films state to localStorage", e);
    }
  }, [films]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_designs", JSON.stringify(designs));
    } catch (e) {
      console.error("Failed to persist designs state to localStorage", e);
    }
  }, [designs]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_videos", JSON.stringify(videosState));
    } catch (e) {
      console.error("Failed to persist videos state to localStorage", e);
    }
  }, [videosState]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_explorations", JSON.stringify(explorationsState));
    } catch (e) {
      console.error("Failed to persist explorations state to localStorage", e);
    }
  }, [explorationsState]);

  // Lightbox view state managers
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    mediaType: "image" as "image" | "video",
    src: "",
    title: "",
    category: "",
    description: ""
  });

  // Seamless unified portal-to-portal navigation switcher
  const handleNavigate = (targetId: string) => {
    const id = targetId.replace("#", "");

    // Close all active portal view states
    closePortals();

    if (targetId === "#projects" || targetId === "#scroll-demo") {
      setTimeout(() => {
        const element = document.getElementById("scroll-demo");
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 50);
    } else if (targetId === "#full-resume") {
      openPortal("resume");
    } else if (targetId === "#about-me-modal") {
      openPortal("about");
    } else {
      // Small delay to allow any transition state to settle, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = id === "home" ? 0 : 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: id === "home" ? 0 : offsetPosition,
            behavior: "smooth"
          });
        }
      }, 50);
    }
  };

  // Track active visual section via scroll listener
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      const sections = ["home", "scroll-demo", "contact"];
      const triggerY = window.innerHeight * 0.35; // 35% down the screen
      
      let currentSection = "home";
      let closestSection = "home";
      let minDistance = Infinity;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element spans across the trigger line, it is immediately the active section
          if (rect.top <= triggerY && rect.bottom >= triggerY) {
            setActiveSection(sectionId);
            return;
          }
          // Proximity checkpoint
          const dist = Math.abs(rect.top - triggerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestSection = sectionId;
          }
        }
      }
      setActiveSection(closestSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call once to initialize
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  // Triggers main showreel lightbox projection
  const handleLaunchShowreel = () => {
    const featuredReel = videosState[0];

    setLightbox({
      isOpen: true,
      mediaType: "video",
      src: featuredReel?.videoUrl || profileState.heroVideoUrl,
      title: featuredReel?.title || "Sukunsh Visual Showreel 2026",
      category: featuredReel?.type || "Creative Reel",
      description: "A concise motion reel showing product ads, AI film studies, kinetic layouts, and cinematic visual direction."
    });
  };

  const handleSelectProject = (project: DesignProject) => {
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    } else {
      setSelectedDesignProject(project);
    }
  };

  const handleAddFilm = (newFilm: AIFilm) => {
    setFilms((prev) => [newFilm, ...prev]);
  };

  const handleAddDesign = (newDesign: DesignProject) => {
    setDesigns((prev) => [newDesign, ...prev]);
  };

  const handleAddVideo = (newVideo: VideoCard) => {
    setVideosState((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="app page relative min-h-screen overflow-x-hidden overflow-y-visible bg-[#050505] text-neutral-900 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" profile={profileState} onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header Floating navigation bar */}
            {!isScrollShowcaseOpen && (
              <Navbar 
                profile={profileState}
                activeSection={
                  isAboutMeOpen ? "about-me" :
                  isResumeOpen ? "full-resume" :
                  isAIWorkExplorerOpen ? "ai-work" :
                  isProjectsExplorerOpen ? "projects" :
                  activeSection
                }
                onNavigate={handleNavigate}
                onOpenProjects={() => handleNavigate("#projects")}
                onOpenAIWork={() => handleNavigate("#ai-work")}
                onOpenResume={() => handleNavigate("#full-resume")}
                onOpenAboutMe={() => handleNavigate("#about-me-modal")}
              />
            )}

            <div id="smooth-wrapper">
              <div id="smooth-content" className="flex min-h-screen flex-col">
                {/* Main view container */}
                <main className="main flex-grow overflow-x-hidden overflow-y-visible">

                  {isScrollShowcaseOpen ? (
                    <ScrollShowcase
                      onClose={() => setIsScrollShowcaseOpen(false)}
                      onOpenProjects={() => openPortal("projects")}
                      onOpenVideo={(videoUrl, title) => {
                        setLightbox({
                          isOpen: true,
                          mediaType: "video",
                          src: videoUrl,
                          title: title,
                          category: "AI Film",
                          description: "Cinematic commercial design production"
                        });
                      }}
                    />
                  ) : (
                    <>
                      {/* Cinematic hero section */}
                      <Hero
                        profile={profileState}
                        onWatchShowreel={handleLaunchShowreel}
                        onOpenProjects={() => handleNavigate("#scroll-demo")}
                        onOpenAIWork={() => handleNavigate("#scroll-demo")}
                      />

                      <AboutMist />

                      {/* Dynamic GSAP Scroll Showcase Section */}
                      <div id="scroll-demo">
                        <ScrollShowcase
                          isInline={true}
                          onOpenProjects={() => openPortal("projects")}
                          onOpenVideo={(videoUrl, title) => {
                            setLightbox({
                              isOpen: true,
                              mediaType: "video",
                              src: videoUrl,
                              title: title,
                              category: "AI Film",
                              description: "Cinematic commercial design production"
                            });
                          }}
                        />
                      </div>
                    </>
                  )}

                </main>

                {/* Marqueed footer section */}
                {!isScrollShowcaseOpen && <Footer profile={profileState} />}
              </div>
            </div>

            {/* Floating portfolio control admin panel */}
            <AdminPanel
              onAddFilm={handleAddFilm}
              onAddDesign={handleAddDesign}
              onAddVideo={handleAddVideo}
              onAddExploration={(newExp) => setExplorationsState((prev) => [newExp, ...prev])}
              profile={profileState}
              onUpdateProfile={setProfileState}
              designs={designs}
              onUpdateDesigns={setDesigns}
              films={films}
              onUpdateFilms={setFilms}
              videos={videosState}
              onUpdateVideos={setVideosState}
              explorations={explorationsState}
              onUpdateExplorations={setExplorationsState}
            />

            {/* Cinematic media projection lightbox */}
            <Lightbox
              isOpen={lightbox.isOpen}
              mediaType={lightbox.mediaType}
              src={lightbox.src}
              title={lightbox.title}
              category={lightbox.category}
              description={lightbox.description}
              onClose={() =>
                setLightbox((prev) => ({ ...prev, isOpen: false }))
              }
            />

            {/* Interactive Fullscreen Portals */}
            <AnimatePresence>
              {isProjectsExplorerOpen && (
                <ProjectsExplorer
                  isOpen={isProjectsExplorerOpen}
                  onClose={closePortalWithHistory}
                  projects={designs}
                  onSelectProject={handleSelectProject}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAIWorkExplorerOpen && (
                <AIWorkExplorer
                  isOpen={isAIWorkExplorerOpen}
                  onClose={closePortalWithHistory}
                  films={films}
                  videos={videosState}
                  explorations={explorationsState}
                  onSelectFilm={(film) => {
                    setLightbox({
                      isOpen: true,
                      mediaType: "video",
                      src: film.videoUrl,
                      title: film.title,
                      category: film.category,
                      description: film.description
                    });
                  }}
                  onSelectVideo={(video) => {
                    setLightbox({
                      isOpen: true,
                      mediaType: "video",
                      src: video.videoUrl,
                      title: video.title,
                      category: video.type,
                      description: `${video.duration} motion reel / ${video.year}`
                    });
                  }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isResumeOpen && (
                <FullResumeModal
                  isOpen={isResumeOpen}
                  onClose={closePortalWithHistory}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAboutMeOpen && (
                <AboutMeModal
                  isOpen={isAboutMeOpen}
                  onClose={closePortalWithHistory}
                  profile={profileState}
                />
              )}
            </AnimatePresence>

            {/* Dynamic Fullscreen Case Study Overlay */}
            <AnimatePresence>
              {selectedDesignProject && (
                <ProjectCaseStudy
                  project={designs.find(d => d.id === selectedDesignProject.id) || selectedDesignProject}
                  onClose={() => setSelectedDesignProject(null)}
                  onUpdateProject={(updatedProj) => {
                    setDesigns((prev) => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
