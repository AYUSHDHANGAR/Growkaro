/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#070a16",
        panel: "rgba(12, 18, 34, 0.76)",
        cyanEdge: "#25d6ff",
        violetEdge: "#9b5cff",
        roseEdge: "#ff4ecd",
        limeSignal: "#74f7b6",
        amberSignal: "#f8c45d"
      },
      boxShadow: {
        glow: "0 0 38px rgba(37, 214, 255, 0.18)",
        violet: "0 0 46px rgba(155, 92, 255, 0.2)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

module.exports = config;
