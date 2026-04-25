/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ipl: {
          blue: '#004BA0',
          gold: '#D4A843',
          dark: '#0A1628',
          navy: '#0D1B2A',
          surface: '#1B2838',
          card: '#162231',
          border: '#2A3A4E',
        },
        team: {
          csk: { primary: '#FCCA06', secondary: '#1C1C1C' },
          mi: { primary: '#004BA0', secondary: '#D4A843' },
          rcb: { primary: '#D4213D', secondary: '#000000' },
          kkr: { primary: '#3A225D', secondary: '#B3A34A' },
          dc: { primary: '#004C93', secondary: '#EF1C25' },
          pbks: { primary: '#DD1F2D', secondary: '#EDD59E' },
          rr: { primary: '#EA1A85', secondary: '#1C1C7E' },
          srh: { primary: '#F26522', secondary: '#FCEA09' },
          lsg: { primary: '#A72056', secondary: '#1D4D2C' },
          gt: { primary: '#1B2133', secondary: '#F9C8D5' },
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'score-flash': 'scoreFlash 0.6s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scoreFlash: {
          '0%': { backgroundColor: 'rgba(212, 168, 67, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
};
