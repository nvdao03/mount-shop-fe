/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5'
      },
      screens: {
        'custom-sm': '500px'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
