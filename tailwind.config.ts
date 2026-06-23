import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E2528",
        leaf: "#1F8A70",
        tomato: "#D94E35",
        cream: "#FFF7EC",
        line: "#E7E2D8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(30, 37, 40, 0.12)"
      },
      keyframes: {
        "toast-in": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        "toast-in": "toast-in 0.18s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
