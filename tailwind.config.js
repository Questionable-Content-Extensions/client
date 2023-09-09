/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            sans: ['Source Sans Pro', 'sans-serif'],
        },
        extend: {
            colors: {
                'qc-header': '#124766',
                'qc-header-second': '#1A6591',
                'qc-background': '#7297ac',
                'qc-link': '#2ba6cb',
                'qc-link-hover': '#258faf',
            },
            transitionProperty: {
                filter: 'filter',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
}
