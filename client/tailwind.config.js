/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors from design rules
        primary: {
          DEFAULT: '#F97316', // Primary Orange
          hover: '#EA580C', // Slightly darker for hover states
        },
        accent: {
          DEFAULT: '#22C55E', // Accent Green
        },
        neutral: {
          light: '#F9FAFB', // Neutral Light Gray
          DEFAULT: '#F9FAFB',
        },
        text: {
          primary: '#1F2937', // Dark Gray
          secondary: '#4B5563', // Medium Gray
        },
        status: {
          error: '#EF4444', // Error Red
          success: '#10B981', // Success Green
          warning: '#FBBF24', // Warning Yellow
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
      },
      borderRadius: {
        DEFAULT: '6px',
        'card': '8px',
      },
    },
  },
  plugins: [],
}
