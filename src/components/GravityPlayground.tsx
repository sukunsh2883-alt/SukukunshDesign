import { PointerEvent, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export default function GravityPlayground() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const assetRefs = useRef<HTMLButtonElement[]>([]);
  const dragState = useRef<{
    element: HTMLButtonElement;
    pointerId: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const gravityAssets = useMemo(() => {
    const assetFiles = [
      "Asset 140.svg",
      "Asset 143.svg",
      "Asset 144.svg",
      "Asset 146.svg",
      "Asset 147.svg",
      "Asset 148.svg",
      "Asset 149.svg",
      "Asset 150.svg",
      "Asset 151.svg",
      "Asset 152.svg",
      "Asset 153.svg",
      "Asset 154.svg",
      "Asset 155.svg",
      "Asset 156.svg",
      "Asset 157.svg",
      "Asset 158.svg",
      "Asset 159.svg",
      "Asset 160.svg",
      "Asset 161.svg",
      "Asset 162.svg",
      "Asset 163.svg",
      "Asset 164.svg",
      "Asset 165.svg",
      "Asset 166.svg",
      "Asset 167.svg",
      "Asset 168.svg",
      "Asset 169.svg",
      "Asset 170.svg",
      "flower_2.svg",
      "flower_3.svg",
      "flower_9.svg",
      "leaf_1.svg",
      "leaf_1_1.svg",
      "leaf_2.svg",
    ];

    return assetFiles.map((file, index) => {
      const isOrganic = file.includes("flower") || file.includes("leaf");
      return {
        id: file,
        src: `/SVG for bottom gravity/${file}`,
        x: 3 + ((index * 8.2) % 94),
        lift: 0 + ((index * 13) % 72),
        width: isOrganic ? 70 + ((index * 13) % 58) : 40 + ((index * 11) % 58),
        rotate: -14 + ((index * 11) % 28),
      };
    });
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const assets = assetRefs.current.filter(Boolean);
    if (!stage || assets.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(assets, { opacity: 1, transformOrigin: "50% 100%" });
    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        assets,
        { opacity: 0, y: -160, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.45,
          ease: "bounce.out",
          stagger: { each: 0.008, from: "random" },
        },
      );

      assets.forEach((asset, index) => {
        gsap.to(asset, {
          y: `-=${3 + (index % 5)}`,
          rotate: `+=${index % 2 ? 2.5 : -2.5}`,
          duration: 2.6 + (index % 6) * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 9) * 0.07,
        });
      });
    }, stage);

    return () => context.revert();
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const element = assetRefs.current[index];
    if (!element || !stageRef.current) return;

    element.setPointerCapture(event.pointerId);
    gsap.killTweensOf(element);
    const currentX = Number(gsap.getProperty(element, "x")) || 0;
    const currentY = Number(gsap.getProperty(element, "y")) || 0;

    dragState.current = {
      element,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: currentX,
      baseY: currentY,
    };

    gsap.to(element, { scale: 1.12, rotate: 0, duration: 0.18, ease: "power2.out" });
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const x = state.baseX + event.clientX - state.startX;
    const y = state.baseY + event.clientY - state.startY;
    gsap.set(state.element, { x, y, zIndex: 300 });
  };

  const dropAsset = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    try {
      state.element.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    const currentX = Number(gsap.getProperty(state.element, "x")) || 0;
    const fallDistance = Math.abs(Number(gsap.getProperty(state.element, "y")) || 0);

    gsap.to(state.element, {
      x: currentX * 0.82,
      y: 0,
      scale: 1,
      rotate: -10 + Math.random() * 20,
      duration: Math.min(1.4, 0.75 + fallDistance / 420),
      ease: "bounce.out",
      zIndex: 120,
      overwrite: true,
    });

    dragState.current = null;
  };

  return (
    <section id="gravity-playground" className="relative z-10 -mb-8 overflow-visible bg-[#050505] pt-0 text-white md:-mb-10">
      <div className="mx-auto max-w-[1680px] px-4 md:px-8">
        <div
          ref={stageRef}
          className="relative h-[170px] cursor-grab overflow-visible active:cursor-grabbing md:h-[220px]"
          aria-label="Interactive falling artwork assets"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

          {gravityAssets.map((asset, index) => (
            <button
              key={asset.id}
              ref={(node) => {
                if (node) assetRefs.current[index] = node;
              }}
              type="button"
              onPointerDown={(event) => onPointerDown(event, index)}
              onPointerMove={onPointerMove}
              onPointerUp={dropAsset}
              onPointerCancel={dropAsset}
              className="absolute -bottom-1 touch-none select-none bg-transparent p-0 outline-none md:-bottom-2"
              style={{
                left: `${asset.x}%`,
                marginBottom: `${asset.lift}px`,
                width: `${asset.width}px`,
                rotate: `${asset.rotate}deg`,
                zIndex: 20 + Math.round(asset.lift),
              }}
              aria-label="Move artwork asset"
            >
              <img src={asset.src} alt="" draggable={false} className="h-auto w-full select-none object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
