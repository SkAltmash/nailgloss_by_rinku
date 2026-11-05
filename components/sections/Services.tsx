"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CONTACT, getShade, SERVICES } from "@/lib/data";
import { whatsappLink } from "@/lib/whatsapp";
import { NailPoster } from "../NailPoster";
import { ThreeSlot } from "../ThreeSlot";
import { useShade } from "../ShadeProvider";
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

const HIGHLIGHTS = ["At your home", `Across ${CONTACT.city}`, "Booked on WhatsApp"];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { shade } = useShade();

  return (
    <section id="services" aria-labelledby="services-title" className="on-dark bg-henna text-blush">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="md:grid md:grid-cols-[1fr_1.15fr] md:gap-16">
          {/* Intro + floating nails (sticky on desktop) */}
          <div className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:self-start">
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-chrome">
              <span className="h-px w-6 bg-chrome/60" aria-hidden="true" />
              The service menu
            </p>
            <h2
              id="services-title"
              className="font-display text-[clamp(2.25rem,8vw,3.75rem)] leading-[1.02] text-white"
            >
              Signature services
            </h2>
            <p className="mt-5 max-w-sm text-blush/80">
              Salon-style nail care, done in the comfort of your home. Pick a service and
              book it in one tap.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-chrome/90">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-chrome" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
            <ThreeSlot className="-mx-4 mt-8 h-50 md:mx-0 md:mt-6 md:h-[46svh]" fallback={<Poster />}>
              {(active) => <ServicesScene active={active} activeIndex={activeIndex} />}
            </ThreeSlot>
          </div>

          {/* Menu */}
          <div className="mt-6 md:mt-0 md:py-[16svh]">
            <ol className="border-t border-blush/20">
              {SERVICES.map((service, i) => {
                const swatch = getShade(service.shadeId);
                const isActive = activeIndex === i;
                return (
                  <li
                    key={service.id}
                    onPointerEnter={() => setActiveIndex(i)}
                    onPointerLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(i)}
                    onBlur={() => setActiveIndex(null)}
                    className="relative border-b border-blush/20"
                  >
                    {/* Accent bar in the service's shade */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 h-full w-0.5 origin-top transition-transform duration-500 ${
                        isActive ? "scale-y-100" : "scale-y-0"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 py-7 pl-3 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-5 md:py-9">
                      <span className="pt-1.5 font-display text-sm text-chrome/70 sm:text-base">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3
                          className={`font-display text-[1.65rem] leading-tight transition-colors md:text-3xl ${
                            isActive ? "text-white" : "text-blush"
                          }`}
                        >
                          {service.name}
                        </h3>
                        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-blush/75">
                          {service.blurb}
                        </p>
                      </div>

                      <div className="col-start-2 mt-5 flex items-center justify-between gap-4 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end sm:justify-between sm:pt-1.5">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-chrome">
                          {service.price ? (
                            <>
                              <span className="sr-only">Price: </span>
                              {service.price}
                            </>
                          ) : (
                            "Price on request"
                          )}
                        </p>
                        <a
                          href={whatsappLink(shade.name, service.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Book ${service.name} on WhatsApp`}
                          className="group/book inline-flex min-h-11 items-center gap-2 rounded-full border border-blush/30 px-4 text-sm font-bold text-blush transition-colors hover:border-blush hover:bg-blush hover:text-henna"
                        >
                          Book
                          <ArrowIcon className="size-4 transition-transform group-hover/book:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-sm text-blush/70">
                Not sure what to choose? Send your question on WhatsApp.
              </p>
              <div data-cta>
                <WhatsAppButton variant="light" label="Ask on WhatsApp" className="w-full whitespace-nowrap sm:w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
