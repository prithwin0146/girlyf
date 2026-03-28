/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Jos Alukkas exact brand palette
        primary: {
          50: '#fef7f7',
          100: '#fde8e8',
          200: '#fbd0d1',
          300: '#f6a3a5',
          400: '#ef6b6e',
          500: '#e63e42',
          600: '#c92327',
          700: '#911b1e',   // JA dark red
          800: '#791719',
          900: '#571613',   // JA deep maroon (header/nav bg)
          950: '#320a0b',
        },
        gold: {
          50: '#fefbeb',
          100: '#fdf3c8',
          200: '#fbe88c',
          300: '#f9d750',
          400: '#f7c948',
          500: '#e9bb2c',   // JA primary gold
          600: '#cc9a17',
          700: '#a87414',
          800: '#8a5c18',
          900: '#734c1a',
          950: '#43280a',
        },
        brown: {
          50: '#fdf8f5',
          100: '#f9ece4',
          200: '#f4eeeb',   // JA trust strip background
          300: '#e5cfc2',
          400: '#d4ae97',
          500: '#b58f7a',   // JA borders
          600: '#98411d',   // JA CTA text
          700: '#834e32',   // JA sub-menu/nav
          800: '#6e4330',
          900: '#5c3a2c',
          950: '#311d15',
        },
        dark: '#1a1a2e',
      },
      fontFamily: {
        heading: ['"Century Gothic"', '"Poppins"', 'sans-serif'],
        body: ['"Century Gothic"', '"Poppins"', 'system-ui', 'sans-serif'],
        price: ['"Roboto"', 'sans-serif'],
        accent: ['"Poppins"', 'sans-serif'],
      },
      animation: {
        'slide-left': 'slideLeft 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(233, 187, 44, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(233, 187, 44, 0)' },
        },
      },
    },
  },
  plugins: [],
};
