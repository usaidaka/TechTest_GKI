module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster"],
        inter: ["Inter"],
        poppins: ["Poppins"],
        josefin: ["'Josefin Sans'"],
        mouse: ["Mouse Memoirs"],
        libre: ["Libre Baskerville"],
      },
      boxShadow: {
        "card-1": "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
        "3xl": "0px 0px 30px 0px rgba(0, 0, 0, 0.3)",
      },
      dropShadow: {
        "3xl": "0px 0px 30px 0px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "spin-slow": "spin 25s linear infinite",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
