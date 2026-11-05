"use client";

import { whatsappLink } from "@/lib/whatsapp";
import { useShade } from "./ShadeProvider";
import { WhatsAppIcon } from "./icons";

type Variant = "light" | "dark";

const VARIANTS: Record<Variant, string> = {
  // For dark (henna) backgrounds
  light: "bg-blush text-henna hover:bg-white",
  // For light backgrounds
  dark: "bg-henna text-blush hover:bg-henna-deep",
};

export function WhatsAppButton({
  label = "Book on WhatsApp",
  variant = "light",
  className = "",
  showShade = false,
}: {
  label?: string;
  variant?: Variant;
  className?: string;
  showShade?: boolean;
}) {
  const { shade } = useShade();
  return (
    <a
      href={whatsappLink(shade.name)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-base font-bold tracking-wide transition-colors ${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppIcon className="size-5 shrink-0" />
      <span>{label}</span>
      {showShade && (
        <span className="text-sm font-medium opacity-75">· {shade.name}</span>
      )}
    </a>
  );
}
