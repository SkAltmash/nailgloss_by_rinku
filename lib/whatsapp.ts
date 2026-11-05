import { CONTACT } from "./data";

export function whatsappMessage(shadeName: string, service?: string): string {
  const what = service ? `a ${service.toLowerCase()} appointment` : "a nail appointment";
  return `Hi Rinku, I would like to book ${what}. Shade: ${shadeName}. Date: . Area: `;
}

export function whatsappLink(shadeName: string, service?: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage(shadeName, service),
  )}`;
}

export const CALL_LINK = `tel:${CONTACT.phone}`;
