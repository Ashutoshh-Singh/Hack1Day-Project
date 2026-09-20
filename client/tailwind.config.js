/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071524',
          900: '#0F243A',
          850: '#132E4A',
          800: '#17395C',
          700: '#1E4B7A',
          600: '#255E99',
          500: '#3178C6',
        },
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DDFF',
          300: '#7CC0FF',
          400: '#389EFF',
          500: '#0D7EEF',
          600: '#0062CC',
          700: '#004EA6',
          800: '#054388',
          900: '#0A3A70',
        },
        surface: {
          base: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 36, 58, 0.06), 0 1px 2px 0 rgba(15, 36, 58, 0.04)',
        'card': '0 4px 6px -1px rgba(15, 36, 58, 0.07), 0 2px 4px -1px rgba(15, 36, 58, 0.04)',
        'elevated': '0 12px 24px -4px rgba(15, 36, 58, 0.10), 0 4px 6px -2px rgba(15, 36, 58, 0.04)',
        'floating': '0 20px 30px -6px rgba(15, 36, 58, 0.16), 0 8px 10px -4px rgba(15, 36, 58, 0.08)',
      }
    },
  },
  plugins: [],
}
