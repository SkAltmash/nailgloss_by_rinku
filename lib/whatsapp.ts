import { CONTACT } from "./data";

export function whatsappMessage(shadeName: string): string {
  return `Hi Rinku, mujhe nails book karne hain. Shade: ${shadeName}. Date: . Area: `;
}

export function whatsappLink(shadeName: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage(shadeName),
  )}`;
}

export const CALL_LINK = `tel:${CONTACT.phone}`;
