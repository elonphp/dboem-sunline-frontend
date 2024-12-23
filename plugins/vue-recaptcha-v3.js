import { VueReCaptcha } from 'vue-recaptcha-v3'



export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: '6Ldm1BEqAAAAAGlTiAcnDEstJ3h3lKLStxXmA2dx'
  })
})

// export default defineNuxtPlugin(() => {
//     return {
//       provide: {
//         bootstrap: bootstrap,
//       }
//     }
//   })
  