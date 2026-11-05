import Image from "next/image";
import { CONTACT } from "@/lib/data";
import { CALL_LINK } from "@/lib/whatsapp";
import { AlmondOutline, InstagramIcon, PhoneIcon } from "../icons";
import { CallButton } from "../CallButton";
import { WhatsAppButton } from "../WhatsAppButton";

export function FinalCta() {
  return (
    <>
      <section
        id="book"
        aria-labelledby="book-title"
        className="on-dark relative isolate overflow-hidden bg-henna text-blush"
      >
        <AlmondOutline className="pointer-events-none absolute -bottom-[30%] left-1/2 -z-10 h-[150%] -translate-x-1/2 text-chrome/10" />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 md:py-32">
          <h2
            id="book-title"
            className="font-display text-[clamp(2.25rem,9vw,4.5rem)] leading-[1.03] text-white"
          >
            Agla nail day, <span className="text-blush">ghar par.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-blush/85">
            WhatsApp par apna shade, date aur area bhejo — Rinku {CONTACT.city} mein aapke ghar
            aayegi.
          </p>
          <div data-cta className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton variant="light" showShade className="w-full sm:w-auto" />
            <CallButton tone="onDark" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      <footer className="on-dark border-t border-blush/15 bg-henna pb-28 text-blush md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <Image
            src="/logo-dark.png"
            alt={CONTACT.name}
            width={953}
            height={628}
            className="h-16 w-auto rounded-md"
          />
          <ul className="space-y-3 text-sm md:justify-self-center">
            <li>
              <a href={CALL_LINK} className="inline-flex items-center gap-2 font-bold hover:underline">
                <PhoneIcon className="size-4" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold hover:underline"
              >
                <InstagramIcon className="size-4" />
                {CONTACT.instagramHandle}
              </a>
            </li>
            <li className="text-blush/75">Doorstep service · {CONTACT.city}</li>
          </ul>
          <p className="text-xs text-blush/60 md:text-right">
            © {CONTACT.name}
            <br />
            Website by Altamash
          </p>
        </div>
      </footer>
    </>
  );
}
