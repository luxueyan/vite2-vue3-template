module.exports = {
  map: 'inline',
  plugins: {
    'postcss-preset-env': {
      stage: 2,
      preserve: false,
      features: {
        'nesting-rules': false,
        'custom-selectors': true,
        'custom-properties': true,
        'system-ui-font-family': true,
        'environment-variables': true,
        'overflow-property': true,
        'place-properties': true,
      },
      autoprefixer: {},
      importFrom: [
        './src/assets/css/_var.css',
        // {
        //   customProperties: { '--color-blue': 'blue' },
        // },
      ],
      exportTo: ['./src/assets/css/_var.mjs'],
    },

    // 'postcss-at-rules-variables': {},
    // 'postcss-conditionals': {},
    // 'postcss-for': {},
    // 'postcss-simple-vars': {},
    // 'postcss-apply': { preserve: false },
    'postcss-nested': {},
    // autoprefixer: {},
    // 'postcss-import': {},
    // 'postcss-css-variables': {},
    // 'postcss-short': {
    //   // prefix: 's',
    //   skip: '|',
    // },
  },
}
