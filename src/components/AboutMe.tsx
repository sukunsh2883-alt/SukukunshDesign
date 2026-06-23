import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AboutMeProps {
  profile: {
    fullName: string;
    brandName: string;
    roles: string[];
    bio: string;
    email: string;
    linkedin: string;
    behance: string;
    aboutImage?: string;
  };
  onOpenResume: () => void;
  onOpenAIWork: () => void;
  onOpenProjects: () => void;
}

export default function AboutMe({ profile, onOpenResume }: AboutMeProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portrait =
    profile.aboutImage ||
    "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_39_obkaf2.png";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about-me" className="about-section bg-[#050505] px-6 py-24 text-white md:px-[7vw] md:py-[150px]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:min-h-[72vh] md:grid-cols-[330px_1fr] md:gap-20">
        <figure className="about-reveal relative aspect-[0.82] w-full max-w-[270px] overflow-hidden bg-[#d8d8d8] md:max-w-[330px]">
          <img
            src={portrait}
            alt={profile.fullName}
            className="h-full w-full object-cover grayscale contrast-110"
            referrerPolicy="no-referrer"
          />
        </figure>

        <div className="about-reveal max-w-[720px]">
          <p className="mb-4 text-sm font-medium tracking-[-0.015em] text-white">About me</p>
          <h2 className="max-w-[620px] text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-white md:text-[58px]">
            emotional, bold,<br />
            story driven visuals.
          </h2>

          <div className="mt-8 grid gap-8 text-sm leading-[1.35] tracking-[-0.018em] text-white/66 md:grid-cols-2">
            <p>
              I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
            </p>
            <p>
              My work lives between art, design, and cinema, creating visuals that feel emotional, bold, and story driven.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-14 text-xl font-semibold tracking-[-0.025em] text-white">
            <a href={profile.behance} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#869e57]">
              Behance
            </a>
            <button onClick={onOpenResume} className="transition-colors hover:text-[#869e57]">
              Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
