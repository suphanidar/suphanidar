
/** @type {import(‘tailwindcss’).Config} */
module.exports = {
content: [
“./src/**/*.{js,jsx,ts,tsx}”,
“./public/index.html”,
],
theme: {
extend: {
fontFamily: {
‘thai’: [‘Sarabun’, ‘Inter’, ‘sans-serif’],
‘sans’: [‘Inter’, ‘system-ui’, ‘sans-serif’],
},
colors: {
primary: {
50: ‘#f0fdf4’,
100: ‘#dcfce7’,
200: ‘#bbf7d0’,
300: ‘#86efac’,
400: ‘#4ade80’,
500: ‘#22c55e’,
600: ‘#16a34a’,
700: ‘#15803d’,
800: ‘#166534’,
900: ‘#14532d’,
},
secondary: {
50: ‘#eff6ff’,
100: ‘#dbeafe’,
200: ‘#bfdbfe’,
300: ‘#93c5fd’,
400: ‘#60a5fa’,
500: ‘#3b82f6’,
600: ‘#2563eb’,
700: ‘#1d4ed8’,
800: ‘#1e40af’,
900: ‘#1e3a8a’,
},
waste: {
recyclable: ‘#22c55e’,
compost: ‘#f59e0b’,
hazardous: ‘#ef4444’,
nonRecyclable: ‘#6b7280’,
special: ‘#8b5cf6’,
general: ‘#374151’,
}
},
animation: {
‘bounce-in’: ‘bounce-in 0.5s ease-out’,
‘slide-up’: ‘slide-up 0.4s ease-out’,
‘slide-down’: ‘slide-down 0.4s ease-out’,
‘fade-in’: ‘fade-in 0.3s ease-out’,
‘zoom-in’: ‘zoom-in 0.3s ease-out’,
‘pulse-ring’: ‘pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite’,
‘scanner’: ‘scanner 2s linear infinite’,
‘score-count’: ‘score-count 0.6s ease-out’,
‘level-glow’: ‘level-glow 2s ease-in-out infinite alternate’,
},
keyframes: {
‘bounce-in’: {
‘0%’: { opacity: ‘0’, transform: ‘scale(0.8) translateY(20px)’ },
‘60%’: { opacity: ‘1’, transform: ‘scale(1.05) translateY(-5px)’ },
‘100%’: { opacity: ‘1’, transform: ‘scale(1) translateY(0)’ },
},
‘slide-up’: {
‘0%’: { opacity: ‘0’, transform: ‘translateY(20px)’ },
‘100%’: { opacity: ‘1’, transform: ‘translateY(0)’ },
},
‘slide-down’: {
‘0%’: { opacity: ‘0’, transform: ‘translateY(-20px)’ },
‘100%’: { opacity: ‘1’, transform: ‘translateY(0)’ },
},
‘fade-in’: {
‘0%’: { opacity: ‘0’ },
‘100%’: { opacity: ‘1’ },
},
‘zoom-in’: {
‘0%’: { opacity: ‘0’, transform: ‘scale(0.9)’ },
‘100%’: { opacity: ‘1’, transform: ‘scale(1)’ },
},
‘pulse-ring’: {
‘0%’: { transform: ‘scale(0.33)’, opacity: ‘1’ },
‘40%, 50%’: { opacity: ‘1’ },
‘100%’: { opacity: ‘0’, transform: ‘scale(1.2)’ },
},
‘scanner’: {
‘0%’: { transform: ‘translateX(-100%)’ },
‘100%’: { transform: ‘translateX(100%)’ },
},
‘score-count’: {
‘0%’: { transform: ‘scale(0.8)’, opacity: ‘0’, color: ‘#10b981’ },
‘50%’: { transform: ‘scale(1.2)’, color: ‘#059669’ },
‘100%’: { transform: ‘scale(1)’, opacity: ‘1’ },
},
‘level-glow’: {
‘0%’: { boxShadow: ‘0 4px 15px rgba(245, 158, 11, 0.3)’ },
‘100%’: { boxShadow: ‘0 6px 20px rgba(245, 158, 11, 0.5)’ },
},
},
backdropBlur: {
xs: ‘2px’,
},
spacing: {
‘18’: ‘4.5rem’,
‘88’: ‘22rem’,
‘128’: ‘32rem’,
},
maxWidth: {
‘8xl’: ‘88rem’,
‘9xl’: ‘96rem’,
},
screens: {
‘xs’: ‘475px’,
},
},
},
plugins: [
require(’@tailwindcss/forms’)({
strategy: ‘class’,
}),
require(’@tailwindcss/aspect-ratio’),
require(’@tailwindcss/typography’),
],
}