import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const introText =
  "I’m a Delhi-based visual artist, rooted in Bihar’s rich cultural heritage, with a background in Fine Art and Design.";

export default function HorizontalIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const track = section.querySelector<HTMLElement>(".horizontal-intro__text");
      const chars = gsap.utils.toArray<HTMLElement>(".horizontal-intro__char");
      if (!track || reduceMotion) return;

      gsap.set(chars, {
        yPercent: (index) => (index % 3 === 0 ? 18 : index % 3 === 1 ? -14 : 8),
        rotation: (index) => (index % 2 === 0 ? -2.5 : 2.2),
      });

      const distance = () => Math.max(track.scrollWidth - window.innerWidth + window.innerWidth * 0.16, 1);
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${isMobile ? distance() * 0.72 : distance()}`,
          scrub: 1,
          pin: !isMobile,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(track, { x: () => -distance(), ease: "none" }, 0)
        .to(chars, {
          yPercent: 0,
          rotation: 0,
          stagger: { each: 0.01, from: "random" },
          ease: "sine.inOut",
        }, 0);

      const refresh = () => ScrollTrigger.refresh();
      const refreshTimer = window.setTimeout(refresh, 260);
      cleanupFns.push(() => window.clearTimeout(refreshTimer));
    }, section);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-intro">
      <div className="horizontal-intro__container">
        <h2 className="horizontal-intro__text" aria-label={introText}>
          {introText.split("").map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="horizontal-intro__char"
              aria-hidden="true"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
