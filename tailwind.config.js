/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rialo: {
          bg: '#0A0A09', // Deep cyberpunk obsidian dark
          surface: '#121210', // Elevated surface
          card: '#181815', // Glass card layer
          'card-hover': '#20201C',
          border: '#282824', // Subtle 1px border
          'border-dark': '#383832',
          'border-light': 'rgba(255, 255, 255, 0.08)',
          text: '#F5F2EB', // Crisp warm white
          subtext: '#A39E93', // Muted secondary text
          muted: '#6B665C', // Subtle tertiary text
          accent: '#C85A27', // Signature Rialo Rust-Orange
          'accent-hover': '#E06830',
          'accent-glow': 'rgba(200, 90, 39, 0.25)',
          cyan: '#00E5FF', // High-tech cyan accent
          'cyan-glow': 'rgba(0, 229, 255, 0.2)',
          dark: '#050504',
          sand: '#EAE5D9', // Legacy sand
        },
        status: {
          online: '#2E7D52',
          'online-bright': '#34D399',
          degraded: '#C48227',
          offline: '#C43D3D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'marquee': 'marquee 25s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.96)' },
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
