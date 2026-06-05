"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

// ─── Card images ──────────────────────────────────────────────────
const CARDS = [
  { id: 0, img: "/recaps/gallery1.jpg", alt: "Gallery 1" },
  { id: 1, img: "/recaps/gallery2.jpg", alt: "Gallery 2" },
  { id: 2, img: "/recaps/gallery3.jpg", alt: "Gallery 3" },
  { id: 3, img: "/recaps/gallery4.jpg", alt: "Gallery 4" },
  { id: 4, img: "/recaps/gallery5.jpg", alt: "Gallery 5" },
  { id: 5, img: "/recaps/gallery6.jpg", alt: "Gallery 6" },
  { id: 6, img: "/recaps/gallery1.jpg", alt: "Gallery 7" },
];

const N = CARDS.length;

type FanConfig = {
  rotation: number;  
  yOffset: number;   
  scale: number;
  opacity: number;
  zIndex: number;
  xOffset: number;
};

function getFanConfig(diff: number): FanConfig {
  const abs = Math.abs(diff);
  const sign = diff >= 0 ? 1 : -1;

  switch (abs) {
    case 0:
      return { rotation: 0,            xOffset: 0,           yOffset: 0,   scale: 1,    opacity: 1, zIndex: 10 };
    case 1:
      return { rotation: sign * 14,    xOffset: sign * 30,   yOffset: 45,  scale: 0.92, opacity: 1, zIndex: 8  };
    case 2:
      return { rotation: sign * 26,    xOffset: sign * 50,   yOffset: 80,  scale: 0.83, opacity: 1, zIndex: 6  };
    case 3:
      return { rotation: sign * 36,    xOffset: sign * 65,   yOffset: 105, scale: 0.74, opacity: 1, zIndex: 4  };
    default:
      return { rotation: sign * 42,    xOffset: sign * 75,   yOffset: 120, scale: 0.65, opacity: 0, zIndex: 1  };
  }
}

// ─── Lerp two FanConfigs ────────────────────────────────────────────
function lerpFan(a: FanConfig, b: FanConfig, t: number): FanConfig {
  return {
    rotation: a.rotation + (b.rotation - a.rotation) * t,
    xOffset:  a.xOffset  + (b.xOffset  - a.xOffset)  * t,
    yOffset:  a.yOffset  + (b.yOffset  - a.yOffset)  * t,
    scale:    a.scale    + (b.scale    - a.scale)    * t,
    opacity:  a.opacity  + (b.opacity  - a.opacity)  * t,
    zIndex:   a.zIndex,
  };
}

// ─── Core init ───────────────────────────────────────────────────────
function initFlickCards(wrapper: HTMLElement) {
  const items = Array.from(
    wrapper.querySelectorAll<HTMLElement>("[data-flick-item]")
  );
  if (items.length < 7) {
    console.warn("FlickCards: need at least 7 cards.");
    return;
  }

  let activeIdx = 0;
  let isAnimating = false;

  // Apply fan layout to all cards
  function applyFan(
    center: number,
    progress = 0,        // 0–1 drag progress
    direction = 0,       // +1 = going next (drag left), -1 = going prev (drag right)
    duration = 0,
    ease?: string
  ) {
    items.forEach((el, i) => {
      // Shortest-path diff in circular array
      let diff = ((i - center + N * 10) % N);
      if (diff > Math.floor(N / 2)) diff -= N;

      const from = getFanConfig(diff);
      const to   = progress !== 0 ? getFanConfig(diff - direction) : from;
      const cfg  = progress !== 0 ? lerpFan(from, to, progress) : from;

      const props: gsap.TweenVars = {
        x: cfg.xOffset,
        y: cfg.yOffset,
        rotation: cfg.rotation,
        scale: cfg.scale,
        opacity: cfg.opacity,
        zIndex: cfg.zIndex,
        overwrite: true,
      };

      if (duration > 0) {
        props.duration = duration;
        if (ease) props.ease = ease;
      } else {
        props.duration = 0;
      }

      gsap.to(el, props);
    });
  }

  function goTo(newIdx: number) {
    isAnimating = true;
    activeIdx = ((newIdx % N) + N) % N;
    applyFan(activeIdx, 0, 0, 0.65, "elastic.out(1, 0.85)");
    setTimeout(() => { isAnimating = false; }, 750);
  }

  // Initial layout
  applyFan(activeIdx);

  // ── Overlay dragger (single, covers whole wrapper) ────────────────
  const dragger = document.createElement("div");
  dragger.style.cssText =
    "position:absolute;inset:0;z-index:50;cursor:grab;touch-action:pan-y;";
  wrapper.appendChild(dragger);

  let dragStartX = 0;
  const THRESHOLD = 60; // px to commit a swipe

  Draggable.create(dragger, {
    type: "x",
    inertia: false,
    onPress() {
      dragStartX = this.x;
      dragger.style.cursor = "grabbing";
    },
    onDrag() {
      if (isAnimating) return;
      const dx = this.x - dragStartX;
      // drag right (dx > 0) → previous  → direction = -1
      // drag left  (dx < 0) → next      → direction = +1
      const dir = dx > 0 ? -1 : 1;
      const progress = Math.min(Math.abs(dx) / (wrapper.offsetWidth * 0.45), 1);
      applyFan(activeIdx, progress, dir);
    },
    onDragEnd() {
      dragger.style.cursor = "grab";
      const dx = this.x - dragStartX;
      const absDx = Math.abs(dx);

      // Reset the dragger itself to x=0 (it's invisible, just tracks touch)
      gsap.set(dragger, { x: 0 });

      if (absDx >= THRESHOLD) {
        const dir = dx > 0 ? -1 : 1;
        goTo(activeIdx + dir);
      } else {
        // Snap back
        applyFan(activeIdx, 0, 0, 0.5, "elastic.out(1, 0.85)");
      }
    },
  });

  return () => {
    Draggable.get(dragger)?.kill();
    dragger.remove();
  };
}

// ─── React Component ─────────────────────────────────────────────────
export default function FlickCards({ compact = false }: { compact?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const cleanup = initFlickCards(wrapper);
    if (cleanup) cleanupRef.current = cleanup;

    return () => { cleanupRef.current?.(); };
  }, []);

  const cardW = compact ? 190 : 300;
  const cardH = compact ? 268 : 420;
  const wrapH = compact ? 360 : 500;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: `${wrapH}px`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "visible",
        userSelect: "none",
        paddingBottom: "20px",
        // perspective: "1200px",
      }}
    >
      {CARDS.map((card, i) => (
  <div
    key={card.id}
    data-flick-item
    style={{
      position: "absolute",
      bottom: "20px",
      width: `${cardW}px`,
      height: `${cardH}px`,
      borderRadius: "16px",
      overflow: "hidden",
      transformOrigin: "50% 100%",
      willChange: "transform",
      boxShadow:
        "0 24px 64px rgba(0,0,0,0.75), 0 4px 20px rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <Image
      src={card.img}
      alt={card.alt}
      fill
      sizes="(max-width: 768px) 90vw, 400px"
      quality={90}
      className="object-cover"
      priority
      draggable={false}
    />
  </div>
))}
    </div>
  );
}
