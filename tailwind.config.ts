import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          DEFAULT: "#FF9E80", // Muted Coral
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE5D9", // Peach
          foreground: "#5D4037",
        },
        accent: {
          DEFAULT: "#A8B5A2", // Sage Green
          foreground: "#FFFFFF",
        },
        warm: {
          cream: "#FFFDF7",
          peach: "#FFE5D9",
          white: "#FDFBF7",
          shadow: "rgba(180, 120, 80, 0.08)",
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
