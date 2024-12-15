/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        bgcolor: "var(--bgcolor)",
        customRed: "rgb(227, 52, 47)",
        lighterDark: "#27292F",
        theme: {
          DEFAULT: "var(--color-theme)",
          text: "var(--color-text)",
          background: "var(--color-background)",
          hover: "var(--color-hover)",
        },
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};
