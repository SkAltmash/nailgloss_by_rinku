import Image from "next/image";
import { CONTACT } from "@/lib/data";
import { DEMO_PHOTOS, SHOW_DEMO_CONTENT } from "@/lib/demo";
import { listPublicImages } from "@/lib/media";
import { InstagramIcon } from "../icons";

/**
 * Shows Rinku's real work from /public/gallery/. Until photos are added it
 * shows demo stock photos (if enabled), otherwise an Instagram feature.
 */
export function Gallery() {
  const real = listPublicImages("gallery").map((src, i) => ({
    src,
    alt: `Nail work by Rinku, photo ${i + 1}`,
  }));
  const isDemo = real.length === 0 && SHOW_DEMO_CONTENT;
  const images = isDemo ? DEMO_PHOTOS : real;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-blush text-henna">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        {images.length > 0 ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
                  Gallery
                </p>
                <h2
                  id="gallery-title"
                  className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]"
                >
                  {isDemo ? "Nail inspiration" : <>Rinku&apos;s work</>}
                </h2>
              </div>
              <InstagramLink />
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {images.map(({ src, alt }, i) => (
                <li
                  key={src}
                  className={`${i % 3 === 1 ? "md:translate-y-8" : ""} ${
                    // Keep the 2-column mobile grid even.
                    images.length % 2 === 1 && i === images.length - 1 ? "max-md:hidden" : ""
                  }`}
                >
                  <div className="nail-top relative aspect-4/5 overflow-hidden bg-chrome">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <InstagramFeature />
        )}
      </div>
    </section>
  );
}

function InstagramLink() {
  return (
    <a
      href={CONTACT.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-full font-bold underline-offset-4 hover:underline"
    >
      <InstagramIcon className="size-5" />
      See more on Instagram
    </a>
  );
}

function InstagramFeature() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
      <div className="relative mx-auto w-full max-w-[320px]">
        {/* Profile card in the brand's almond silhouette */}
        <div className="nail-top relative aspect-[4/5] overflow-hidden bg-henna">
          <Image
            src="/instagram-avatar.png"
            alt=""
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
        <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-bold shadow-[0_8px_24px_rgba(74,31,20,0.15)]">
          {CONTACT.instagramHandle}
        </p>
      </div>

      <div className="text-center md:text-left">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
          Gallery
        </p>
        <h2
          id="gallery-title"
          className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]"
        >
          Rinku&apos;s work, on Instagram
        </h2>
        <p className="mx-auto mt-4 max-w-md text-henna/80 md:mx-0">
          The latest designs, shades and client nails are on Rinku&apos;s Instagram. Found a
          design you love? Send the screenshot on WhatsApp.
        </p>
        <a
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-henna px-6 py-3 font-bold text-blush transition-colors hover:bg-henna-deep"
        >
          <InstagramIcon className="size-5" />
          View on Instagram
        </a>
      </div>
    </div>
  );
}
