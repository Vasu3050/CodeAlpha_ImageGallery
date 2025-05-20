/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F9FAFB',
          card: '#FFFFFF',
          navbar: '#E5E7EB',         // Light grayish background for navbar
          textPrimary: '#333333',
          textSecondary: '#666666',
          border: '#E0E0E0',
          accent: '#3B82F6',
          overlayHover: 'rgba(59,130,246,0.1)',
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          navbar: '#1A1A1A',         // Slightly different from main bg for contrast
          textPrimary: '#E0E0E0',
          textSecondary: '#AAAAAA',
          border: '#333333',
          accent: '#3B82F6',
          overlayHover: 'rgba(59,130,246,0.3)',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
