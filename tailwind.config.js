/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a2b4a',
        cream: '#f5f1e8',
        orange: '#ff6b35',
        blue: '#4a90e2',
        'dark-navy': '#0f1829',
        'dark-orange': '#e55a2b',
        'dark-blue': '#3a7bc8',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subsection': ['1.5rem', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': '6rem',
      },
      backgroundImage: {
        'diagonal-pattern': `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 40px,
          #ff6b35 40px,
          #ff6b35 41px
        )`,
      },
    },
  },
  plugins: [],
} 