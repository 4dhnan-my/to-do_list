/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#101828',
        mist: '#f6f8fb',
        ember: '#ff7a59',
        jade: '#14b8a6',
        royal: '#5b5bd6',
        grape: '#9f7aea'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(91, 91, 214, 0.22)',
        soft: '0 18px 50px rgba(16, 24, 40, 0.12)'
      }
    }
  },
  plugins: []
};
