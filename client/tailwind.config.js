/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ["Poppins", "sans-serif"],
            },
            colors: {
                brand: {
                    50: "#ecfeff",
                    100: "#cffafe",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                },
            },
            boxShadow: {
                glass: "0 20px 45px -25px rgba(15, 23, 42, 0.45)",
            },
        },
    },
    plugins: [],
};
