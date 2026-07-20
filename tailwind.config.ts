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
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
