export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        surfaceSoft: '#1f2937',
        accent: '#7c3aed',
        accentSoft: '#9333ea',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(124, 58, 237, 0.16)',
      },
    },
  },
  plugins: [],
};
