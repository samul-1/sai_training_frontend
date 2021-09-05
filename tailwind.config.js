module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'even'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      margin: ['first', 'last']
    }
  },
  plugins: []
}
