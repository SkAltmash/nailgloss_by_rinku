import Image from "next/image";
import { CONTACT } from "@/lib/data";
import { CALL_LINK } from "@/lib/whatsapp";
import { AlmondOutline, InstagramIcon, PhoneIcon } from "../icons";
import { CallButton } from "../CallButton";
import { WhatsAppButton } from "../WhatsAppButton";
import { HeroVisual } from "./HeroVisual";

const NAV = [
  { href: "#shades", label: "Shades" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#booking", label: "Booking" },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate overflow-hidden bg-henna text-blush"
    >
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-3 sm:px-6 md:pt-5">
        <a href="#top" className="block rounded-md" aria-label={`${CONTACT.name} — home`}>
          <Image
            src="/logo-dark.png"
            alt={CONTACT.name}
            width={953}
            height={628}
            priority
            className="h-14 w-auto md:h-16"
          />
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-bold">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded py-2 text-blush/85 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-11 items-center justify-center rounded-full text-blush/90 hover:text-white"
          >
            <InstagramIcon className="size-5" />
          </a>
          <a
            href={CALL_LINK}
            aria-label={`Call ${CONTACT.phoneDisplay}`}
            className="flex size-11 items-center justify-center rounded-full text-blush/90 hover:text-white md:w-auto md:gap-2 md:px-3"
          >
            <PhoneIcon className="size-5" />
            <span className="hidden text-sm font-bold md:inline">{CONTACT.phoneDisplay}</span>
          </a>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-6xl flex-col px-4 pb-6 sm:px-6 md:grid md:min-h-[calc(100svh-5.5rem)] md:grid-cols-[1.05fr_1fr] md:items-center md:pb-16">
        {/* Brand motif: oversized almond outline behind the nail */}
        <AlmondOutline className="pointer-events-none absolute right-[-22%] top-[22%] -z-10 h-[62%] text-chrome/15 md:right-[2%] md:top-[8%] md:h-[88%]" />

        <div className="relative z-10 pt-6 md:pt-0">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-chrome sm:text-xs">
            <span className="h-px w-6 bg-chrome/60" aria-hidden="true" />
            Doorstep nail technician · {CONTACT.city}
          </p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.4rem,11vw,5.25rem)] leading-[1.02] text-white"
          >
            Salon-style nails, <span className="text-blush">ab aapke ghar par</span>
          </h1>
          <p className="mt-6 hidden max-w-md text-lg leading-relaxed text-blush/85 md:block">
            Rinku {CONTACT.city} mein aapke ghar aakar nails karti hai. Shade chuno, WhatsApp
            karo, aur ghar baithe nails ready.
          </p>
          <div data-cta className="mt-9 hidden flex-wrap gap-3 md:flex">
            <WhatsAppButton variant="light" />
            <CallButton tone="onDark" />
          </div>
        </div>

        <HeroVisual className="-mx-4 min-h-[240px] flex-1 md:mx-0 md:h-[78svh] md:min-h-[520px] md:flex-none" />

        <div className="relative z-10 md:hidden">
          <p className="mb-4 text-[15px] leading-snug text-blush/85">
            Rinku aapke ghar aakar nails karti hai — sirf WhatsApp karo.
          </p>
          <div data-cta className="flex gap-2">
            <WhatsAppButton variant="light" className="flex-1 px-4" />
            <CallButton tone="onDark" compact className="w-12 shrink-0 px-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
