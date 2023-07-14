/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'tall': { 'raw': '(max-height: 780px)' },
        // => @media (min-height: 800px) { ... }
      }
    },
  },
  plugins: [],
}

