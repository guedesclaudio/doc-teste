/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
  ],
  corePlugins: {
    // Desabilita o reset do Tailwind para evitar conflito com o CSS Infima do Docusaurus
    preflight: false,
  },
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        agriness: {
          50:  '#e8eeff',
          100: '#c5d4fa',
          200: '#9db6f6',
          300: '#7098f2',
          400: '#4d7dee',
          500: '#2a64e8',
          600: '#1a52d0',
          700: '#1544b8',
          800: '#0f36a0',
          900: '#353939',
        },
      },
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
