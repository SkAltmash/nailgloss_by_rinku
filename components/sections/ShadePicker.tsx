"use client";

import dynamic from "next/dynamic";
import { SHADES } from "@/lib/data";
import { whatsappMessage } from "@/lib/whatsapp";
import { NailPoster } from "../NailPoster";
import { ThreeSlot } from "../ThreeSlot";
import { useShade } from "../ShadeProvider";
import { WhatsAppButton } from "../WhatsAppButton";

function Poster() {
  const { shade } = useShade();
  return (
    <div className="flex h-full items-center justify-center">
      <NailPoster
        color={shade.hex}
        metallic={shade.metalness > 0.5}
        className="h-[60%] max-h-[360px] -rotate-6 drop-shadow-[0_24px_30px_rgba(74,31,20,0.25)]"
      />
    </div>
  );
}

const ShadeScene = dynamic(() => import("../three/ShadeScene"), {
  ssr: false,
  loading: () => <Poster />,
});

export function ShadePicker() {
  const { shade, setShadeId } = useShade();

  return (
    <section id="shades" aria-labelledby="shades-title" className="bg-white text-henna">
      <div className="mx-auto grid max-w-6xl px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:grid-rows-[auto_auto] md:items-center md:gap-x-10 md:py-28">
        <ThreeSlot
          className="order-2 h-[34svh] min-h-[230px] md:order-1 md:row-span-2 md:h-[620px]"
          fallback={<Poster />}
        >
          {(active) => <ShadeScene active={active} shade={shade} />}
        </ThreeSlot>

        <div className="order-1 md:order-2 md:self-end">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
            Shade picker
          </p>
          <h2
            id="shades-title"
            className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]"
          >
            Apna shade chuno
          </h2>
          <p className="mt-4 max-w-md text-henna/80">
            Jo shade aap chunoge, wahi aapke WhatsApp booking message mein chala jayega.
          </p>
        </div>

        <div className="order-3 md:self-start">
          <fieldset className="mt-2 md:mt-8">
            <legend className="sr-only">Nail shade</legend>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {SHADES.map((s) => (
                <label
                  key={s.id}
                  className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl py-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-henna"
                >
                  <input
                    type="radio"
                    name="shade"
                    value={s.id}
                    checked={shade.id === s.id}
                    onChange={() => setShadeId(s.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="nail-swatch block h-16 w-11 transition-transform duration-300 group-hover:-translate-y-1 peer-checked:-translate-y-1.5 peer-checked:scale-110 sm:h-20 sm:w-14"
                    style={{ backgroundColor: s.hex }}
                  />
                  <span className="text-sm font-bold">{s.name}</span>
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-6 scale-x-0 bg-henna transition-transform duration-300 peer-checked:scale-x-100"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mt-6 text-sm text-henna/75" aria-live="polite">
            <strong className="text-henna">{shade.name}</strong> — {shade.note}
          </p>

          <div className="mt-6 border-l-2 border-chrome pl-4 text-sm text-henna/70">
            <span className="block text-xs font-bold uppercase tracking-widest text-henna/50">
              Aapka WhatsApp message
            </span>
            <span className="break-words">{whatsappMessage(shade.name)}</span>
          </div>

          <div data-cta className="mt-8">
            <WhatsAppButton variant="dark" className="w-full sm:w-auto" label={`Book ${shade.name} on WhatsApp`} />
          </div>
        </div>
      </div>
    </section>
  );
}
