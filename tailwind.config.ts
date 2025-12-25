import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(239, 68, 68, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
