"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SHADE_ID, getShade, type Shade, type ShadeId } from "@/lib/data";

interface ShadeContextValue {
  shade: Shade;
  setShadeId: (id: ShadeId) => void;
}

const ShadeContext = createContext<ShadeContextValue | null>(null);

export function ShadeProvider({ children }: { children: ReactNode }) {
  const [shadeId, setShadeId] = useState<ShadeId>(DEFAULT_SHADE_ID);
  const value = useMemo(() => ({ shade: getShade(shadeId), setShadeId }), [shadeId]);
  return <ShadeContext value={value}>{children}</ShadeContext>;
}

export function useShade(): ShadeContextValue {
  const ctx = useContext(ShadeContext);
  if (!ctx) throw new Error("useShade must be used inside <ShadeProvider>");
  return ctx;
}
