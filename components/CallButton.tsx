import { CONTACT } from "@/lib/data";
import { CALL_LINK } from "@/lib/whatsapp";
import { PhoneIcon } from "./icons";

export function CallButton({
  tone = "onDark",
  compact = false,
  className = "",
}: {
  tone?: "onDark" | "onLight";
  /** Icon only (label kept for screen readers). */
  compact?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "onDark"
      ? "border-blush/40 text-blush hover:border-blush"
      : "border-henna/30 text-henna hover:border-henna";
  return (
    <a
      href={CALL_LINK}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border px-6 py-3 text-base font-bold transition-colors ${toneClass} ${className}`}
      aria-label={`Call Rinku at ${CONTACT.phoneDisplay}`}
    >
      <PhoneIcon className="size-5 shrink-0" />
      <span className={compact ? "sr-only" : undefined}>Call</span>
    </a>
  );
}
