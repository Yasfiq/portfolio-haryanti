/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
                    50: '#fef5ee',
                    100: '#fce9d9',
                    200: '#f9cfb2',
                    300: '#f5ad80',
                    400: '#f37430',
                    500: '#ef5a1f',
                    600: '#e04014',
                    700: '#ba2e13',
                    800: '#942717',
                    900: '#782316',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
                    50: '#f9f6f5',
                    100: '#f2ebe9',
                    200: '#e7dad6',
                    300: '#d5c0b9',
                    400: '#bea094',
                    500: '#a78077',
                    600: '#8f6b61',
                    700: '#754c45',
                    800: '#63453f',
                    900: '#553d39',
                },
                tertiary: {
                    DEFAULT: '#402e32',
                    50: '#f7f4f5',
                    100: '#efe8e9',
                    200: '#dfd1d4',
                    300: '#c8b0b5',
                    400: '#ad898f',
                    500: '#956c73',
                    600: '#7d565c',
                    700: '#68464c',
                    800: '#573c41',
                    900: '#402e32',
                },
                foreground: '#1a1a1a',
                muted: {
                    DEFAULT: '#6b5b57',
                    foreground: '#a89490',
                },
                background: '#ffffff',
            },
            fontFamily: {
                sans: ['Geist Sans', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.625rem', { lineHeight: '1' }],      // 10px
                'sm': ['0.875rem', { lineHeight: '1.25' }],   // 14px
                'base': ['1rem', { lineHeight: '1.5' }],       // 16px
                'lg': ['1.625rem', { lineHeight: '1.3' }],     // 26px (16 × 1.618)
                'xl': ['2.625rem', { lineHeight: '1.2' }],     // 42px (26 × 1.618)
                '2xl': ['4.25rem', { lineHeight: '1.1' }],     // 68px (42 × 1.618)
                '3xl': ['6.875rem', { lineHeight: '1' }],      // 110px (68 × 1.618)
            },
            spacing: {
                'golden-1': '0.25rem',   // 4px
                'golden-2': '0.375rem',  // 6px
                'golden-3': '0.625rem',  // 10px
                'golden-4': '1rem',      // 16px
                'golden-5': '1.625rem',  // 26px
                'golden-6': '2.625rem',  // 42px
                'golden-7': '4.25rem',   // 68px
                'golden-8': '6.875rem',  // 110px
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-out': 'fadeOut 0.2s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
