/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#007D79",
      secondary: "#CDE2D5",
      white: "#FFF6ED",
      black: "#402e32",
    },
    extend: {
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(18rem, 1fr))",
      },
    },
  },
  plugins: [],
}
