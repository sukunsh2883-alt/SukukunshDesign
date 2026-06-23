import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

const phrase = ["Hello,", "I’m", "Sukunsh", "welcome", "to", "my", "visual", "world."];
const tittleWord = "visual";
const tittleLetterIndex = 1;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const tittleSourceRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const tittleSource = tittleSourceRef.current;
    if (!loader || !tittleSource) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".loader-word");
      const letters = gsap.utils.toArray<HTMLElement>(".loader-letter");

      const lockTittleToItsScreenPosition = () => {
        const sourceBox = tittleSource.getBoundingClientRect();
        gsap.set(tittleSource, {
          position: "fixed",
          left: sourceBox.left + sourceBox.width / 2,
          top: sourceBox.top + sourceBox.height / 2,
          width: sourceBox.width,
          height: sourceBox.height,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          margin: 0,
          zIndex: 5,
          boxShadow: "0 0 0 rgba(5, 5, 5, 0)",
          transformOrigin: "50% 50%",
        });
        loader.appendChild(tittleSource);
      };

      if (reduceMotion) {
        gsap.timeline({ onComplete })
          .to(loader, { opacity: 0, duration: 0.5, ease: "power2.out" });
        return;
      }

      gsap.set(words, { y: 28, opacity: 0, filter: "blur(10px)" });
      gsap.set(letters, { y: 12, opacity: 0, scale: 0.96, filter: "blur(6px)" });

      const getCoverScale = () => {
        const sourceBox = tittleSource.getBoundingClientRect();
        const viewport = Math.hypot(window.innerWidth, window.innerHeight);
        const tittleWidth = Math.max(sourceBox.width, sourceBox.height, 8);
        return viewport / tittleWidth + 12;
      };

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete,
      });

      timeline
        .to(words, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.76,
          stagger: 0.105,
        })
        .to(letters, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.58,
          stagger: 0.012,
          ease: "expo.out",
        }, "-=0.5")
        .to(tittleSource, {
          scale: 1.28,
          boxShadow: "0 0 18px rgba(5, 5, 5, 0.18)",
          duration: 0.42,
          ease: "power3.out",
          transformOrigin: "50% 50%",
        })
        .call(lockTittleToItsScreenPosition)
        .to(tittleSource, {
          scale: getCoverScale,
          backgroundColor: "#050505",
          boxShadow: "0 0 0 rgba(5, 5, 5, 0)",
          duration: 1.08,
          ease: "power4.inOut",
        })
        .to(".loader-copy", {
          scale: 1.04,
          opacity: 0,
          filter: "blur(18px)",
          duration: 0.58,
          ease: "power3.inOut",
        }, "-=0.72")
        .to(loader, {
          backgroundColor: "#050505",
          duration: 0.18,
          ease: "power2.out",
        }, "-=0.08");

      const handleResize = () => {
        if (timeline.progress() > 0.62) return;
        gsap.set(tittleSource, { clearProps: "position,left,top,width,height,xPercent,yPercent,zIndex,margin" });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, loader);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f4f1e8] px-6 text-[#050505]"
      aria-label="Loading portfolio"
    >
      <div className="loader-copy relative z-10 mx-auto max-w-[1180px] text-center">
        <h1
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[clamp(2.4rem,7vw,7rem)] font-semibold leading-[0.98] tracking-normal"
          aria-label="Hello, I’m Sukunsh welcome to my visual world."
        >
          {phrase.map((word) => (
            <span key={word} className="loader-word inline-flex whitespace-nowrap">
              {word === tittleWord
                ? word.split("").map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      className={letter === "i" && index === tittleLetterIndex ? "loader-letter loader-i-anchor" : "loader-letter"}
                    >
                      {letter === "i" && index === tittleLetterIndex ? (
                        <>
                          <span className="loader-i-stem" aria-hidden="true" />
                          <span
                            ref={tittleSourceRef}
                            className="loader-tittle-source"
                            aria-hidden="true"
                          />
                        </>
                      ) : letter}
                    </span>
                  ))
                : word.split("").map((letter, index) => (
                    <span key={`${letter}-${index}`} className="loader-letter">
                      {letter}
                    </span>
                  ))}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
