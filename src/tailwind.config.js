/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // <- necessário para ativar Tailwind nos componentes React
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
