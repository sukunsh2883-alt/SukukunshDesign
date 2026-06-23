import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Linkedin, ExternalLink } from "lucide-react";

interface LetWorkTogetherProps {
  profile: any;
  onContactClick?: () => void;
}

export default function LetWorkTogether({ profile, onContactClick }: LetWorkTogetherProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".work-together-title", {
        opacity: 0,
        y: 80,
        filter: "blur(10px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-together-section",
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });

      gsap.from(".work-together-subtitle", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: ".work-together-section",
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });

      gsap.from(".work-together-button", {
        opacity: 0,
        scale: 0.9,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-together-section",
          start: "top 60%",
          end: "top 20%",
          scrub: 1,
        },
      });

      gsap.to(".work-together-glow", {
        opacity: 0.5,
        y: 30,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      ScrollTrigger.refresh();
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="work-together-section relative bg-gradient-to-b from-[#050505] to-[#0a0a0a] py-24 md:py-40 overflow-hidden"
      id="work-together"
    >
      <div className="work-together-glow absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl opacity-0" />
      <div className="work-together-glow absolute bottom-20 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl opacity-0 delay-1000" />

      <div className="relative z-10 w-11/12 md:w-[min(900px,90vw)] mx-auto text-center">
        <h2 className="work-together-title text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-white leading-tight mb-6 md:mb-8">
          Let's Create<br />
          <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            Something Beautiful
          </span>
        </h2>

        <p className="work-together-subtitle text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-12 md:mb-16">
          I'm always interested in hearing about new projects and opportunities to collaborate with creative minds. Let's build something amazing together.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center flex-wrap">
          <a
            href={`mailto:${profile.email}`}
            className="work-together-button group flex items-center gap-3 px-8 py-4 md:py-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-sans font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 text-sm md:text-base uppercase tracking-wide"
          >
            <Mail className="w-5 h-5" />
            <span>Email Me</span>
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="work-together-button group flex items-center gap-3 px-8 py-4 md:py-5 border-2 border-white/30 hover:border-orange-500 text-white font-sans font-semibold rounded-full hover:bg-white/5 transition-all duration-300 hover:scale-105 text-sm md:text-base uppercase tracking-wide"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>

          <a
            href={profile.behance}
            target="_blank"
            rel="noopener noreferrer"
            className="work-together-button group flex items-center gap-3 px-8 py-4 md:py-5 border-2 border-white/30 hover:border-orange-500 text-white font-sans font-semibold rounded-full hover:bg-white/5 transition-all duration-300 hover:scale-105 text-sm md:text-base uppercase tracking-wide"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Behance</span>
          </a>
        </div>

        <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-sans font-bold text-orange-500 mb-2">
                5+
              </h3>
              <p className="text-xs md:text-sm text-white/60 uppercase tracking-widest">
                Years Experience
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-sans font-bold text-orange-500 mb-2">
                50+
              </h3>
              <p className="text-xs md:text-sm text-white/60 uppercase tracking-widest">
                Projects Completed
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-sans font-bold text-orange-500 mb-2">
                100%
              </h3>
              <p className="text-xs md:text-sm text-white/60 uppercase tracking-widest">
                Client Satisfaction
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-sans font-bold text-orange-500 mb-2">
                24/7
              </h3>
              <p className="text-xs md:text-sm text-white/60 uppercase tracking-widest">
                Support Ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
