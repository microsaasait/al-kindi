/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './index.tsx', './App.tsx', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ak: {
          ink: '#14432C',
          green: '#1E7A4B',
          greenDark: '#14603A',
          leaf: '#6BBF59',
          gold: '#F0B429',
          orange: '#EE7B1C',
          sky: '#4D9FFF',
          cream: '#FFF8EC',
          sand: '#FDF1DC',
          text: '#3F5147',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
