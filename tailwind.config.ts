import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#123524',
          dark: '#0a1c13',
          light: '#226b48',
          text: { dark: '#333D4A', light: '#FFFFFF' },
          border: '#DDE1E7',
          sky: '#0ea5e9',
          ink: '#003366',
        },
        aqi: {
          good: '#22c55e',
          moderate: '#facc15',
          usg: '#f97316',
          unhealthy: '#ef4444',
          very: '#a855f7',
          hazardous: '#7e22ce',
        },
        city: {
          lahore: '#D94743',
          karachi: '#F49F0A',
          peshawar: '#5E3C99',
          islamabad: '#3153A5',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui'],
        // mont: ['var(--font-mont)', 'ui-sans-serif'],
        // mono: ['var(--font-mono)', 'ui-monospace'],
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'translate(-50%,-50%) scale(0.5)', opacity: '1' },
          '100%': { transform: 'translate(-50%,-50%) scale(2)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .6s ease-out both',
        marquee: 'marquee 17s linear infinite',
        pulseRing: 'pulseRing 2.5s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
