import { BOOKING_STEPS } from "@/lib/data";

export function BookingSteps() {
  return (
    <section id="booking" aria-labelledby="booking-title" className="bg-white text-henna">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-henna/70">
          How booking works
        </p>
        <h2
          id="booking-title"
          className="max-w-2xl font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.05]"
        >
          Three simple steps
        </h2>

        <ol className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-chrome md:bottom-auto md:left-6 md:right-6 md:top-7 md:h-px md:w-auto"
          />
          {BOOKING_STEPS.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[auto_1fr] gap-5 md:block">
              <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-henna bg-white font-display text-xl md:size-14 md:text-2xl">
                {i + 1}
              </span>
              <div className="md:mt-7">
                <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                <p className="mt-2 max-w-xs text-henna/75">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
