"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type HoveredElement =
  | "neuralNetwork"
  | "transformerAttention"
  | "cnnFeatureMap"
  | "lossLandscape"
  | "fourierWaves"
  | "goldenSpiral"
  | "attentionHeatmap"
  | "nablaWatermark"
  | "dotGrid"
  | "latentSpaceClusters"
  | "gaussianCurves"
  | "activationFunctions"
  | "binaryTree"
  | null;

type BackgroundViewContextValue = {
  showBackgroundOnly: boolean;
  setShowBackgroundOnly: (v: boolean) => void;
  hoveredElement: HoveredElement;
  setHoveredElement: (el: HoveredElement) => void;
  mousePosition: { x: number; y: number } | null;
  setMousePosition: (p: { x: number; y: number } | null) => void;
};

const BackgroundViewContext = createContext<BackgroundViewContextValue | null>(
  null
);

export function BackgroundViewProvider({ children }: { children: ReactNode }) {
  const [showBackgroundOnly, setShowBackgroundOnly] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HoveredElement>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <BackgroundViewContext.Provider
      value={{
        showBackgroundOnly,
        setShowBackgroundOnly,
        hoveredElement,
        setHoveredElement,
        mousePosition,
        setMousePosition,
      }}
    >
      {children}
    </BackgroundViewContext.Provider>
  );
}

export function useBackgroundView() {
  const ctx = useContext(BackgroundViewContext);
  if (!ctx) {
    return {
      showBackgroundOnly: false,
      setShowBackgroundOnly: () => {},
      hoveredElement: null as HoveredElement,
      setHoveredElement: () => {},
      mousePosition: null as { x: number; y: number } | null,
      setMousePosition: () => {},
    };
  }
  return ctx;
}
