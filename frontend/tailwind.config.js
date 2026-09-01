/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        editorial: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        soul: {
          crimson: '#801323',
          'crimson-hover': '#9E1B32',
          'crimson-dark': '#570A16',
          gold: '#C5A059',
          'gold-light': '#FCE6BE',
          'gold-active': '#FBE2B5',
          'gold-border': '#E8C47F',
          obsidian: '#08101E',
          'obsidian-card': '#091120',
          'obsidian-border': '#142036',
          'obsidian-hover': '#111D33',
          canvas: '#FAFBFD',
          muted: '#64748B',
          light: '#94A3B8',
        }
      },
      boxShadow: {
        'soul-sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'soul-md': '0 6px 18px rgba(0, 0, 0, 0.08)',
        'soul-lg': '0 20px 50px rgba(0, 0, 0, 0.15)',
        'soul-gold': '0 4px 15px rgba(197, 160, 89, 0.35)',
        'soul-crimson': '0 4px 15px rgba(128, 19, 35, 0.35)',
        'soul-dark': '0 18px 45px rgba(9, 17, 32, 0.35)',
      },
      borderRadius: {
        'pill': '9999px',
      },
      keyframes: {
        floatSubtle: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        lineScan: {
          '0%': { transform: 'translateX(-40%)' },
          '100%': { transform: 'translateX(60%)' },
        }
      },
      animation: {
        'float-subtle': 'floatSubtle 3s ease-in-out infinite alternate',
        'pulse-gentle': 'pulseGentle 4s ease-in-out infinite',
        'line-scan': 'lineScan 2.5s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}
