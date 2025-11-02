/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'blink-red': 'blink-red 1s ease-in-out infinite',
      },
      keyframes: {
        'blink-red': {
          '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
