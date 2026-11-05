"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getShade, SERVICES } from "@/lib/data";
import { NailPoster } from "../NailPoster";
import { ThreeSlot } from "../ThreeSlot";
import { WhatsAppButton } from "../WhatsAppButton";

function Poster() {
  return (
    <div className="grid h-full grid-cols-4 items-center gap-2 px-4 md:grid-cols-2 md:gap-8 md:px-12">
      {SERVICES.map((s, i) => {
        const shade = getShade(s.shadeId);
        return (
          <NailPoster
            key={s.id}
            color={shade.hex}
            metallic={shade.metalness > 0.5}
            className={`mx-auto h-24 md:h-40 ${i % 2 ? "rotate-12" : "-rotate-12"}`}
          />
        );
      })}
    </div>
  );
}

const ServicesScene = dynamic(() => import("../three/ServicesScene"), {
  ssr: false,
  loading: () => <Poster />,
});

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="on-dark bg-henna text-blush"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-14">
          <div className="md:sticky md:top-0 md:flex md:self-start md:h-svh md:flex-col md:justify-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-chrome">
              Services
            </p>
            <h2
              id="services-title"
              className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] text-white"
            >
              Kya karwana hai?
            </h2>
            <ThreeSlot className="-mx-4 mt-6 h-50 md:mx-0 md:h-[52svh]" fallback={<Poster />}>
              {(active) => <ServicesScene active={active} activeIndex={activeIndex} />}
            </ThreeSlot>
          </div>

          <div className="md:py-[18svh]">
            <ul className="border-t border-blush/20">
              {SERVICES.map((service, i) => {
                const shade = getShade(service.shadeId);
                return (
                  <li
                    key={service.id}
                    onPointerEnter={() => setActiveIndex(i)}
                    onPointerLeave={() => setActiveIndex(null)}
                    className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-b border-blush/20 py-7 transition-colors hover:bg-white/3 sm:grid-cols-[auto_1fr_auto] sm:gap-x-6 md:py-10"
                  >
                    <span
                      className="nail-swatch mt-1 block h-9 w-6 transition-transform duration-300 group-hover:-translate-y-1"
                      style={{ backgroundColor: shade.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-display text-2xl text-white md:text-3xl">{service.name}</h3>
                      <p className="mt-2 max-w-sm text-blush/80">{service.blurb}</p>
                    </div>
                    <p className="col-start-2 mt-3 text-sm font-bold text-chrome sm:col-start-3 sm:mt-1 sm:text-right">
                      {service.price ? (
                        <>
                          <span className="sr-only">Price: </span>
                          {service.price}
                        </>
                      ) : (
                        "Rate WhatsApp par"
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div data-cta className="mt-10">
              <WhatsAppButton variant="light" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
