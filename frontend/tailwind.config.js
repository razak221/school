/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        primary: '#000a1e',
        'primary-container': '#002147',
        'on-primary-container': '#708ab5',
        secondary: '#0c6780',
        'secondary-container': '#9ae1ff',
        tactical: '#FF8C00',
        'tactical-orange': '#FF8C00',
        'tactical-amber': '#F59E0B',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-low': '#f2f4f6',
        'surface-container-lowest': '#ffffff',
        'text-main': '#1E293B',
        'text-muted': '#64748B',
        'outline-variant': '#c4c6cf',
        'success-green': '#22C55E',
        'error-red': '#EF4444',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        bento: '0 4px 20px -2px rgba(0, 33, 71, 0.06), 0 2px 6px -1px rgba(0, 33, 71, 0.04)',
        'bento-hover': '0 10px 25px -3px rgba(0, 33, 71, 0.1), 0 4px 10px -2px rgba(0, 33, 71, 0.06)',
      },
      borderRadius: {
        bento: '1rem',
      },
    },
  },
  plugins: [],
};
