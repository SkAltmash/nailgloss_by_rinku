import { ShadeProvider } from "@/components/ShadeProvider";
import { CONTACT, SERVICES } from "@/lib/data";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StickyBookBar } from "@/components/StickyBookBar";
import { BookingSteps } from "@/components/sections/BookingSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { PaintSection } from "@/components/sections/PaintSection";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { ShadePicker } from "@/components/sections/ShadePicker";

// Only facts the business supplied: name, phone, city, Instagram, services.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NailSalon",
  name: CONTACT.name,
  telephone: CONTACT.phone,
  areaServed: { "@type": "City", name: CONTACT.city },
  address: { "@type": "PostalAddress", addressLocality: CONTACT.city, addressCountry: "IN" },
  sameAs: [CONTACT.instagramUrl],
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name },
  })),
};

export default function Home() {
  return (
    <ShadeProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-blush px-4 py-2 font-bold text-henna focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Hero />
      <main id="main">
        <PaintSection />
        <ShadePicker />
        <Services />
        <Gallery />
        <BookingSteps />
        <Reviews />
      </main>
      <FinalCta />
      <StickyBookBar />
    </ShadeProvider>
  );
}
