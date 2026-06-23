import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const lines = [
  "I’m a Delhi-based visual artist,",
  "rooted in Bihar’s rich cultural heritage,",
  "with a background in Fine Art and Design."
];

export default function AboutMist() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".about-mist__word");
      if (reduceMotion) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "bottom 62%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          ".about-mist__fog-one",
          { xPercent: -18, opacity: 0.16 },
          { xPercent: 18, opacity: 0.28, ease: "none" },
          0,
        )
        .fromTo(
          ".about-mist__fog-two",
          { xPercent: 18, opacity: 0.12 },
          { xPercent: -16, opacity: 0.24, ease: "none" },
          0,
        )
        .fromTo(
          words,
          { opacity: 0, y: 34, filter: "blur(18px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.035,
            ease: "power2.out",
          },
          0.05,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about-me" className="about-mist">
      <div className="about-mist__fog about-mist__fog-one" />
      <div className="about-mist__fog about-mist__fog-two" />
      <div className="about-mist__inner">
        <p className="about-mist__eyebrow">About Sukunsh</p>
        <h2 className="about-mist__text flex flex-col items-start" aria-label={lines.join(" ")}>
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="flex flex-wrap gap-x-[0.24em]">
              {line.split(" ").map((word, wordIdx) => (
                <span key={`${word}-${wordIdx}`} className="about-mist__word">
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
