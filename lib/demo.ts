// Preview content for client presentations.
//
// Set SHOW_DEMO_CONTENT to false before launch. Real photos in /public/gallery/
// and real screenshots in /public/reviews/ always take priority over this file.

export const SHOW_DEMO_CONTENT = true;

/** Stock photos under the Unsplash License (free for commercial use). */
export const DEMO_PHOTOS = [
  { src: "/demo/gallery/demo-01.jpg", alt: "Soft pink manicure", credit: "Chelson Tamares" },
  { src: "/demo/gallery/demo-02.jpg", alt: "Almond-shaped golden nails", credit: "Caroline Badran" },
  { src: "/demo/gallery/demo-03.jpg", alt: "Mauve and glitter nails", credit: "Patrícia Hellinger" },
  { src: "/demo/gallery/demo-04.jpg", alt: "Pink manicure", credit: "Jodene Isakowitz" },
  { src: "/demo/gallery/demo-05.jpg", alt: "Nude almond nails", credit: "Caroline Badran" },
  { src: "/demo/gallery/demo-06.jpg", alt: "Navy, gold and white nail art", credit: "Ari Kurniawan" },
  { src: "/demo/gallery/demo-07.jpg", alt: "Pink nail art", credit: "DESIGNECOLOGIST" },
  { src: "/demo/gallery/demo-08.jpg", alt: "Metallic and jewelled nails", credit: "de Aura" },
  { src: "/demo/gallery/demo-09.jpg", alt: "Black and tortoiseshell nails", credit: "Bryony Elena" },
];

/**
 * Sample testimonials for the presentation only — every card is tagged
 * "Sample" on the page. Replace with real client feedback before launch.
 */
export const SAMPLE_REVIEWS = [
  {
    name: "Priya S.",
    area: "Dharampeth",
    service: "Gel polish",
    text: "Booking on WhatsApp took two minutes. The red gel looked exactly like the shade I picked on the site.",
  },
  {
    name: "Neha K.",
    area: "Manish Nagar",
    service: "Nail extensions",
    text: "So convenient to get extensions done at home before a family function. Neat, clean work.",
  },
  {
    name: "Ankita M.",
    area: "Civil Lines",
    service: "Nail art",
    text: "Sent a design screenshot from Instagram and it came out beautifully. Will book again.",
  },
  {
    name: "Ritika P.",
    area: "Sadar",
    service: "Press-on nails",
    text: "Loved the chrome set. Easy to wear and they still look glossy.",
  },
];
