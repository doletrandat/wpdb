// js/tailwind.config.js

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Segoe UI"', '"Helvetica Neue"', 'sans-serif'],
                light: ['"Segoe UI Light"', '"Segoe UI"', 'sans-serif'],
                semilight: ['"Segoe UI Semilight"', '"Segoe UI"', 'sans-serif'],
                mono: ['"Consolas"', '"Monaco"', 'monospace'],
            },
            colors: {
                wp: {
                    blue: '#2d89ef',
                    dark: '#1d1d1d',
                    gray: '#999999',
                    lightgray: '#f0f0f0',
                    red: '#ff0000ff',
                }
            },
            transitionTimingFunction: {
                'metro': 'cubic-bezier(0.2, 0.9, 0.2, 1)',
            },
            keyframes: {
                pageEnter: {
                    '0%': { transform: 'translateX(22px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pageEnterTurn: {
                    '0%': { transform: 'translateX(28px) scale(0.99)', opacity: '0' },
                    '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
                },
                tileEnter: {
                    '0%': { transform: 'translateY(18px) scale(0.985)', opacity: '0' },
                    '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                },
                contentSlide: {
                    '0%': { transform: 'translateY(16px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                listCascade: {
                    '0%': { transform: 'translateX(14px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pivotEnter: {
                    '0%': { transform: 'translateX(18px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                toastIn: {
                    '0%': { transform: 'translateY(14px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                toastOut: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(14px)', opacity: '0' },
                }
            },
            animation: {
                'page-enter': 'pageEnter 0.62s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'page-enter-turn': 'pageEnterTurn 0.68s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'tile-enter': 'tileEnter 0.58s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'content-slide': 'contentSlide 0.54s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'list-cascade': 'listCascade 0.46s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'pivot-enter': 'pivotEnter 0.42s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'toast-in': 'toastIn 0.28s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
                'toast-out': 'toastOut 0.28s cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
            }
        }
    }
}
