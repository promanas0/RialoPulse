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
          bg: '#EAE5D9',
          surface: '#F4EFDF',
          card: '#FAF6EA',
          border: '#D9D2C1',
          'border-dark': '#C9C0AA',
          text: '#1C1C1A',
          subtext: '#5C584E',
          muted: '#8C8678',
          accent: '#C85A27', // Dot color in Rialo logo
          'accent-hover': '#A8481D',
          dark: '#141412',
          sand: '#DFD8C4',
        },
        status: {
          online: '#2E7D52',
          degraded: '#C48227',
          offline: '#C43D3D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
