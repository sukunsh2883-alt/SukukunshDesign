import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

const columnClasses = [
  "project-column-left",
  "project-column-center md:pt-16",
  "project-column-right md:pt-8",
];

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const displayedProjects = projects.slice(0, 9);
  const columns = [0, 1, 2].map((columnIndex) =>
    displayedProjects.filter((_, index) => index % 3 === columnIndex),
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768;
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.from(".projects-heading", {
        y: 34,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
      });

      if (reduceMotion) {
        gsap.set(".projects-grid, .project-card", { clearProps: "all" });
        return;
      }

      const projectTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: isMobile || isTouch ? "top 82%" : "top center",
          end: isMobile || isTouch ? "bottom 80%" : "bottom bottom",
          scrub: isMobile || isTouch ? 0.6 : 1,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "power1.inOut",
        },
      });

      projectTl
        .fromTo(
          ".projects-grid",
          {
            scale: isMobile || isTouch ? 1.4 : 3,
            transformOrigin: "center top",
          },
          {
            scale: 1,
            transformOrigin: "center top",
          },
          "start",
        )
        .from(
          ".project-column-left .project-card",
          {
            xPercent: (index) => -((index + 1) * 40 + index * 80),
            yPercent: (index) => (index + 1) * 35 + index * 80,
            opacity: isMobile || isTouch ? 0.72 : 1,
            duration: 0.8,
          },
          "start",
        )
        .from(
          ".project-column-right .project-card",
          {
            xPercent: (index) => ((index + 1) * 40 + index * 80),
            yPercent: (index) => (index + 1) * 35 + index * 80,
            opacity: isMobile || isTouch ? 0.72 : 1,
            duration: 0.8,
          },
          "start",
        )
        .from(
          ".project-column-center .project-card",
          {
            yPercent: isMobile || isTouch ? 45 : 80,
            opacity: 0.6,
            duration: 0.8,
          },
          "start",
        )
        .fromTo(
          ".see-all-projects",
          {
            opacity: 0,
            y: 24,
            pointerEvents: "none",
          },
          {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power2.out",
          },
          0.78,
        );

      const refresh = () => ScrollTrigger.refresh();
      const media = Array.from(section.querySelectorAll("img")) as HTMLImageElement[];
      media.forEach((image) => {
        if (image.complete) return;
        image.addEventListener("load", refresh, { once: true });
        image.addEventListener("error", refresh, { once: true });
        cleanupFns.push(
          () => image.removeEventListener("load", refresh),
          () => image.removeEventListener("error", refresh),
        );
      });

      const refreshTimer = window.setTimeout(refresh, 280);
      cleanupFns.push(() => window.clearTimeout(refreshTimer));
    }, section);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  const renderProjectCard = (project: DesignProject, index: number) => (
    <button
      key={project.id}
      type="button"
      onClick={() => onSelectProject(project)}
      className="project-card group block w-full text-left"
    >
      <div className="project-card__frame relative aspect-square w-full overflow-hidden bg-[#ddd8cb]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-center"
          loading={index > 2 ? "lazy" : "eager"}
          referrerPolicy="no-referrer"
        />
      </div>
    </button>
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section overflow-hidden bg-[#f4f1e8] px-6 py-16 text-[#14120f] md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="projects-heading mb-8 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
              Selected Project
            </h2>
          </div>
        </div>

        <div className="projects-grid grid gap-5 md:grid-cols-3 md:gap-6">
          {columns.map((columnProjects, columnIndex) => (
            <div
              key={columnClasses[columnIndex]}
              className={`${columnClasses[columnIndex]} flex flex-col gap-5 md:gap-6`}
            >
              {columnProjects.map((project, index) =>
                renderProjectCard(project, columnIndex + index * 3),
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onOpenExplorer}
            className="see-all-projects"
          >
            See All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
