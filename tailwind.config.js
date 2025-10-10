/** @type {import('tailwindcss').Config} */
export const content = ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"];
export const theme = {
  screens: {
     'xsm': '20rem', // 320px
    'xs': '25rem',  // 400px
    'sm': '40rem',  // 640px
    'md': '48rem',  // 768px
    'lg': '64rem',  // 1024px
    'xl': '80rem',  // 1280px
    '2xl': '96rem', // 1536px
    '3xl': '108rem', // 1728px
    '4xl': '120rem', // 1920px
  },
  extend: {
    colors: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.145 0 0)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.145 0 0)',
      primary: 'oklch(0.205 0 0)',
      'primary-foreground': 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      'secondary-foreground': 'oklch(0.205 0 0)',
      muted: 'oklch(0.97 0 0)',
      'muted-foreground': 'oklch(0.556 0 0)',
      accent: 'oklch(0.97 0 0)',
      'accent-foreground': 'oklch(0.205 0 0)',
      destructive: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.922 0 0)',
      input: 'oklch(0.922 0 0)',
      ring: 'oklch(0.708 0 0)',
      // Chart colors
      'chart-1': 'oklch(0.646 0.222 41.116)',
      'chart-2': 'oklch(0.6 0.118 184.704)',
      'chart-3': 'oklch(0.398 0.07 227.392)',
      'chart-4': 'oklch(0.828 0.189 84.429)',
      'chart-5': 'oklch(0.769 0.188 70.08)',
      // Sidebar colors
      sidebar: 'oklch(0.985 0 0)',
      'sidebar-foreground': 'oklch(0.145 0 0)',
      'sidebar-primary': 'oklch(0.205 0 0)',
      'sidebar-primary-foreground': 'oklch(0.985 0 0)',
      'sidebar-accent': 'oklch(0.97 0 0)',
      'sidebar-accent-foreground': 'oklch(0.205 0 0)',
      'sidebar-border': 'oklch(0.922 0 0)',
      'sidebar-ring': 'oklch(0.708 0 0)',
    },
    borderRadius: {
      'sm': 'calc(0.625rem - 4px)',
      'md': 'calc(0.625rem - 2px)',
      'lg': '0.625rem',
      'xl': 'calc(0.625rem + 4px)',
    },
    fontFamily: {
      sans: ['Raleway', 'sans-serif'],
    },
    animation: {
      'float': 'float 6s ease-in-out infinite',
      'shine': 'shine 3s ease-in-out infinite',
      'spin-slow': 'spin 20s linear infinite',
    },
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-20px)' },
      },
      shine: {
        '0%': { transform: 'translateX(-100%) rotate(45deg)' },
        '100%': { transform: 'translateX(200%) rotate(45deg)' },
      },
    },
  },
};
export const plugins = [];

// Dark mode configuration
export const darkMode = 'class';