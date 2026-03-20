import type { Config } from 'tailwindcss'

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        colors: {
        primary: '#000000',
        accent: '#4f2d7f',
        blue: '#4b6cad',
        violet: '#72419d',
        darkBlue: '#2551a8',
        darkViolet: '#4f2d7f',
        }
    },
  plugins: [],
} satisfies Config