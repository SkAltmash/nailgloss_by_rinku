import Image from "next/image";
import { listPublicImages } from "@/lib/media";

/**
 * Real client screenshots only. Drop WhatsApp/Instagram review screenshots
 * into /public/reviews/ and this section appears; with none, it is omitted.
 */
export function Reviews() {
  const shots = listPublicImages("reviews");
  if (shots.length === 0) return null;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-chrome text-henna">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
          Client messages
        </p>
        <h2
          id="reviews-title"
          className="max-w-xl font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]"
        >
          Clients ki apni baatein
        </h2>

        <ul
          tabIndex={0}
          aria-label="Client screenshots"
          className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:max-w-4xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0"
        >
          {shots.map((src, i) => (
            <li key={src} className="w-[72%] shrink-0 snap-center sm:w-[44%] md:w-auto">
              <div className="relative aspect-9/16 overflow-hidden rounded-[1.75rem] border-[6px] border-henna bg-white">
                <Image
                  src={src}
                  alt={`Client review screenshot ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 72vw"
                  className="object-cover object-top"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
