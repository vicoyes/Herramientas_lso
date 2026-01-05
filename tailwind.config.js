/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a2461',
        secondary: '#3b82f6',
        'accent-red': '#ef4444',
        'accent-green': '#22c55e',
        'accent-yellow': '#eab308',
        'background-light': '#f3f4f6',
        'background-dark': '#111621',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }
    }
  },
  plugins: [],
}
