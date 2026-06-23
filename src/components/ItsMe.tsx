import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ItsMeProps {
  profile: any;
  onOpenContact?: () => void;
}

export default function ItsMe({ profile, onOpenContact }: ItsMeProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.from(".its-me-image", {
        opacity: 0,
        scale: 0.8,
        y: 100,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".its-me-section",
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });

      gsap.from(".its-me-title, .its-me-subtitle, .its-me-bio, .its-me-roles, .its-me-button", {
        opacity: 0,
        x: isMobile ? 0 : 60,
        y: isMobile ? 40 : 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".its-me-section",
          start: "top 65%",
          end: "top 20%",
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="its-me-section relative bg-[#050505] py-20 md:py-32" id="its-me">
      <div className="w-11/12 md:w-[min(1200px,95vw)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="its-me-image flex justify-center md:justify-end">
            <div className="relative w-72 h-80 md:w-96 md:h-[500px] rounded-2xl overflow-hidden border border-white/10">
              <img
                src={profile.aboutImage}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="its-me-title">
              <p className="text-xs md:text-sm font-mono tracking-widest text-white/50 uppercase mb-3">
                About Me
              </p>
              <h2 className="text-4xl md:text-6xl font-sans font-bold text-white leading-tight">
                It's Me,<br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                  Sukunsh
                </span>
              </h2>
            </div>

            <p className="its-me-subtitle text-lg md:text-xl text-white/70 font-sans">
              {profile.fullName}
            </p>

            <p className="its-me-bio text-base md:text-lg text-white/60 leading-relaxed">
              Creative designer with expertise in AI-powered visual design, motion graphics, and cinematic storytelling. I transform ideas into beautiful, engaging digital experiences.
            </p>

            <div className="its-me-roles flex flex-wrap gap-2">
              {["Visual Designer", "AI Creative", "Motion Artist"].map((role, idx) => (
                <span key={idx} className="px-4 py-2 border border-white/20 rounded-full text-xs md:text-sm text-white/70 uppercase font-mono">
                  {role}
                </span>
              ))}
            </div>

            <button
              onClick={onOpenContact}
              className="its-me-button px-8 py-4 md:py-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105"
            >
              Let's Connect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
