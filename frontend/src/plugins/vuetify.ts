import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'

export default createVuetify({
  defaults: {
    VBtn: { rounded: 0, elevation: 0 },
    VCard: { rounded: 0, elevation: 0 },
    VAlert: { rounded: 0 },
    VTextField: { rounded: 0 },
  },
  theme: {
    defaultTheme: 'loatask',
    themes: {
      loatask: {
        dark: true,
        colors: {
          background: '#101010',
          surface: '#171717',
          'surface-variant': '#242424',
          'on-surface': '#ededeb',
          primary: '#c8b58c',
          secondary: '#a3a3a3',
        },
      },
    },
  },
})
