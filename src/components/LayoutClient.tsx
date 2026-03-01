"use client";

import { useBackgroundView } from "@/contexts/BackgroundViewContext";
import BackgroundCanvasOverlay from "./BackgroundCanvasOverlay";
import BackgroundViewToggle from "./BackgroundViewToggle";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showBackgroundOnly } = useBackgroundView();

  return (
    <>
      <div
        className="app-content transition-opacity duration-300"
        style={{
          opacity: showBackgroundOnly ? 0.08 : 1,
          pointerEvents: showBackgroundOnly ? "none" : "auto",
        }}
      >
        {children}
      </div>
      <BackgroundCanvasOverlay />
      <BackgroundViewToggle />
    </>
  );
}
