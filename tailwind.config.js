/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Healthcare Navy & Dark Theme
        navy: {
          950: '#070c18', // Deepest background
          900: '#0b1329', // Main dark canvas
          850: '#0f1a36', // Card surface dark
          800: '#152244', // Card border / elevated surface
          700: '#1d2f5d', // Active/hover state
          600: '#2c437d',
        },
        // Cyan / Electric-blue accents
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        electric: {
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
        },
        // Clinical status colors
        clinical: {
          normal: '#10b981',    // Green (Normal)
          'normal-bg': '#ecfdf5',
          'normal-dark': '#065f46',
          warning: '#f59e0b',   // Yellow/Amber (Warning)
          'warning-bg': '#fffbeb',
          'warning-dark': '#92400e',
          danger: '#ef4444',    // Red (High Risk / Critical)
          'danger-bg': '#fef2f2',
          'danger-dark': '#991b1b',
          info: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'glow-rose': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.4s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
