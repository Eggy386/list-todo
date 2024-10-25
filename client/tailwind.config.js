/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          'background':'#1B2431',
          'conponents':'#273142'
        }
      }
    },
    width: {
      "width-full":"100%"
    },
    text: {
      "title":"text-2xl"
    }
  },
  plugins: [],
}