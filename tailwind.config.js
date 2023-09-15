/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1120px',
        '2xl': '1280px',
        '3xl': '1366px',
        '4xl': '1436px',
        '5xl': '1580px',


      },
      backgroundImage: {
        // 'card-pattern': "url('public/images/muney.png')",
      },
    }
  },

  variants: {
  extend: { },
},
daisyui: {
  themes: [
    {
      mytheme: {

        "primary": "#FAE1D0", //pinkish

        "secondary": "#EFF6BD",//green

        "accent": "#ADC172",// dark green

        "neutral": "#242529",// black

        "base-100": "#6A747C",

        "info": "#9A82BF", //purple

        "success": "#36D399",

        "warning": "#ffc409",

        "error": "#B62121",

        "off-white": "#FFFBF9"
      },
    },
  ],
  },

plugins: [require("daisyui")],


}