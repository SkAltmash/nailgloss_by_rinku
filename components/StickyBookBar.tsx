"use client";

import { useEffect, useState } from "react";
import { CallButton } from "./CallButton";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Booking bar for small screens. Slides in once the hero buttons scroll away
 * and steps aside while another booking CTA (marked `data-cta`) is on screen.
 */
export function StickyBookBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-cta]");
    const visible = new Set<Element>();
    let scrolled = false;
    const update = () => setShow(scrolled && visible.size === 0);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // Hidden (display:none) targets never intersect; ignore them.
        if (e.isIntersecting && e.boundingClientRect.height > 0) visible.add(e.target);
        else visible.delete(e.target);
      }
      update();
    });
    targets.forEach((t) => io.observe(t));

    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.5;
      if (next !== scrolled) {
        scrolled = next;
        update();
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-henna/10 bg-white/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(74,31,20,0.12)] backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex gap-2">
        <WhatsAppButton variant="dark" className="flex-1 px-4" />
        <CallButton tone="onLight" compact className="w-12 shrink-0 px-0" />
      </div>
    </div>
  );
}
