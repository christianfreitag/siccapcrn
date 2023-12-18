module.exports = {
  content: ["./src/**/*.tsx"],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        raleway:['Raleway','bold'],
        tahoma: ["Tahoma", "regular"],
      },

      colors: {
        brand: {
          50: "#6baaff",
          90: "#5593FF",
          100: "#303655",
        },
        brand2: {
          100: "#BFCBCE",
        },
        brand3: {
          100: "#84A7BA",
        },
        brand4: {
          100: "#6F90AF",
        },
        notify: {
          500: "#b58500",
        },
        smoke: {
          100: "FFFFFF",
          500: "#F9FAFC",
        },
        lightBlack: {
          100: "#d1d1d1",
        },
        
        


        dark: {},
      },
    },
  },
  plugins: [],
};
