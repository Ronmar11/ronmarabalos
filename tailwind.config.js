/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Mobile-first re-expression of the original max-width media queries
    // (390 / 413 / 450 / 500 / 700 / 1034) as min-width breakpoints.
    screens: {
      tiny: '391px',
      xs: '414px',
      mob: '451px',
      sm: '501px',
      md: '701px',
      lg: '1035px',
      xl: '1280px',
    },
    extend: {
      colors: {
        // --prime-color / --black-color / --white-color / --gray-color from the original :root
        prime: '#2FB297',
        ink: '#000000',
        paper: '#FFFFFF',
        slate: '#35404E',
        // Repeated one-off values from the original stylesheet
        muted: 'rgba(50, 48, 48, 0.553)',
        'muted-dark': 'rgba(255, 255, 255, 0.6)',
        neu: '#e8e8e8',
        'neu-shadow': '#c5c5c5',
        'neu-text': '#090909',
        'accent-light': '#00e93a',
        'accent-dark': '#3fe9ff',
        'blob-light': '#ffb53f',
        'chat-bot': '#e4e4e4',
        'chat-user': '#cac8c8',
        'chat-border': '#d3d3d3',
        'chat-border-focus': '#858383e5',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      transitionDuration: {
        // --transition / --transition2
        DEFAULT: '300ms',
        600: '600ms',
      },
      boxShadow: {
        neu: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
        'neu-inset': 'inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff',
        'neu-dark': '6px 6px 12px #111, -6px -6px 12px #333',
        'neu-dark-inset': 'inset 4px 4px 12px #111, inset -4px -4px 12px #333',
        nav: 'inset 0 0 25px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.25)',
        card: '0 0px 8px 0 #0d2626',
        'card-hover': '0 0px 0px 0 #0d2626',
        profile: '0 8px 32px 0 #0d2626',
        chat: '0 0 128px 0 rgb(0 0 0 / 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        // 60Q == 15mm == ~56.7px in the original CSS
        q60: '56.7px',
      },
      keyframes: {
        dotPulse: {
          '0%, 44%': { transform: 'translateY(0)' },
          '28%': { opacity: '0.4', transform: 'translateY(-4px)' },
          '44%': { opacity: '0.4', transform: 'translateY(-4px)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        dotPulse: 'dotPulse 1.8s ease-in-out infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};
