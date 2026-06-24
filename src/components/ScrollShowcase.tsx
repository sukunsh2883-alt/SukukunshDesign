import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Sparkles, Play, ChevronRight } from "lucide-react";
import { DesignProject } from "../portfolioData";

const PROJECT_THUMBNAILS = [
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_44_cmxx0z.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_34_xopufv.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png"
];

interface ScrollShowcaseProps {
  onClose?: () => void;
  isInline?: boolean;
  designs?: DesignProject[];
  onOpenProjects?: () => void;
  onOpenVideo?: (videoUrl: string, title: string) => void;
}

export default function ScrollShowcase({ onClose, isInline = false, designs = [], onOpenProjects, onOpenVideo }: ScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getProjectData = (index: number) => {
    if (designs && designs.length > 0) {
      const item = designs[index % designs.length];
      return {
        image: item.image || PROJECT_THUMBNAILS[index % PROJECT_THUMBNAILS.length],
        title: item.title || "Fine Art Design Project",
        link: item.link || "https://www.behance.net/sukunshsharma"
      };
    }
    return {
      image: PROJECT_THUMBNAILS[index % PROJECT_THUMBNAILS.length],
      title: "Fine Art Design Project",
      link: "https://www.behance.net/sukunshsharma"
    };
  };

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Logo Animation
      if (!isInline) {
        const paths = gsap.utils.toArray(
          ".scroll-showcase #logo-scroll .scroll-letter, .scroll-showcase #logo-smoother .smoother-letter, .scroll-showcase #logo-mouse"
        );
        const byGreensock = document.querySelector(".scroll-showcase #by-greensock");

        const distPaths = gsap.utils.distribute({
          base: -300,
          amount: 600,
        });

        const logoTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".scroll-showcase .logo-section",
            scrub: 1,
            start: "bottom 95%",
            end: "bottom center",
          },
        });

        if (paths.length > 0) {
          logoTl
            .to(paths, { x: distPaths })
            .to([...paths, ...(byGreensock ? [byGreensock] : [])], { opacity: 0 }, 0);
        }
      }

      // 2. Grid Animation
      const gridTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-showcase .grid-section",
          scrub: 1,
          start: "top center",
          end: "bottom+=10% bottom",
        },
        defaults: {
          ease: "power1.inOut",
        },
      });

      gridTl
        .add("start")
        .from(
          ".scroll-showcase .grid-layout",
          {
            ease: "power1",
            scale: 3,
          },
          "start"
        )
        .from(
          ".scroll-showcase .column-1 .grid-image",
          {
            duration: 0.6,
            xPercent: (i: number) => -((i + 1) * 40 + i * 100),
            yPercent: (i: number) => (i + 1) * 40 + i * 100,
          },
          "start"
        )
        .from(
          ".scroll-showcase .column-3 .grid-image",
          {
            duration: 0.6,
            xPercent: (i: number) => (i + 1) * 40 + i * 100,
            yPercent: (i: number) => (i + 1) * 40 + i * 100,
          },
          "start"
        );

      // 3. Parallax Section Animation
      gsap.from(".scroll-showcase .parallax-section", {
        scale: 1 / 3,
        scrollTrigger: {
          trigger: ".scroll-showcase .parallax-section",
          scrub: 1,
        },
      });

      // 4. Pin Section Animation
      const pinSection = document.querySelector(".scroll-showcase .pin-section");
      const pinContent1 = document.querySelector(".scroll-showcase .pin-content-1") as HTMLElement | null;
      const pinContent2 = document.querySelector(".scroll-showcase .pin-content-2") as HTMLElement | null;

      if (pinSection && pinContent1 && pinContent2) {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            pin: true,
            trigger: pinSection,
            scrub: true,
            start: "top top",
            end: () => `+=${pinContent1.offsetWidth}`,
            invalidateOnRefresh: true,
          },
        });

        pinTl.fromTo(
          ".scroll-showcase .pin-content-1",
          {
            x: () => window.innerWidth * 0.9,
          },
          {
            x: () => -(pinContent1.offsetWidth),
            ease: "none",
          },
          0
        );

        pinTl.fromTo(
          ".scroll-showcase .pin-content-2",
          {
            x: () => -pinContent2.offsetWidth + window.innerWidth * 0.1,
          },
          {
            x: () => window.innerWidth,
            ease: "none",
          },
          0
        );
      }
    }, containerRef);

    // Refresh ScrollTrigger to capture heights accurately
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-showcase w-full bg-[#111] text-[#fffced] min-h-screen relative select-none overflow-x-hidden"
    >
      {/* Floating Top Header Banner */}
      {!isInline && onClose && (
        <nav className="fixed top-4 left-4 right-4 z-[200] flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#88ce02] animate-pulse" />
            <span className="text-[11px] md:text-xs uppercase font-sans font-bold tracking-wider text-white">
              GSAP ScrollSmoother Showcase
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-2 px-3 py-1 bg-white/15 hover:bg-[#88ce02] hover:text-black rounded-full text-xs font-semibold tracking-wide transition-all border border-white/10 cursor-pointer"
          >
            <span>Exit Demo</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}

      {/* SVG LOGO SECTION */}
      {!isInline && (
        <header className="logo-section w-full h-screen flex items-center justify-center">
        <svg
          version="1.1"
          id="scroll-smoother-logo-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 827 238"
          className="w-[60%] overflow-visible"
        >
          <g id="logo-scroll-smoother">
            <g id="logo-scroll">
              <path
                className="scroll-letter fill-white"
                d="M13.2,138.9c0.2-2.2,0.9-4.3,2-6.5c1.2-2.1,2.5-3.9,4.1-5.2c7.4,4.5,14.3,6.7,20.6,6.7c2.9,0,5.2-0.7,6.7-2.1c1.5-1.4,2.3-3.1,2.3-5c0-3.4-2.3-6.1-6.8-8.2l-12-5.1c-9.7-4.2-14.5-10.4-14.5-18.7c0-6.2,2.3-11.3,7-15.2c4.7-3.9,10.9-5.9,18.5-5.9s15.2,1.9,22.7,5.8c-0.3,4.7-2.1,8.6-5.3,11.7c-6.9-3.3-13.1-5-18.4-5c-2.8,0-4.9,0.7-6.4,2c-1.5,1.3-2.2,2.8-2.2,4.5c0,2.7,2.1,5,6.3,6.8l12.2,5.1c4.9,2.1,8.7,4.9,11.4,8.3c2.7,3.4,4,7.3,4,11.7c0,6.5-2.3,11.7-6.9,15.7c-4.6,4-11.2,6-19.7,6c-4.2,0-8.6-0.7-13.2-2C21,143.1,16.9,141.2,13.2,138.9z"
              />
              <path
                className="scroll-letter fill-white"
                d="M100.2,116.3c0-0.3,0-0.6,0-0.9c0-3.8-0.4-6.7-1.2-8.6c-0.8-1.9-2.4-2.9-5-2.9c-2.5,0-4.4,1.2-5.4,3.7c-1.1,2.5-1.6,6.4-1.6,11.9c0,5.4,0.8,9.3,2.3,11.6c1.5,2.3,3.9,3.4,7.1,3.4c3.2,0,6.9-1.5,11.2-4.4c1.2,0.7,2.4,1.9,3.6,3.6c1.2,1.7,1.9,3.3,2.2,4.8c-2.3,2.4-5.2,4.3-8.8,5.7c-3.5,1.4-7.2,2.1-10.9,2.1c-7.1,0-12.6-2.4-16.5-7.2c-3.8-4.8-5.8-11.6-5.8-20.2s2.2-15.2,6.6-19.7c4.4-4.5,9.6-6.7,15.7-6.7c6,0,10.9,1.6,14.5,4.7c3.7,3.1,5.5,7.1,5.5,12c0,2.4-0.7,4.3-2,5.6c-1.3,1.3-3.2,1.9-5.6,1.9C103.9,116.8,101.9,116.7,100.2,116.3z"
              />
              <path
                className="scroll-letter fill-white"
                d="M120,101.2c0.3-1.4,0.9-2.8,1.8-4.4c1-1.6,1.9-2.7,2.9-3.5c6.1,0.6,10.2,3.7,12.4,9.2c2.6-6.1,6.9-9.1,12.9-9.1c2.2,0,4.5,0.3,6.6,0.8c0,2-0.3,4.3-1,7.1c-0.7,2.8-1.6,5.1-2.8,7.1c-1.4-0.5-3.1-0.8-5.1-0.9c-3.6,0-6.5,1.8-8.8,5.5V145c-2,0.4-4.5,0.6-7.4,0.6c-2.9,0-5.5-0.2-7.8-0.6v-33.3C123.8,106.6,122.5,103.1,120,101.2z"
              />
              <path
                className="scroll-letter fill-white"
                d="M199.4,98.6c4.9,4.9,7.3,11.9,7.3,21c0,9.1-2.4,16.1-7.3,21c-4,4-9.4,6-16,6c-6.7,0-12-2-16-6c-4.9-4.9-7.3-11.9-7.3-21c0-9.1,2.4-16.1,7.3-21c4-3.9,9.3-5.9,16-5.9C190,92.7,195.4,94.6,199.4,98.6z M177.2,108.1c-1.1,2.7-1.6,6.6-1.6,11.5c0,5,0.5,8.8,1.6,11.5c1.1,2.7,3.1,4,6.2,4s5.1-1.3,6.2-4c1.1-2.7,1.6-6.5,1.6-11.5c0-5-0.5-8.8-1.6-11.5c-1.1-2.7-3.1-4.1-6.2-4.1S178.2,105.3,177.2,108.1z"
              />
              <path
                className="scroll-letter fill-white"
                d="M235.4,133.9h3c0.8,2.2,1.2,4.3,1.2,6.3c0,2-0.1,3.5-0.3,4.3c-4.1,0.7-8,1-11.7,1c-3.7,0-6.6-1.1-8.5-3.3c-1.9-2.2-2.9-5.6-2.9-10.4V70.6l0.7-0.7h5.9c3,0,5.1,0.7,6.4,2.1c1.3,1.4,1.9,3.8,1.9,7.1v50C231.1,132.3,232.5,133.9,235.4,133.9z"
              />
              <path
                className="scroll-letter fill-white"
                d="M266.1,133.9h3c0.8,2.2,1.2,4.3,1.2,6.3c0,2-0.1,3.5-0.3,4.3c-4.1,0.7-8,1-11.7,1c-3.7,0-6.6-1.1-8.5-3.3c-1.9-2.2-2.9-5.6-2.9-10.4V70.6l0.7-0.7h5.9c3,0,5.1,0.7,6.4,2.1c1.3,1.4,1.9,3.8,1.9,7.1v50C261.8,132.3,263.2,133.9,266.1,133.9z"
              />
            </g>
          </g>
          <g id="by-greensock" className="opacity-60">
            <path
              className="by-greensock-letter fill-white"
              d="M291.3,187.6c2.6,0,4.7,1.1,6.1,3.3c1.4,2.2,2.2,5.3,2.2,9.2s-1,6.9-3,9.1c-2,2.1-4.4,3.2-7.2,3.2c-2.8,0-5.6-0.5-8.5-1.6v-34.5l0.3-0.3h1.2c0.7,0,1.2,0.2,1.4,0.5c0.2,0.4,0.3,0.9,0.3,1.8v12.4C286.3,188.6,288.6,187.6,291.3,187.6z M296.2,199.8c0-3.2-0.5-5.5-1.5-7c-1-1.5-2.2-2.3-3.6-2.3c-1.4,0-2.7,0.3-3.8,1c-1.2,0.7-2.2,1.5-3,2.6v14.7c1.5,0.6,3.3,0.9,5.2,0.9c1.9,0,3.5-0.9,4.9-2.6C295.5,205.4,296.2,203,296.2,199.8z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M323.3,188.2l-6.8,23c-1.2,4.2-2.6,7.2-4,8.9c-1.4,1.7-3.5,2.6-6.2,2.6c-1.3,0-2.6-0.2-3.8-0.6c0-0.1,0-0.2,0-0.2c0-0.8,0.3-1.5,0.8-2.2c0.8,0.3,1.9,0.5,3.1,0.5c1.8,0,3.2-0.6,4.1-1.8c0.9-1.2,1.8-3.1,2.5-5.7l0.1-0.5c-0.8-0.1-1.4-0.3-1.8-0.6c-0.4-0.3-0.8-0.9-1.1-1.8l-7-21.6c0.9-0.4,1.5-0.6,2-0.6c0.9,0,1.5,0.5,1.8,1.6l4,12.5c0.9,3,1.7,5.6,2.4,7.7c0.1,0.2,0.2,0.3,0.5,0.3l6.1-21.9c0.5-0.1,1-0.1,1.6-0.1s1.1,0.1,1.6,0.2L323.3,188.2z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M352.3,195.3h7.4c1,0,1.7,0.2,2.1,0.5c0.4,0.4,0.6,1,0.6,1.9v12.7c-3.5,1.4-7.3,2.2-11.5,2.2c-2.5,0-4.6-0.5-6.3-1.5c-1.8-1-3.2-2.3-4.1-4c-1.9-3.2-2.8-7.1-2.8-11.6c0-3.1,0.4-5.8,1.2-8.1c0.8-2.3,1.9-4.2,3.2-5.5c2.6-2.6,5.8-4,9.5-4c2,0,4,0.3,6,1c2,0.7,3.6,1.6,4.9,2.7c-0.3,1.1-0.9,2-1.9,2.7c-2.7-2.2-5.8-3.2-9.3-3.2c-2.9,0-5.2,1.1-7.1,3.4c-1.9,2.3-2.8,6-2.8,11c0,9.3,3.4,14,10.2,14c2.8,0,5.3-0.4,7.5-1.2v-6.9c0-1.4,0-2.4,0-2.9h-5.5c-1.1,0-1.6-0.6-1.6-1.7C352,196.4,352.1,195.9,352.3,195.3z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M369.1,189.5c0.3-0.8,0.8-1.5,1.5-1.9c1.8,0.7,2.9,2.1,3.3,4.4c1.4-2.9,3.6-4.4,6.6-4.4c0.7,0,1.4,0.1,2.2,0.2c0,1.3-0.3,2.4-0.8,3.2c-0.3,0-0.9,0-1.6,0c-2.8,0-4.8,1.6-6.1,4.7V212c-0.4,0.1-1,0.1-1.7,0.1c-0.7,0-1.2,0-1.6-0.1v-17.5C370.9,192.4,370.3,190.7,369.1,189.5z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M404.7,201h-15.4c0.2,5.7,2.3,8.6,6.5,8.6c2.3,0,4.7-0.7,7.2-2.1c0.7,0.6,1.1,1.4,1.3,2.4c-2.6,1.8-5.6,2.7-8.9,2.7c-2.3,0-4.2-0.6-5.7-1.8c-1.5-1.2-2.5-2.7-3.1-4.5c-0.6-1.8-0.9-3.9-0.9-6.3c0-3.7,0.9-6.7,2.6-9c1.7-2.3,4.1-3.5,7.1-3.5c3,0,5.3,1,7,3c1.6,2,2.4,4.5,2.4,7.5C404.9,198.9,404.8,200,404.7,201z M400,192.1c-1-1.4-2.4-2.2-4.4-2.2c-1.9,0-3.5,0.8-4.5,2.3c-1.1,1.5-1.7,3.6-1.8,6.1h12.2v-0.7C401.4,195.4,400.9,193.6,400,192.1z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M429.3,201h-15.4c0.2,5.7,2.3,8.6,6.5,8.6c2.3,0,4.7-0.7,7.2-2.1c0.7,0.6,1.1,1.4,1.3,2.4c-2.6,1.8-5.6,2.7-8.9,2.7c-2.3,0-4.2-0.6-5.7-1.8c-1.5-1.2-2.5-2.7-3.1-4.5c-0.6-1.8-0.9-3.9-0.9-6.3c0-3.7,0.9-6.7,2.6-9c1.7-2.3,4.1-3.5,7.1-3.5c3,0,5.3,1,7,3c1.6,2,2.4,4.5,2.4,7.5C429.5,198.9,429.4,200,429.3,201z M424.6,192.1c-1-1.4-2.4-2.2-4.4-2.2c-1.9,0-3.5,0.8-4.5,2.3c-1.1,1.5-1.7,3.6-1.8,6.1h12.2v-0.7C426.1,195.4,425.6,193.6,424.6,192.1z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M455,195.1v12.3c0,1.9,0.2,3.3,0.5,4.1c-0.5,0.5-1.2,0.7-2.1,0.7c-1.1,0-1.7-0.7-1.7-2.2v-13.8c0-2.1-0.3-3.5-0.8-4.4s-1.5-1.3-2.8-1.3s-2.8,0.4-4.3,1.1c-1.5,0.7-2.7,1.7-3.6,2.8V212c-0.5,0.1-1,0.1-1.7,0.1c-0.7,0-1.2,0-1.7-0.1v-23.9l0.3-0.3h1.3c0.7,0,1.2,0.2,1.4,0.5s0.3,0.9,0.3,1.8v1c1.1-1.1,2.4-1.9,3.9-2.6c1.6-0.7,3.1-1,4.6-1c2.2,0,3.8,0.7,4.8,2.1C454.5,191,455,192.9,455,195.1z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M461.1,208.9c0.1-1.1,0.7-2,1.7-2.8c3.2,2.3,6.5,3.4,9.8,3.4c2.4,0,4.2-0.5,5.6-1.5c1.4-1,2.1-2.4,2.1-4.1c0-2.6-1.8-4.8-5.4-6.3l-5.7-2.5c-4.3-1.9-6.5-4.6-6.5-8.1c0-2.5,1-4.6,2.9-6.4c1.9-1.7,4.4-2.6,7.6-2.6s6.4,0.8,9.6,2.4c0.1,1.1-0.4,2.1-1.4,2.9c-2.9-1.5-5.5-2.3-7.8-2.3s-4.1,0.5-5.4,1.6c-1.3,1.1-2,2.4-2,4.1c0,2.2,1.6,3.9,4.9,5.3l5.5,2.4c4.9,2.1,7.3,5,7.3,8.8c0,2.8-1,5.1-2.9,6.8c-1.9,1.7-4.9,2.6-[8.9,2.6S464.4,211.3,461.1,208.9z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M509.1,200c0,4.3-1.1,7.7-3.4,10c-1.7,1.7-4,2.6-6.7,2.6s-5-0.9-6.7-2.6c-2.3-2.3-3.4-5.7-3.4-10s1.1-7.7,3.4-10c1.7-1.7,4-2.6,6.7-2.6s5,0.9,6.7,2.6C508,192.3,509.1,195.6,509.1,200z M499,190c-2.3,0-4,1-5,2.9c-1.1,1.9-1.6,4.3-1.6,7.1s0.5,5.1,1.6,7.1s2.8,2.9,5.1,2.9c1.6,0,2.9-0.5,3.9-1.5c1.8-1.8,2.7-4.6,2.7-8.4c0-2.8-0.5-5.1-1.6-7.1C503,191,501.3,190,499,190z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M529.3,196.3c0-0.2,0-0.5,0-1c0-0.5-0.1-1.1-0.4-1.9c-0.2-0.8-0.8-1.5-1.6-2.2c-0.9-0.7-1.9-1-3.3-1c-1.9,0-3.4,0.9-4.5,2.6c-1.1,1.8-1.7,4.2-1.7,7.4c0,3.2,0.6,5.5,1.7,7.1c1.1,1.6,2.6,2.4,4.6,2.4c1.9,0,4.1-0.9,6.5-2.7c0.9,0.6,1.5,1.3,1.7,2.2c-2.5,2.4-5.4,3.5-8.5,3.5c-3.2,0-5.5-1.2-7.1-3.6c-1.6-2.4-2.3-5.5-2.3-9.3c0-3.8,0.9-6.8,2.8-9c1.9-2.2,4.2-3.3,7-3.3c1.5,0,2.8,0.2,3.9,0.7s2,1.1,2.7,1.8c1.2,1.5,1.8,3,1.8,4.4s-0.6,2.1-1.8,2.1C530.3,196.5,529.9,196.4,529.3,196.3z"
            />
            <path
              className="by-greensock-letter fill-white"
              d="M553.1,203.3l2,4.4c0.8,1.9,1.6,3.1,2.4,3.6c-0.5,0.7-1.2,1-2,1c-0.9,0-1.4-0.2-1.8-0.6c-0.3-0.4-0.7-1-1.1-1.9l-2.4-5.1c-0.7-1.5-1.3-2.4-2-2.9c-0.7-0.5-1.5-0.7-2.5-0.7c-1,0-2.1,0-3.3,0.1V212c-0.4,0.1-1,0.1-1.6,0.1s-1.2,0-1.7-0.1v-35.7l0.3-0.3h1.2c0.7,0,1.2,0.2,1.4,0.5c0.2,0.4,0.3,0.9,0.3,1.8v20l2.3-0.1c0.4,0,0.8-0.2,1-0.6l5.4-8c0.4-0.6,0.8-1.1,1.2-1.3c0.3-0.3,0.8-0.4,1.5-0.4c0.7,0,1.2,0,1.6,0l0.3,0.4l-6.4,9.3c-0.4,0.6-0.8,1-1.1,1.2c1.1,0.2,2.1,0.7,2.8,1.4C551.8,200.8,552.5,201.9,553.1,203.3z"
            />
          </g>
          <g id="logo-smoother">
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M276,138.3c0.3-3.2,1.8-5.8,4.3-7.7c6.9,4.5,13.6,6.8,20.1,6.8c4.1,0,7.3-0.9,9.7-2.8c2.4-1.8,3.6-4.2,3.6-7.1c0-4.6-3.2-8.3-9.5-11.1l-11.7-5c-9.1-4-13.7-9.8-13.7-17.3c0-5.5,2.1-10,6.2-13.7c4.2-3.7,9.7-5.5,16.5-5.5c6.9,0,13.7,1.7,20.5,5.1c-0.1,3.2-1.4,5.8-3.7,7.9c-6.3-3.1-11.6-4.7-16-4.7s-7.7,0.9-10,2.8c-2.3,1.8-3.4,4-3.4,6.5s0.7,4.5,2.2,5.9c1.5,1.5,3.6,2.8,6.4,4l11.6,4.9c9.9,4.4,14.9,10.6,14.9,18.6c0,5.9-2.1,10.7-6.2,14.4c-4.1,3.7-10.4,5.5-18.6,5.5C291,145.8,283.2,143.3,276,138.3z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M359.6,113c0-3.5-0.5-6.1-1.5-7.6c-1-1.5-2.6-2.3-4.7-2.3c-3.8,0-7.6,2.1-11.3,6.4v35c-1.1,0.3-2.7,0.4-4.8,0.4c-2,0-3.7-0.1-5-0.4v-49l0.7-0.7h3.6c3.4,0,5.2,2.1,5.4,6.3c4.4-4.5,9.2-6.8,14.5-6.8c5.3,0,9,2.5,11.1,7.4c5.3-4.9,10.6-7.4,16-7.4c4.1,0,7.3,1.5,9.4,4.4c2.2,2.9,3.2,6.7,3.2,11.2v24.3c0,3.9,0.5,6.8,1.6,8.9c-1.6,1.4-3.6,2.1-6.1,2.1c-3.4,0-5.1-2.1-5.1-6.2v-26.1c0-3.5-0.5-6-1.5-7.5s-2.6-2.2-4.7-2.2c-3.9,0-7.7,2.2-11.4,6.5v34.9c-1.1,0.3-2.7,0.4-4.8,0.4s-3.7-0.1-4.8-0.4V113z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M440.4,99.4c4.7,4.7,7,11.6,7,20.5s-2.3,15.7-7,20.4c-3.7,3.7-8.5,5.5-14.4,5.5c-5.9,0-10.7-1.8-14.4-5.5c-4.7-4.7-7-11.5-7-20.4s2.3-15.7,7-20.5c3.7-3.7,8.5-5.5,14.4-5.5C432,93.9,436.8,95.7,440.4,99.4z M414.6,119.9c0,12.3,3.8,18.4,11.4,18.4s11.4-6.1,11.4-18.4c0-3.5-0.3-6.5-1-9.1c-0.6-2.6-1.8-4.8-3.6-6.7c-1.8-1.9-4-2.8-6.8-2.8s-5.1,0.9-6.8,2.8c-1.8,1.9-3,4.1-3.6,6.7C414.9,113.4,414.6,116.4,414.6,119.9z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M490.4,99.4c4.7,4.7,7,11.6,7,20.5s-2.3,15.7-7,20.4c-3.7,3.7-8.5,5.5-14.4,5.5c-5.9,0-10.7-1.8-14.4-5.5c-4.7-4.7-7-11.5-7-20.4s2.3-15.7,7-20.5c3.7-3.7,8.5-5.5,14.4-5.5C482,93.9,486.8,95.7,490.4,99.4z M464.6,119.9c0,12.3,3.8,18.4,11.4,18.4s11.4-6.1,11.4-18.4c0-3.5-0.3-6.5-1-9.1c-0.6-2.6-1.8-4.8-3.6-6.7c-1.8-1.9-4-2.8-6.8-2.8s-5.1,0.9-6.8,2.8c-1.8,1.9-3,4.1-3.6,6.7C464.9,113.4,464.6,116.4,464.6,119.9z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M530.8,95.1c0.3,1.1,0.4,2.4,0.4,3.6s-0.1,2.5-0.4,3.5l-12.5-0.1v30.7c0,2.9,1.4,4.3,4.1,4.3h7c0.5,1.3,0.8,2.6,0.8,4.1s0,2.5-0.1,2.9c-3.9,0.5-7.5,0.7-11,0.7c-6.8,0-10.2-3.3-10.2-9.8v-32.9l-7.3,0.1c-0.3-1.1-0.4-2.2-0.4-3.5s0.1-2.5,0.4-3.6l7.3,0.1v-9.1c0-2.3,0.4-3.9,1.1-4.8c0.7-0.9,2.1-1.4,4.1-1.4h3.6l0.6,0.6v14.8L530.8,95.1z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M578.6,110.6v23.6c0,3.9,0.5,6.8,1.6,8.9c-1.7,1.4-3.8,2.1-6.1,2.1c-3.4,0-5.1-2.1-5.1-6.2v-25.9c0-3.6-0.5-6.2-1.4-7.7c-0.9-1.5-2.5-2.3-4.8-2.3s-4.7,0.6-7.1,1.8c-2.4,1.2-4.5,2.8-6.3,4.7v34.9c-1.1,0.3-2.7,0.4-4.7,0.4c-2,0-3.6-0.1-4.8-0.4V71.6l0.7-0.6h3.6c2,0,3.4,0.5,4.1,1.5c0.7,1,1.1,2.5,1.1,4.8v23.9c4.9-4.5,10.3-6.7,16.1-6.7c4.5,0,7.8,1.5,10,4.5C577.5,101.9,578.6,105.8,578.6,110.6z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M626.5,122.9h-29.7c0.2,4.7,1.2,8.4,3,11c1.8,2.6,4.8,3.9,9,3.9c4.2,0,8.8-1.3,13.9-3.9c1.7,1.6,2.7,3.7,3.1,6.3c-5.3,3.7-11.6,5.6-18.8,5.6c-7.2,0-12.3-2.4-15.5-7.2c-3.2-4.8-4.8-11-4.8-18.7c0-7.7,1.8-14,5.4-18.8c3.6-4.8,8.6-7.2,15-7.2c6.4,0,11.4,2,14.8,6.1c3.5,4,5.2,9.1,5.2,15.3C627.2,117.8,627,120.3,626.5,122.9z M615.3,104.8c-1.7-2.5-4.2-3.8-7.6-3.8c-3.4,0-6,1.3-7.8,3.9c-1.8,2.6-2.8,6.2-3,10.8h21v-1.3C617.8,110.5,617,107.3,615.3,104.8z"
            />
            <path
              className="smoother-letter fill-[#88ce02]"
              d="M633.6,99.7c0.5-2.3,1.7-4,3.6-5.2c4.4,1.1,7.3,4,8.7,8.9c2.7-5.9,7.1-8.9,13.1-8.9c1.6,0,3.3,0.2,5.2,0.6c0,3.6-0.8,6.6-2.3,9.1c-0.4-0.1-1.7-0.2-4-0.4c-4.7,0-8.3,2.6-11,7.8v32.9c-1.1,0.3-2.8,0.4-4.8,0.4s-3.7-0.1-4.8-0.4v-34.6C637.2,105.3,636,101.9,633.6,99.7z"
            />
          </g>
          <g id="logo-mouse">
            <rect
              id="mouse-outline"
              x="687.23"
              y="22.73"
              width="115.94"
              height="191.75"
              rx="57.97"
              className="fill-none stroke-white"
            />
            <rect
              id="mouse-wheel"
              x="738.65"
              y="57.48"
              width="15"
              height="39.31"
              rx="7.5"
              className="fill-[#88ce02]"
            />
          </g>
        </svg>
        </header>
      )}

      {/* THREE-COLUMN PARALLAX GRID SECTION */}
      <section className="grid-section w-full overflow-visible z-10 px-6 md:px-12 py-10">
        <div className="grid-layout grid grid-cols-3 gap-6 h-full w-full">
          {/* Column 1 */}
          <div className="column column-1 h-full" data-speed="1.15">
            <div className="column-content grid grid-rows-3 gap-6">
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(0).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(0).image}
                    alt={getProjectData(0).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(1).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(1).image}
                    alt={getProjectData(1).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(2).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(2).image}
                    alt={getProjectData(2).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="column column-2 h-full" data-speed="0.95">
            <div className="column-content grid grid-rows-3 gap-6">
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(3).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(3).image}
                    alt={getProjectData(3).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(4).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(4).image}
                    alt={getProjectData(4).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(5).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(5).image}
                    alt={getProjectData(5).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="column column-3 h-full" data-speed="1.2">
            <div className="column-content grid grid-rows-3 gap-6">
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(6).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(6).image}
                    alt={getProjectData(6).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(7 % Math.max(1, designs.length)).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(7).image}
                    alt={getProjectData(7).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
              <div className="grid-image relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md w-full h-full">
                <a
                  href={getProjectData(8 % Math.max(1, designs.length)).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block w-full h-full cursor-pointer group"
                >
                  <img
                    src={getProjectData(8).image}
                    alt={getProjectData(8).title}
                    className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-110 brightness-100 group-hover:brightness-110"
                    draggable={false}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEXT SPACER */}
      <div className="spacer h-[25vh] flex items-center justify-center font-sans">
        {onOpenProjects && (
          <button
            onClick={onOpenProjects}
            type="button"
            className="px-10 py-4 bg-transparent hover:bg-white hover:text-black border border-white/15 hover:border-white text-white/80 font-bold text-[10px] md:text-xs tracking-widest rounded-full transition-all cursor-pointer uppercase shadow-lg duration-350"
          >
            See More Projects
          </button>
        )}
      </div>

      {/* PARALLAX SINGLE IMAGE SECTION */}
      <section className="parallax-section h-screen w-full overflow-hidden relative flex items-center justify-center">
        <video
          className="parallax-image absolute top-0 left-0 w-full h-[200vh] object-cover select-none pointer-events-none"
          src="https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4"
          autoPlay
          loop
          muted
          playsInline
          draggable={false}
        />
        
        {/* Subtle sleek dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Floating Watch More Player Trigger */}
        <div className="absolute z-10 flex flex-col items-center gap-4 text-center px-4">
          <button
            onClick={() => onOpenVideo?.("https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4", "RIVR Ad Film")}
            type="button"
            className="group flex items-center gap-3 bg-black/45 hover:bg-white text-white hover:text-black hover:scale-105 border border-white/10 hover:border-transparent rounded-full px-6 py-3.5 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md shadow-2xl"
          >
            {/* Slide Action Icon Option */}
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-black/10 overflow-hidden transition-all duration-300">
              <Play className="w-2.5 h-2.5 fill-current transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="uppercase text-[10px] md:text-xs">Watch More</span>
            <span className="flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5">
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </span>
          </button>
        </div>
      </section>

      {/* TEXT SPACER */}
      <div className="spacer h-[25vh] flex items-center justify-center font-sans tracking-tight text-neutral-400 uppercase text-[10px] md:text-xs" />

      {/* PIN HORIZONTAL DOUBLE SCROLL SECTION */}
      <section className="pin-section h-screen overflow-hidden grid grid-rows-2 gap-6 py-8">
        {/* Track 1: Horizontally Slide Right-to-Left */}
        <div className="pin-content pin-content-1">
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[2]}
              alt="Motion Showcase Study Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[3]}
              alt="Visual Branding Studio Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[4]}
              alt="Corporate Typography Logo Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[5]}
              alt="Creative Infographics Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[6]}
              alt="Frame-by-Frame Character Run Artwork"
              draggable={false}
            />
          </div>
        </div>

        {/* Track 2: Horizontally Slide Left-to-Right */}
        <div className="pin-content pin-content-2">
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[0]}
              alt="Fine Art Photography Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[1]}
              alt="Risography Art & Illustration Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[2]}
              alt="Motion design sequence transition Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[3]}
              alt="Corporate Identity Guidelines Artwork"
              draggable={false}
            />
          </div>
          <div className="pin-box relative overflow-hidden rounded-3xl bg-neutral-900 shadow-lg border border-white/5">
            <img
              className="pin-image absolute inset-0 w-full h-full object-cover select-none"
              src={PROJECT_THUMBNAILS[4]}
              alt="Geometric Typography monograms Artwork"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* CONCLUDING OUTRO SPIN */}
      <footer className="spacer h-[30vh] flex flex-col items-center justify-center gap-6 font-sans">
        {!isInline && onClose && (
          <button
            onClick={onClose}
            type="button"
            className="mt-6 px-8 py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-[#88ce02] hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            Return to Portfolio
          </button>
        )}
      </footer>
    </div>
  );
}
