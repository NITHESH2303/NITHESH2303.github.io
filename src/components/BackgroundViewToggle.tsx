"use client";

import { useBackgroundView } from "@/contexts/BackgroundViewContext";
import { motion } from "framer-motion";

export default function BackgroundViewToggle() {
  const { showBackgroundOnly, setShowBackgroundOnly } = useBackgroundView();

  return (
    <motion.button
      type="button"
      onClick={() => setShowBackgroundOnly(!showBackgroundOnly)}
      className="fixed bottom-6 left-6 z-20 rounded-lg border border-teal-500/40 bg-[#060d1a]/90 px-3 py-2 text-xs font-medium text-teal-400 backdrop-blur-sm transition-colors hover:border-teal-500/60 hover:bg-teal-500/10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={showBackgroundOnly ? "Show portfolio content" : "View background only"}
    >
      {showBackgroundOnly ? "Show content" : "View background"}
    </motion.button>
  );
}
