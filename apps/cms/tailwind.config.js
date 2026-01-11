/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // CMS Color Palette - Dark Theme
                cms: {
                    bg: {
                        primary: '#0a0a0a',
                        secondary: '#141414',
                        card: '#1a1a1a',
                        hover: '#222222',
                    },
                    text: {
                        primary: '#ffffff',
                        secondary: '#888888',
                        muted: '#555555',
                    },
                    accent: {
                        DEFAULT: '#d4af37',
                        hover: '#e5c453',
                        muted: '#b8982f',
                    },
                    success: '#22c55e',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    border: '#2a2a2a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'spin-slow': 'spin 2s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
