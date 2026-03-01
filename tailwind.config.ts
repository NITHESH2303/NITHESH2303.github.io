import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: "#2dd4bf",
        surface: "#0e1420",
        border: "rgba(255,255,255,0.08)",
        "text-muted": "rgba(255,255,255,0.45)",
      },
    },
  },
};

export default config;
