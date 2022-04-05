module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
