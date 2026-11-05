"use client";

import dynamic from "next/dynamic";
import { NailPoster } from "../NailPoster";
import { ThreeSlot } from "../ThreeSlot";
import { useShade } from "../ShadeProvider";

function Poster() {
  const { shade } = useShade();
  return (
    <div className="flex h-full items-center justify-center">
      <NailPoster
        color={shade.hex}
        metallic={shade.metalness > 0.5}
        className="h-[62%] max-h-[420px] -rotate-[18deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}

const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => <Poster />,
});

export function HeroVisual({ className = "" }: { className?: string }) {
  const { shade } = useShade();
  return (
    <ThreeSlot className={className} fallback={<Poster />}>
      {(active) => <HeroScene active={active} shade={shade} />}
    </ThreeSlot>
  );
}
