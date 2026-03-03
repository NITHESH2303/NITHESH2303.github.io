"use client";

import { useCallback } from "react";
import { useBackgroundView } from "@/contexts/BackgroundViewContext";
import type { HoveredElement } from "@/contexts/BackgroundViewContext";

function hitTest(
  x: number,
  y: number,
  width: number,
  height: number
): HoveredElement {
  const px = x / width;
  const py = y / height;

  if (px >= 0.08 && px <= 0.42 && py >= 0.2 && py <= 0.66) return "neuralNetwork";
  if (px >= 0.06 && px <= 0.22 && py >= 0.12 && py <= 0.28) return "transformerAttention";
  if (px >= 0.82 && px <= 0.94 && py >= 0.58 && py <= 0.72) return "activationFunctions";
  if (px >= 0.54 && px <= 0.76 && py >= 0.50 && py <= 0.70) return "cnnFeatureMap";
  const lcx = 0.78;
  const lcy = 0.45;
  const lr = 80 / width;
  const lry = 80 / 1.4 / height;
  if (Math.pow((px - lcx) / lr, 2) + Math.pow((py - lcy) / lry, 2) <= 1) return "lossLandscape";
  if (py >= 0.82 && py <= 0.92) return "fourierWaves";
  if (px >= 0.02 && px <= 0.25 && py >= 0.7 && py <= 0.95) return "goldenSpiral";
  if (px >= 0.86 && px <= 0.96 && py >= 0.08 && py <= 0.22) return "attentionHeatmap";
  if (px >= 0.5 && px <= 0.85 && py >= 0.4 && py <= 0.7) return "nablaWatermark";
  if (px >= 0.25 && px <= 0.55 && py >= 0.55 && py <= 0.8) return "latentSpaceClusters";
  if (px >= 0.38 && px <= 0.67 && py >= 0.15 && py <= 0.32) return "gaussianCurves";
  if (px >= 0.78 && px <= 0.98 && py >= 0.2 && py <= 0.45) return "binaryTree";

  return "dotGrid";
}

export default function BackgroundCanvasOverlay() {
  const {
    showBackgroundOnly,
    setHoveredElement,
    setMousePosition,
  } = useBackgroundView();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setMousePosition({ x: clientX, y: clientY });
      const hit = hitTest(clientX, clientY, width, height);
      setHoveredElement(hit);
    },
    [setHoveredElement, setMousePosition]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredElement(null);
    setMousePosition(null);
  }, [setHoveredElement, setMousePosition]);

  if (!showBackgroundOnly) return null;

  return (
    <div
      className="fixed inset-0 z-10"
      style={{ pointerEvents: "auto" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    />
  );
}
