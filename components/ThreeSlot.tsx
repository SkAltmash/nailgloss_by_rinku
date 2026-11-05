"use client";

import { Component, useRef, type ReactNode } from "react";
import { useCan3D, useInView } from "@/lib/hooks";

class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Hosts a lazily-loaded 3D scene. The static `fallback` is rendered on the
 * server, while the scene loads, when WebGL is missing, when the visitor
 * prefers reduced motion, and if the canvas throws. The canvas only mounts
 * once the slot nears the viewport and pauses rendering when off-screen.
 */
export function ThreeSlot({
  fallback,
  children,
  className = "",
}: {
  fallback: ReactNode;
  children: (active: boolean) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const can3D = useCan3D();
  const { inView, entered } = useInView(ref);

  return (
    <div ref={ref} className={`relative ${className}`} aria-hidden="true">
      {/* Absolute layer so the canvas fills the slot even when the slot's
          height comes from flex/min-height rather than an explicit height. */}
      <div className="absolute inset-0">
        {can3D && entered ? (
          <CanvasErrorBoundary fallback={fallback}>{children(inView)}</CanvasErrorBoundary>
        ) : (
          fallback
        )}
      </div>
    </div>
  );
}
