import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#EFE6D3",
        dune: "#E3D6BC",
        ink: "#1E1913",
        cardon: "#47573C",
        clay: "#C3491B",
        ochre: "#D9A13B",
        haze: "#8A7B64",
        night: "#16120E",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        // labels use the text face since 2026-10-10 (globals.css --mono)
        mono: ["var(--font-text)"],
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
