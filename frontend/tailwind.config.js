/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,ts x,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      scrollbar: {
        hide: {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
  },
  plugins: [],
};