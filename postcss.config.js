/** @type {import('tailwindcss').Config} */
export default {
  // Aquí le indicas a Tailwind que revise el index.html y todos los archivos 
  // dentro de la carpeta 'src' que terminen en .js o .jsx
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí podrías agregar colores personalizados si quisieras más adelante
    },
  },
  plugins: [],
}
