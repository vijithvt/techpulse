/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#1F2933",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(240 4.9% 83.9%)",
        background: "#0B0F14",
        foreground: "#E6EDF3",
        primary: {
          DEFAULT: "#E6EDF3",
          foreground: "#0B0F14",
        },
        secondary: {
          DEFAULT: "#11161C",
          foreground: "#9AA4AF",
        },
        accent: {
          DEFAULT: "#3B82F6",
          foreground: "#E6EDF3",
        },
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#9AA4AF",
        },
        card: {
          DEFAULT: "#11161C",
          foreground: "#E6EDF3",
        },
        "card-hover": "#161B22",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "6px",
      },
    },
  },
  plugins: [],
}
