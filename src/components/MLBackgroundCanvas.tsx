"use client";

import { useEffect, useRef } from "react";
import { useBackgroundView } from "@/contexts/BackgroundViewContext";

const HOVER_BOOST = 1.85;

const CANVAS_ELEMENTS = {
  neuralNetwork: { enabled: true },
  transformerAttention: { enabled: true },
  cnnFeatureMap: { enabled: true },
  lossLandscape: { enabled: true },
  fourierWaves: { enabled: true },
  goldenSpiral: { enabled: true },
  attentionHeatmap: { enabled: true },
  nablaWatermark: { enabled: true },
  dotGrid: { enabled: true },
  latentSpaceClusters: { enabled: true },
  gaussianCurves: { enabled: true },
  activationFunctions: { enabled: true },
  binaryTree: { enabled: true },
} as const;

const NODE_LAYERS = [4, 6, 6, 5, 3] as const;
const PHI = (1 + Math.sqrt(5)) / 2;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

function quadraticPoint(p0: number, p1: number, p2: number, t: number): number {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export default function MLBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { hoveredElement, showBackgroundOnly } = useBackgroundView();
  const hoveredRef = useRef<typeof hoveredElement>(null);
  const showLabelsRef = useRef(showBackgroundOnly);

  useEffect(() => {
    hoveredRef.current = hoveredElement;
  }, [hoveredElement]);

  useEffect(() => {
    showLabelsRef.current = showBackgroundOnly;
  }, [showBackgroundOnly]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawLabel = (
      text: string,
      x: number,
      y: number,
      align: "left" | "right" = "left",
      isHovered = false
    ) => {
      if (!showLabelsRef.current) return;
      ctx.save();
      ctx.font = "9px JetBrains Mono, monospace";
      ctx.textAlign = align;
      ctx.textBaseline = "top";
      if (isHovered) {
        ctx.shadowColor = "rgba(99, 102, 241, 0.8)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
      }
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawDotGrid = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.dotGrid.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const step = 58;
      const majorEvery = 4;
      const pulse = 0.75 + 0.25 * Math.sin(t * (isHovered ? 0.0024 : 0.0016));
      ctx.save();
      let yi = 0;
      for (let y = 0; y <= height; y += step, yi += 1) {
        let xi = 0;
        for (let x = 0; x <= width; x += step, xi += 1) {
          const major = xi % majorEvery === 0 || yi % majorEvery === 0;
          const wave = 0.82 + 0.18 * Math.sin(t * 0.001 + (x + y) * 0.014);
          const alpha = Math.min(0.5, (major ? 0.045 : 0.026) * boost * pulse * wave);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(4)})`;
          ctx.beginPath();
          ctx.arc(x, y, major ? 1.2 : 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.016 * boost)})`;
      for (let x = 0; x <= width; x += step * majorEvery) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += step * majorEvery) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const probeX = ((t * (isHovered ? 0.055 : 0.032)) % (width + step)) - step * 0.5;
      const probeY = height * (0.2 + 0.6 * ((Math.sin(t * 0.0009) + 1) * 0.5));
      const snapX = Math.round(probeX / step) * step;
      const snapY = Math.round(probeY / step) * step;

      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.13 * boost)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(snapX - 12, snapY);
      ctx.lineTo(snapX + 12, snapY);
      ctx.moveTo(snapX, snapY - 12);
      ctx.lineTo(snapX, snapY + 12);
      ctx.stroke();

      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.26 * boost)})`;
      ctx.beginPath();
      ctx.arc(snapX, snapY, 2.1, 0, Math.PI * 2);
      ctx.fill();
      drawLabel("dot grid", 12, 12, "left", isHovered);
      ctx.restore();
    };

    const drawNeuralNetwork = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.neuralNetwork.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const left = width * 0.08;
      const top = height * 0.2;
      const columnSpan = Math.min(width * 0.34, 430);
      const colGap = columnSpan / (NODE_LAYERS.length - 1);
      const maxNodes = Math.max(...NODE_LAYERS);
      const rowGap = Math.min(56, Math.max(36, (height * 0.46) / Math.max(maxNodes - 1, 1)));

      const layerPoints = NODE_LAYERS.map((count, layerIndex) => {
        const x = left + layerIndex * colGap;
        const layerHeight = (count - 1) * rowGap;
        const yStart = top + (maxNodes * rowGap - layerHeight) * 0.5;
        return Array.from({ length: count }, (_, idx) => ({
          x,
          y: yStart + idx * rowGap,
        }));
      });

      const pulseSpeed = isHovered ? 0.00028 : 0.00012;
      const pulseProgress = ((t * pulseSpeed) % 1) * (NODE_LAYERS.length - 1);
      const waveSpeed = isHovered ? 0.008 : 0.004;

      for (let layer = 0; layer < layerPoints.length - 1; layer += 1) {
        const current = layerPoints[layer];
        const next = layerPoints[layer + 1];
        const pulseStrength = Math.max(0, 1 - Math.abs(layer - pulseProgress));
        current.forEach((a, i) => {
          next.forEach((b, j) => {
            const wave = 0.5 + 0.5 * Math.sin(t * waveSpeed + (i + j) * 0.65);
            const alpha = (0.14 + pulseStrength * (isHovered ? 0.35 : 0.2) * wave) * boost;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(1, alpha).toFixed(4)})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });
        });
      }

      ctx.save();
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.26 * boost)})`;
      ctx.lineWidth = 1.2;
      layerPoints.forEach((points) => {
        points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.stroke();
        });
      });
      drawLabel("neural net", left, top - 4, "left", isHovered);
      ctx.restore();
    };

    const drawTransformerAttention = (
      attnWeights: number[],
      targetWeights: number[],
      t: number,
      isHovered: boolean
    ) => {
      if (!CANVAS_ELEMENTS.transformerAttention.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const lerpFactor = isHovered ? 0.045 : 0.02;
      const boxSize = 14;
      const spacing = 28;
      const startX = width * 0.06;
      const y = height * 0.18;
      const numTokens = 8;

      const tokenCenters: { x: number; y: number }[] = [];
      for (let i = 0; i < numTokens; i++) {
        tokenCenters.push({ x: startX + i * spacing, y });
      }

      const pairs: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 6],
        [4, 7],
      ];

      for (let i = 0; i < attnWeights.length; i++) {
        attnWeights[i] = lerp(attnWeights[i], targetWeights[i], lerpFactor);
      }

      const flowPulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.005) : 1;
      const queryPhase = (t * (isHovered ? 0.0038 : 0.0022)) % numTokens;
      const queryIndex = Math.floor(queryPhase);
      const queryT = queryPhase - queryIndex;
      ctx.save();
      pairs.forEach(([i, j], idx) => {
        const a = tokenCenters[i];
        const b = tokenCenters[j];
        const midX = (a.x + b.x) / 2;
        const ctrlY = Math.min(a.y, b.y) - 25;
        const isQueryEdge = i === queryIndex;
        const edgePulse = 0.5 + 0.5 * Math.sin(t * 0.006 + idx * 0.6);
        const w = Math.min(
          0.5,
          (attnWeights[idx] ?? 0.1) * boost * flowPulse * edgePulse * (isQueryEdge ? 1.85 : 1)
        );
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX, ctrlY, b.x, b.y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${w.toFixed(4)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (isQueryEdge) {
          const travel = (queryT + idx * 0.08) % 1;
          const px = quadraticPoint(a.x, midX, b.x, travel);
          const py = quadraticPoint(a.y, ctrlY, b.y, travel);
          ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.34 * boost)})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      tokenCenters.forEach((c, i) => {
        const isQuery = i === queryIndex;
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, (isQuery ? 0.34 : 0.2) * boost)})`;
        ctx.strokeRect(c.x - boxSize / 2, c.y - boxSize / 2, boxSize, boxSize);
        if (isQuery) {
          ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.22 * boost)})`;
          ctx.fillRect(c.x - 3.2, c.y - 3.2, 6.4, 6.4);
        }
      });

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.18 * boost)})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      drawLabel("transformer attn", startX, y - boxSize / 2 - 18, "left", isHovered);
      ctx.restore();
    };

    const drawCnnFeatureMap = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.cnnFeatureMap.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const baseW = 130;
      const baseH = 85;
      const offset = 12;
      const floatSpeed = isHovered ? 0.0012 : 0.00055;
      const floatY = Math.sin(t * floatSpeed) * (isHovered ? 10 : 5);
      // Place CNN stack on the right at roughly 60% viewport width.
      const baseX = Math.min(width * 0.6, width - baseW - 120);
      const baseY = height * 0.56 + floatY;
      const pulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.002) : 1;
      const scanProgress = (t * (isHovered ? 0.00038 : 0.00022)) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.06 * boost * pulse)})`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i += 1) {
        ctx.strokeRect(baseX + i * offset, baseY - i * offset, baseW, baseH);
      }

      const kernelW = 28;
      const kernelH = 22;
      const kernelX = baseX + scanProgress * (baseW - kernelW);
      const kernelY = baseY + baseH * 0.5 - kernelH / 2 + Math.sin(t * 0.002) * 1.5;
      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.24 * boost)})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(kernelX, kernelY, kernelW, kernelH);

      for (let i = 1; i < 4; i += 1) {
        const shrink = 0.85 - i * 0.12;
        const projW = kernelW * Math.max(0.45, shrink);
        const projH = kernelH * Math.max(0.45, shrink);
        const projX = baseX + i * offset + scanProgress * (baseW - projW) * (1 - i * 0.08);
        const projY = baseY - i * offset + baseH * 0.5 - projH / 2;
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, (0.18 - i * 0.03) * boost)})`;
        ctx.strokeRect(projX, projY, projW, projH);
      }

      drawLabel("CNN stack", baseX + baseW + 34, baseY - 2, "right", isHovered);
      ctx.restore();
    };

    const drawLossLandscape = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.lossLandscape.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const cx = width * 0.78;
      const cy = height * 0.45;
      const valleyRx = 110;
      const valleyRy = 64;
      const rotation = -0.28;
      const pulse = 0.7 + 0.3 * Math.sin(t * (isHovered ? 0.003 : 0.0018));
      const ringCount = 7;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      for (let i = 0; i < ringCount; i++) {
        const u = 1 - i / (ringCount + 1);
        const ringPulse = 0.94 + 0.06 * Math.sin(t * 0.0012 + i * 0.8);
        const rx = valleyRx * u * ringPulse;
        const ry = valleyRy * u * (1.02 + 0.04 * Math.cos(t * 0.001 + i * 0.5));
        const alpha = (0.055 + i * 0.012) * boost;
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, alpha)})`;
        ctx.lineWidth = i === ringCount - 1 ? 1.1 : 0.9;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const toLossPoint = (s: number) => {
        const xNorm = lerp(-1.35, 0.04, s);
        const dampedOscillation =
          Math.sin((1 - s) * 9 + t * 0.0014) * Math.exp(-3.2 * s) * (1 - s);
        const yNorm = 0.42 * dampedOscillation + 0.1 * (1 - s);
        return {
          x: xNorm * valleyRx * 0.92,
          y: yNorm * valleyRy * 1.08,
        };
      };

      ctx.setLineDash([4, 7]);
      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.13 * boost * pulse)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const p = toLossPoint(u);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const sgdProgress = (t * (isHovered ? 0.00028 : 0.00016)) % 1;
      const momentumProgress = Math.min(1, sgdProgress * 1.16);
      const sgd = toLossPoint(sgdProgress);
      const momentum = toLossPoint(momentumProgress);
      const eta = 0.06 + 0.045 * (0.5 + 0.5 * Math.sin(t * 0.0012));
      const thetaT = toLossPoint(sgdProgress);
      const thetaPrev = toLossPoint(Math.max(0, sgdProgress - eta));
      const thetaNext = toLossPoint(Math.min(1, sgdProgress + eta));

      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.35 * boost)})`;
      ctx.beginPath();
      ctx.arc(sgd.x, sgd.y, 2.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.36 * boost)})`;
      ctx.beginPath();
      ctx.arc(momentum.x, momentum.y, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.3 * boost)})`;
      ctx.beginPath();
      ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Formula-driven descent depiction: gradient (uphill) and update step (downhill).
      const drawArrow = (
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        color: string,
        alpha: number
      ) => {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const head = 5;
        ctx.strokeStyle = `rgba(${color}, ${Math.min(0.5, alpha * boost)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - head * (ux * 0.7 + uy * 0.7), toY - head * (uy * 0.7 - ux * 0.7));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - head * (ux * 0.7 - uy * 0.7), toY - head * (uy * 0.7 + ux * 0.7));
        ctx.stroke();
      };

      drawArrow(thetaT.x, thetaT.y, thetaPrev.x, thetaPrev.y, "99, 102, 241", 0.24); // ∇L(θ_t)
      drawArrow(thetaT.x, thetaT.y, thetaNext.x, thetaNext.y, "59, 130, 246", 0.26); // -η∇L(θ_t)

      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.26 * boost)})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("θ ← θ - η∇L(θ)", -96, -84);
      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.23 * boost)})`;
      ctx.fillText("update step", thetaNext.x + 8, thetaNext.y + 1);
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.2 * boost)})`;
      ctx.fillText("gradient", thetaPrev.x + 8, thetaPrev.y - 1);

      ctx.restore();
      drawLabel("loss landscape", cx - 70, cy - 95, "left", isHovered);
    };

    const drawFourierWaves = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.fourierWaves.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const yBase = height * 0.86;
      const ampBoost = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.002) : 1;

      const waves = [
        { amp: 20, freq: 0.012, phaseSpeed: isHovered ? 0.0022 : 0.0011, a: 0.14 },
        { amp: 10, freq: 0.025, phaseSpeed: isHovered ? 0.0028 : 0.0014, a: 0.10 },
        { amp: 6, freq: 0.045, phaseSpeed: isHovered ? 0.0036 : 0.0018, a: 0.08 },
      ];

      waves.forEach((w, i) => {
        ctx.save();
        const [r, g, b] = i === 1 ? [99, 102, 241] : [59, 130, 246];
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.5, w.a * boost * ampBoost)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 4) {
          const y = yBase + Math.sin(x * w.freq + t * w.phaseSpeed) * w.amp;
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      const phase1 = isHovered ? 0.0022 : 0.0011;
      const phase2 = isHovered ? 0.0028 : 0.0014;
      const phase3 = isHovered ? 0.0036 : 0.0018;
      ctx.save();
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.18 * boost * ampBoost)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 4) {
        const y =
          yBase +
          Math.sin(x * 0.012 + t * phase1) * 20 +
          Math.sin(x * 0.025 + t * phase2) * 10 +
          Math.sin(x * 0.045 + t * phase3) * 6;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const cursorX = ((t * (isHovered ? 0.045 : 0.028)) % (width + 120)) - 60;
      const c1 = Math.sin(cursorX * 0.012 + t * phase1) * 20;
      const c2 = Math.sin(cursorX * 0.025 + t * phase2) * 10;
      const c3 = Math.sin(cursorX * 0.045 + t * phase3) * 6;
      const sumY = yBase + c1 + c2 + c3;

      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.08 * boost)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cursorX, yBase - 40);
      ctx.lineTo(cursorX, yBase + 40);
      ctx.stroke();

      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.24 * boost)})`;
      ctx.beginPath();
      ctx.arc(cursorX, yBase + c1, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.24 * boost)})`;
      ctx.beginPath();
      ctx.arc(cursorX, yBase + c1 + c2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.3 * boost)})`;
      ctx.beginPath();
      ctx.arc(cursorX, sumY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      drawLabel("fourier waves", 20, yBase - 35, "left", isHovered);
      ctx.restore();
    };

    const drawGoldenSpiral = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.goldenSpiral.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const cx = width * 0.08;
      const cy = height * 0.85;
      const b = Math.log(PHI) / (Math.PI / 2);
      const a = 8;
      const turns = 3.5;
      const steps = 120;
      const pulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.002) : 1;

      ctx.save();
      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.14 * boost * pulse)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * turns * Math.PI * 2;
        const r = a * Math.exp(b * theta);
        const x = cx + r * Math.cos(theta);
        const y = cy - r * Math.sin(theta);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      let rectW = 90;
      let rectH = rectW / PHI;
      let rx = cx - rectW / 2;
      const ry = cy - rectH / 2;
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.10 * boost * pulse)})`;
      for (let i = 0; i < 5; i++) {
        ctx.strokeRect(rx, ry, rectW, rectH);
        const nextW = rectH;
        const nextH = rectW - rectH;
        rx += rectW - nextW;
        rectW = nextW;
        rectH = nextH;
      }

      const thetaCursor = ((t * (isHovered ? 0.0018 : 0.0011)) % 1) * turns * Math.PI * 2;
      const rCursor = a * Math.exp(b * thetaCursor);
      const sx = cx + rCursor * Math.cos(thetaCursor);
      const sy = cy - rCursor * Math.sin(thetaCursor);
      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.28 * boost)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.1, 0, Math.PI * 2);
      ctx.fill();

      drawLabel("golden spiral", cx - 45, cy - 60, "left", isHovered);
      ctx.restore();
    };

    const attnHeatmapWeights = Array.from({ length: 6 }, (_, i) =>
      Array.from({ length: 6 }, (_, j) =>
        i === j ? randomInRange(0.08, 0.12) : randomInRange(0.01, 0.05)
      )
    );
    const attnHeatmapTargets = attnHeatmapWeights.map((row) => row.slice());
    let lastAttnHeatmapTransition = 0;

    const drawAttentionHeatmap = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.attentionHeatmap.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;

      const heatmapInterval = isHovered ? 1200 : 2500;
      if (t - lastAttnHeatmapTransition > heatmapInterval) {
        const numCells = 3 + Math.floor(Math.random() * 2);
        for (let k = 0; k < numCells; k++) {
          const i = Math.floor(Math.random() * 6);
          const j = Math.floor(Math.random() * 6);
          attnHeatmapTargets[i][j] =
            i === j ? randomInRange(0.08, 0.12) : randomInRange(0.01, 0.05);
        }
        lastAttnHeatmapTransition = t;
      }

      const heatmapLerp = isHovered ? 0.028 : 0.012;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          attnHeatmapWeights[i][j] +=
            (attnHeatmapTargets[i][j] - attnHeatmapWeights[i][j]) * heatmapLerp;
        }
      }

      const ox = width * 0.86;
      const oy = height * 0.08;
      const cellSize = 13;
      const gap = 2;
      const sweepPhase = (t * (isHovered ? 0.006 : 0.003)) % 6;
      const activeRow = Math.floor(sweepPhase);
      const activeCol = Math.floor((sweepPhase * 1.35) % 6);

      ctx.save();

      ctx.font = "8px JetBrains Mono, monospace";
      ctx.fillStyle = isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      if (isHovered) {
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 6;
      }
      ctx.fillText("attn scores", ox, oy - 10);
      drawLabel("attn heatmap", ox, oy - 22, "left", isHovered);

      const tickLen = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) {
        const pos = i * (cellSize + gap);
        ctx.beginPath();
        ctx.moveTo(ox + pos, oy);
        ctx.lineTo(ox + pos, oy + tickLen);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ox, oy + pos);
        ctx.lineTo(ox + tickLen, oy + pos);
        ctx.stroke();
      }

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const x = ox + j * (cellSize + gap);
          const y = oy + i * (cellSize + gap);
          const focusBoost = i === activeRow || j === activeCol ? 1.7 : 1;
          const w = Math.min(0.5, attnHeatmapWeights[i][j] * boost * focusBoost);
          ctx.fillStyle = `rgba(99, 102, 241, ${w})`;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.06 * boost)})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }

      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.14 * boost)})`;
      ctx.lineWidth = 1;
      const sweepY = oy + activeRow * (cellSize + gap) + cellSize / 2;
      const sweepX = ox + activeCol * (cellSize + gap) + cellSize / 2;
      ctx.beginPath();
      ctx.moveTo(ox - 6, sweepY);
      ctx.lineTo(ox + 6 * (cellSize + gap), sweepY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sweepX, oy - 6);
      ctx.lineTo(sweepX, oy + 6 * (cellSize + gap));
      ctx.stroke();

      ctx.restore();
    };

    const drawNablaWatermark = () => {
      // Intentionally left empty. Formula is now integrated into drawLossLandscape.
    };

    const clusterCenters = [
      { x: 0.3, y: 0.62 },
      { x: 0.38, y: 0.7 },
      { x: 0.45, y: 0.65 },
      { x: 0.35, y: 0.76 },
    ];
    const latentDots: { x: number; y: number; cluster: number }[] = [];
    const clusterCounts = [9, 9, 9, 8];
    let latentInitialized = false;

    const initLatentDots = () => {
      if (latentInitialized || width < 10) return;
      latentInitialized = true;
      for (let c = 0; c < 4; c++) {
        const cx = width * clusterCenters[c].x;
        const cy = height * clusterCenters[c].y;
        for (let i = 0; i < clusterCounts[c]; i++) {
          latentDots.push({
            x: cx + randomInRange(-40, 40),
            y: cy + randomInRange(-40, 40),
            cluster: c,
          });
        }
      }
    };

    const drawLatentSpaceClusters = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.latentSpaceClusters.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      initLatentDots();
      if (latentDots.length === 0) return;
      const dynamicCenters = clusterCenters.map((c, idx) => ({
        x: width * c.x + Math.sin(t * 0.0007 + idx * 1.4) * 6,
        y: height * c.y + Math.cos(t * 0.0008 + idx * 1.1) * 5,
      }));

      const driftSpeed = isHovered ? 0.002 : 0.001;
      const driftAmp = isHovered ? 0.8 : 0.3;
      latentDots.forEach((d, i) => {
        const cc = dynamicCenters[d.cluster];
        d.x += (cc.x - d.x) * 0.003 + Math.sin(t * driftSpeed + i) * driftAmp;
        d.y += (cc.y - d.y) * 0.003 + Math.sin(t * driftSpeed + i * 1.3) * driftAmp;
      });

      latentDots.forEach((a, i) => {
        latentDots.slice(i + 1).forEach((b) => {
          if (a.cluster !== b.cluster) return;
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < 55) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.09 * boost)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.save();
      latentDots.forEach((d) => {
        ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.26 * boost)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      dynamicCenters.forEach((c, idx) => {
        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.28 * boost)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.stroke();
        const next = dynamicCenters[(idx + 1) % dynamicCenters.length];
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.07 * boost)})`;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      });
      drawLabel("latent clusters", width * 0.25, height * 0.55, "left", isHovered);
      ctx.restore();
    };

    const drawGaussianCurves = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.gaussianCurves.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const xMin = width * 0.40;
      const xMax = width * 0.65;
      const baseline = height * 0.28;
      const pulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.002) : 1;

      ctx.save();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(xMin, baseline);
      ctx.lineTo(xMax, baseline);
      ctx.stroke();

      const m1 = width * 0.5 + Math.sin(t * 0.0011) * 12;
      const m2 = width * 0.48 + Math.sin(t * 0.0009 + 1.2) * 10;
      const m3 = width * 0.52 + Math.sin(t * 0.0008 + 2.4) * 14;
      const curves = [
        { mean: m1, sigma: 30, amp: 55, a: 0.22, color: [99, 102, 241] as const },
        { mean: m2, sigma: 55, amp: 35, a: 0.18, color: [59, 130, 246] as const },
        { mean: m3, sigma: 90, amp: 22, a: 0.14, color: [99, 102, 241] as const },
      ];

      curves.forEach(({ mean, sigma, amp, a, color }) => {
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(0.5, a * boost * pulse)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let px = xMin; px <= xMax; px += 3) {
          const y = baseline - amp * gaussian(px, mean, sigma);
          if (px === xMin) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
      });

      const thresholdX = lerp(xMin + 26, xMax - 20, (Math.sin(t * 0.0012) + 1) * 0.5);
      ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.18 * boost)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(thresholdX, baseline + 5);
      ctx.lineTo(thresholdX, baseline - 72);
      ctx.stroke();

      const peakY = baseline - 55 * gaussian(thresholdX, m1, 30);
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.28 * boost)})`;
      ctx.beginPath();
      ctx.arc(thresholdX, peakY, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.18 * boost)})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (isHovered) {
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.shadowBlur = 6;
      }
      ctx.fillText("P(x)", xMax, height * 0.24);
      drawLabel("gaussian curves", xMin, height * 0.20, "left", isHovered);
      ctx.restore();
    };

    const drawActivationFunctions = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.activationFunctions.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;
      const ox = width * 0.88;
      const oy = height * 0.65;
      const xRange = 95;
      const yRange = 65;
      const pulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.002) : 1;

      ctx.save();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(ox - xRange, oy);
      ctx.lineTo(ox + xRange, oy);
      ctx.moveTo(ox, oy - yRange);
      ctx.lineTo(ox, oy + yRange);
      ctx.stroke();

      const relu = (x: number) => (x < 0 ? 0 : x);
      const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
      const tanh = (x: number) => Math.tanh(x);

      const plot = (
        fn: (x: number) => number,
        color: string,
        yToCanvas: (y: number) => number
      ) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const xNorm = (i / 60) * 4 - 2;
          const yNorm = fn(xNorm);
          const x = ox + (xNorm / 2) * xRange;
          const y = yToCanvas(yNorm);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      plot(relu, `rgba(59, 130, 246, ${Math.min(0.5, 0.22 * boost * pulse)})`, (y) => oy - (y / 2) * yRange);
      plot(sigmoid, `rgba(99, 102, 241, ${Math.min(0.5, 0.20 * boost * pulse)})`, (y) => oy - (y - 0.5) * (yRange * 2));
      plot(tanh, `rgba(59, 130, 246, ${Math.min(0.5, 0.16 * boost * pulse)})`, (y) => oy - y * yRange);

      const xNorm = Math.sin(t * (isHovered ? 0.0022 : 0.0013)) * 2;
      const x = ox + (xNorm / 2) * xRange;
      const yRelu = oy - (relu(xNorm) / 2) * yRange;
      const ySigmoid = oy - (sigmoid(xNorm) - 0.5) * (yRange * 2);
      const yTanh = oy - tanh(xNorm) * yRange;

      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.09 * boost)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, oy - yRange);
      ctx.lineTo(x, oy + yRange);
      ctx.stroke();

      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.28 * boost)})`;
      ctx.beginPath();
      ctx.arc(x, yRelu, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(0.5, 0.28 * boost)})`;
      ctx.beginPath();
      ctx.arc(x, ySigmoid, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, 0.22 * boost)})`;
      ctx.beginPath();
      ctx.arc(x, yTanh, 1.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.5, 0.18 * boost)})`;
      ctx.textAlign = "left";
      ctx.fillText("relu", ox + xRange - 38, oy - yRange + 4);
      ctx.fillText("σ", ox + xRange - 16, oy + 4);
      ctx.fillText("tanh", ox + xRange - 38, oy + yRange - 4);
      drawLabel("activation fns", ox - xRange, oy - yRange - 4, "left", isHovered);
      ctx.restore();
    };

    const treeEdges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
    ];
    let activeNode = -1;
    let activeStart = 0;
    let lastTreeTransition = 0;

    const drawBinaryTree = (t: number, isHovered: boolean) => {
      if (!CANVAS_ELEMENTS.binaryTree.enabled) return;
      const boost = isHovered ? HOVER_BOOST : 1;

      const treeInterval = isHovered ? 1500 : 4000;
      if (t - lastTreeTransition > treeInterval) {
        activeNode = 3 + Math.floor(Math.random() * 4);
        activeStart = t;
        lastTreeTransition = t;
      }

      const rootX = width * 0.92;
      const rootY = height * 0.28;
      const l1Offset = 52;
      const l2Offset = 28;
      const levelGap = 42;
      const l1Left = { x: rootX - l1Offset, y: rootY + levelGap };
      const l1Right = { x: rootX + l1Offset, y: rootY + levelGap };

      const nodePos: { x: number; y: number }[] = [];
      nodePos.push({ x: rootX, y: rootY });
      nodePos.push({ x: l1Left.x, y: l1Left.y });
      nodePos.push({ x: l1Right.x, y: l1Right.y });
      nodePos.push({ x: l1Left.x - l2Offset, y: l1Left.y + levelGap });
      nodePos.push({ x: l1Left.x + l2Offset, y: l1Left.y + levelGap });
      nodePos.push({ x: l1Right.x - l2Offset, y: l1Right.y + levelGap });
      nodePos.push({ x: l1Right.x + l2Offset, y: l1Right.y + levelGap });

      ctx.save();

      const edgePulse = isHovered ? 0.5 + 0.5 * Math.sin(t * 0.003) : 1;
      const parent = [-1, 0, 0, 1, 1, 2, 2];
      const activePath: number[] = [];
      if (activeNode >= 0) {
        let current = activeNode;
        while (current >= 0) {
          activePath.unshift(current);
          current = parent[current];
        }
      }
      const edgeOrder = new Map<string, number>();
      for (let i = 1; i < activePath.length; i++) {
        edgeOrder.set(`${activePath[i - 1]}-${activePath[i]}`, i);
      }
      const traversalProgress = Math.min(1, Math.max(0, (t - activeStart) / (isHovered ? 900 : 1400)));
      const traversedEdges = Math.floor(traversalProgress * (activePath.length - 1 + 1e-6));
      const traversedNodes = Math.floor(traversalProgress * (activePath.length + 1e-6));

      treeEdges.forEach(([a, b]) => {
        const order = edgeOrder.get(`${a}-${b}`);
        const isTraversed = order !== undefined && order <= traversedEdges;
        const alpha = isTraversed ? 0.34 : 0.2;
        ctx.beginPath();
        ctx.moveTo(nodePos[a].x, nodePos[a].y);
        ctx.lineTo(nodePos[b].x, nodePos[b].y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(0.5, alpha * boost * edgePulse)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      nodePos.forEach((p, i) => {
        const pathIndex = activePath.indexOf(i);
        const isTraversed = pathIndex >= 0 && pathIndex <= traversedNodes;
        let alpha = isTraversed ? 0.44 : 0.26;
        if (activeNode === i) {
          const elapsed = t - activeStart;
          const progress = Math.min(1, elapsed / 1000);
          alpha =
            progress < 0.5
              ? lerp(alpha, 0.52, progress * 2)
              : lerp(0.52, alpha, (progress - 0.5) * 2);
        }
        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(0.5, alpha * boost)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.stroke();
      });

      drawLabel("binary tree", rootX + 90, rootY - 4, "right", isHovered);
      ctx.restore();
    };

    const attnWeights = Array.from({ length: 12 }, () => randomInRange(0.08, 0.22));
    const targetWeights = Array.from({ length: 12 }, () => randomInRange(0.08, 0.22));
    let lastAttnTransition = 0;

    const render = (t: number) => {
      if (t - lastAttnTransition > 3000) {
        for (let i = 0; i < targetWeights.length; i++) {
          targetWeights[i] = randomInRange(0.08, 0.22);
        }
        lastAttnTransition = t;
      }

      ctx.clearRect(0, 0, width, height);

      const h = hoveredRef.current;

      drawDotGrid(t, h === "dotGrid");
      drawNeuralNetwork(t, h === "neuralNetwork");
      drawTransformerAttention(attnWeights, targetWeights, t, h === "transformerAttention");
      drawCnnFeatureMap(t, h === "cnnFeatureMap");
      drawLossLandscape(t, h === "lossLandscape");
      drawFourierWaves(t, h === "fourierWaves");
      drawGoldenSpiral(t, h === "goldenSpiral");
      drawAttentionHeatmap(t, h === "attentionHeatmap");
      drawNablaWatermark();
      drawLatentSpaceClusters(t, h === "latentSpaceClusters");
      drawGaussianCurves(t, h === "gaussianCurves");
      drawActivationFunctions(t, h === "activationFunctions");
      drawBinaryTree(t, h === "binaryTree");

      rafId = window.requestAnimationFrame(render);
    };

    resize();
    rafId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
