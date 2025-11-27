/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // Agregamos esta línea para asegurar que lea todo en la raíz por si acaso
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        vintage: ['"Rye"', 'serif'],
        slab: ['"Roboto Slab"', 'serif'],
      },
      colors: {
        gold: {
          light: '#fcf6ba',
          base: '#b38728',
          dark: '#aa771c',
          muted: '#8c6a20'
        },
        dark: {
          card: '#121212',
          input: '#1a1a1a'
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to bottom, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
        'dark-radial': 'radial-gradient(circle at top center, #222222 0%, #000000 80%)'
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(179, 135, 40, 0.3)',
      }
    },
  },
  plugins: [],
}