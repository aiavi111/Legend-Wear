/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F3F0EA',      // warm off-white — main background
        'bone-2': '#EAE6DE',  // slightly deeper — image placeholders / cards
        ink: '#131210',       // warm near-black — typography
        smoke: '#6E6A62',     // warm neutral gray — secondary text
        line: '#DCD6CB',      // hairline borders
        ember: '#B04A2C',     // accent — pulled from drop graphics (use sparingly)
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', 'Didot', '"Playfair Display"', 'serif'],
        sans: ['Archivo', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      letterSpacing: {
        mega: '0.35em',
      },
    },
  },
  plugins: [],
};
