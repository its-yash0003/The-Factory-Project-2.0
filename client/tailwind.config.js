/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        accent: '#e94560',
        background: '#f8f8f8',
        surface: '#ffffff',
        secondary: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
