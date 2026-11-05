"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCan3D, useWebGLMissing } from "@/lib/hooks";
import type { PaintProgress } from "../three/PaintScene";
import { NailPoster } from "../NailPoster";
import { ThreeSlot } from "../ThreeSlot";
import { useShade } from "../ShadeProvider";

gsap.registerPlugin(ScrollTrigger);

function Poster() {
  const { shade } = useShade();
  return (
    <div className="flex h-full items-center justify-center">
      <NailPoster
        color={shade.hex}
        metallic={shade.metalness > 0.5}
        className="h-[58%] max-h-[380px] drop-shadow-[0_24px_30px_rgba(74,31,20,0.3)]"
      />
    </div>
  );
}

const PaintScene = dynamic(() => import("../three/PaintScene"), {
  ssr: false,
  loading: () => <Poster />,
});

const STEPS = [
  { title: "The bottle opens", text: "Your chosen shade, on the brush." },
  { title: "One smooth coat, base to tip", text: "Even colour from cuticle to tip." },
  { title: "Glossy finish", text: "A clear, high-shine look." },
];

// Timeline positions (0–1 of the section's scroll) where each caption takes over.
const STEP_AT = [0, 0.3, 0.8];

export function PaintSection() {
  const { shade } = useShade();
  const can3D = useCan3D();
  const webglMissing = useWebGLMissing();
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const progress = useRef<PaintProgress>({
    bottle: 0,
    lift: 0,
    travel: 0,
    fill: 0,
    ret: 0,
    spin: 0,
  });

  useEffect(() => {
    if (!can3D || !section.current) return;
    const el = section.current;
    const p = progress.current;
    const steps = el.querySelectorAll<HTMLElement>("[data-step]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
        onUpdate: () => {
          const t = tl.progress();
          let current = 0;
          STEP_AT.forEach((at, i) => {
            if (t >= at) current = i;
          });
          steps.forEach((s, i) => (s.dataset.active = String(i === current)));
          if (bar.current) bar.current.style.transform = `scaleY(${p.fill})`;
        },
      });
      tl.to(p, { bottle: 1, duration: 0.14 }, 0)
        .to(p, { lift: 1, duration: 0.1 }, 0.14)
        .to(p, { travel: 1, duration: 0.1 }, 0.24)
        .to(p, { fill: 1, duration: 0.42 }, 0.34)
        .to(p, { ret: 1, duration: 0.12 }, 0.78)
        .to(p, { spin: 1, duration: 0.1 }, 0.9);
    }, el);

    el.dataset.animated = "true";
    return () => {
      ctx.revert();
      delete el.dataset.animated;
    };
  }, [can3D]);

  return (
    <section
      ref={section}
      id="paint"
      aria-labelledby="paint-title"
      className={`group/paint relative bg-blush text-henna ${
        webglMissing ? "h-auto" : "h-[320vh] motion-reduce:h-auto"
      }`}
    >
      <div
        className={`${
          webglMissing ? "" : "sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto"
        } mx-auto flex max-w-6xl flex-col px-4 pb-24 sm:px-6 md:pb-0 md:grid md:grid-cols-[1fr_1.15fr] md:items-center md:gap-8`}
      >
        <div className="relative z-10 pt-10 md:pt-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
            Scroll to paint
          </p>
          <h2
            id="paint-title"
            className="font-display text-[clamp(2rem,7.5vw,3.75rem)] leading-[1.05]"
          >
            One flawless coat, base to tip.
          </h2>

          <div className="mt-6 flex gap-4 md:mt-10">
            <span
              className="relative hidden w-[3px] shrink-0 overflow-hidden rounded-full bg-henna/15 group-data-[animated=true]/paint:block"
              aria-hidden="true"
            >
              <span
                ref={bar}
                className="absolute inset-0 origin-bottom scale-y-0 bg-henna"
              />
            </span>
            <ol className="space-y-3 md:space-y-6">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  data-step={i}
                  data-active={i === 0 ? "true" : "false"}
                  className="transition-opacity duration-500 group-data-[animated=true]/paint:data-[active=false]:opacity-35"
                >
                  <p className="font-display text-lg leading-snug md:text-2xl">
                    <span className="mr-2 font-sans text-xs font-bold tracking-widest text-henna/60">
                      0{i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="hidden text-sm text-henna/75 md:block">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-5 text-sm md:mt-10">
            Shade: <strong>{shade.name}</strong>{" "}
            <a href="#shades" className="ml-1 font-bold underline underline-offset-4">
              Change shade
            </a>
          </p>
        </div>

        <ThreeSlot
          className="-mx-4 min-h-[280px] flex-1 md:mx-0 md:h-[86svh] md:flex-none"
          fallback={<Poster />}
        >
          {(active) => <PaintScene active={active} progress={progress} shade={shade} />}
        </ThreeSlot>
      </div>
    </section>
  );
}
