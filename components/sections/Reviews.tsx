import Image from "next/image";
import { SAMPLE_REVIEWS, SHOW_DEMO_CONTENT } from "@/lib/demo";
import { listPublicImages } from "@/lib/media";

/**
 * Real client screenshots from /public/reviews/ take priority. Without them,
 * sample testimonials (each tagged "Sample") show when demo content is on;
 * otherwise the section is omitted.
 */
export function Reviews() {
  const shots = listPublicImages("reviews");
  const showSamples = shots.length === 0 && SHOW_DEMO_CONTENT;
  if (shots.length === 0 && !showSamples) return null;

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
          In our clients&apos; words
        </h2>

        {showSamples ? (
          <ul
            tabIndex={0}
            aria-label="Client reviews"
            className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4"
          >
            {SAMPLE_REVIEWS.map((r) => (
              <li
                key={r.name}
                className="flex w-[82%] shrink-0 snap-center flex-col rounded-2xl rounded-tl-sm bg-white p-6 shadow-[0_10px_30px_rgba(74,31,20,0.08)] sm:w-[60%] md:w-auto"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex gap-0.5 text-henna" aria-label="5 out of 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden="true">
                        <path d="m10 1.6 2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.6l-5.1 2.8L6 11.6l-4.3-4 5.8-.7L10 1.6Z" />
                      </svg>
                    ))}
                  </span>
                  <span className="rounded-full border border-henna/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-henna/55">
                    Sample
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 font-display text-lg leading-snug">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <p className="mt-6 border-t border-henna/10 pt-4 text-sm">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-henna/60"> · {r.area}</span>
                  <span className="mt-0.5 block text-xs uppercase tracking-widest text-henna/50">
                    {r.service}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </div>
    </section>
  );
}
