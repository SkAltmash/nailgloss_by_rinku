// Single source of truth for business facts, shades and services.
// Only facts supplied by the client live here — prices stay null until confirmed.

export const CONTACT = {
  name: "Nail Gloss by Rinku",
  city: "Nagpur",
  whatsappNumber: "918421000722",
  phone: "+918421000722",
  phoneDisplay: "+91 84210 00722",
  instagramUrl: "https://www.instagram.com/nailgloss_by_rinku_/",
  instagramHandle: "@nailgloss_by_rinku_",
} as const;

export type ShadeId = "chrome" | "red" | "nude" | "plum";

export interface Shade {
  id: ShadeId;
  name: string;
  /** Display colour, also used as the 3D paint colour. */
  hex: string;
  /** PBR values for the painted surface. Chrome is fully metallic. */
  metalness: number;
  roughness: number;
  /** Short line shown in the picker. */
  note: string;
}

export const SHADES: Shade[] = [
  {
    id: "chrome",
    name: "Chrome",
    hex: "#D5D9DE",
    metalness: 1,
    roughness: 0.08,
    note: "Mirror-shine silver finish",
  },
  {
    id: "red",
    name: "Red",
    hex: "#A3122A",
    metalness: 0,
    roughness: 0.1,
    note: "Classic glossy red",
  },
  {
    id: "nude",
    name: "Nude",
    hex: "#D7A48F",
    metalness: 0,
    roughness: 0.12,
    note: "Soft, everyday nude",
  },
  {
    id: "plum",
    name: "Plum",
    hex: "#5B1F45",
    metalness: 0,
    roughness: 0.1,
    note: "Deep berry plum",
  },
];

export const DEFAULT_SHADE_ID: ShadeId = "red";

export function getShade(id: ShadeId): Shade {
  return SHADES.find((s) => s.id === id) ?? SHADES[0];
}

export interface Service {
  id: string;
  name: string;
  blurb: string;
  /** Set the confirmed rate (e.g. "₹1,200") — null shows "Price on request". */
  price: string | null;
  /** Shade used for this service's floating 3D nail. */
  shadeId: ShadeId;
}

export const SERVICES: Service[] = [
  {
    id: "extensions",
    name: "Nail extensions",
    blurb: "Added length and shape over your natural nails.",
    price: null,
    shadeId: "nude",
  },
  {
    id: "gel",
    name: "Gel polish",
    blurb: "A glossy gel finish in the shade of your choice.",
    price: null,
    shadeId: "red",
  },
  {
    id: "art",
    name: "Nail art",
    blurb: "Custom nail art based on the design you choose.",
    price: null,
    shadeId: "chrome",
  },
  {
    id: "press-on",
    name: "Press-on nails",
    blurb: "Ready-to-wear nails that are easy to apply at home.",
    price: null,
    shadeId: "plum",
  },
];

export const BOOKING_STEPS = [
  {
    title: "Choose your design",
    text: "Pick a shade above, or select a design you like from Instagram.",
  },
  {
    title: "Send your date and area on WhatsApp",
    text: "The message is pre-filled — just add your preferred date and area.",
  },
  {
    title: "Rinku comes to your home",
    text: "No salon visit needed. Rinku arrives at your home on the agreed date.",
  },
] as const;
