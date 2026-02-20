/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soft: {
          cream: '#faf9f7',
          stone: '#f5f3f0',
          sand: '#ebe8e4',
          sage: '#e8ebe6',
          mist: '#e2e6ea',
          blush: '#f8f0ee',
        },
        priority: {
          low: '#7cb87c',
          medium: '#e6c35c',
          high: '#d97b7b',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.04)',
        'soft-lg': '0 8px 24px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
