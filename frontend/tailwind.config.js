/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],

        heading: [
          "Poppins",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],

        body: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Poppins",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        64: "16rem", // 256px - sidebar expanded width
        16: "4rem", // 64px - sidebar collapsed width
      },
      margin: {
        "sidebar-expanded": "16rem",
        "sidebar-collapsed": "4rem",
      },
      transitionProperty: {
        sidebar: "margin-left, width",
      },
      transitionTimingFunction: {
        sidebar: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      colors: {
        primary: {
          DEFAULT: "#4EC6E5",
          50: "#F0FBFE",
          100: "#E0F6FD",
          200: "#BAEDFB",
          300: "#7FE0F8",
          400: "#4EC6E5",
          500: "#4EC6E5",
          600: "#2BA8CD",
          700: "#2293B5",
          800: "#1B7A95",
          900: "#15637A",
        },
      },
    },
  },
  plugins: [],
};
