/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#6b7ad9',
          500: '#4f5cc7',
          600: '#434bb5',
          700: '#3a3fa3',
          800: '#2f3491',
          900: '#232878',
        },
        accent: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d9dee8',
          300: '#b8c0d0',
          400: '#8a95af',
          500: '#5a6a85',
          600: '#3b4a66',
          700: '#2a3650',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(90, 106, 133, 0.06)',
        'card': '0 4px 20px rgba(90, 106, 133, 0.08)',
        'card-hover': '0 8px 30px rgba(90, 106, 133, 0.12)',
      },
    },
  },
  plugins: [],
}
