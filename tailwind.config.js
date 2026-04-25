module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rhr: ['"SF Sports Night"'],
        'rhr-ns': ['"SF Sports Night NS"'],
      },
      colors: {
        red: { rhr: '#4b5563' }, // gray-600
        aztechs: {
          grey: '#808080',
          orange: '#FF5F1F', // Toxic Orange
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
