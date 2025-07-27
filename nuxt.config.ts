// https://nuxt.com/docs/api/configuration/nuxt-config

import { readdirSync } from 'fs'
import { join } from 'path'

export default defineNuxtConfig({
  devtools: { 
    enabled: true
   },

  devServer: process.env.HTTPS === 'true' ? {
   https: {
     key: './https/server.key',
     cert: './https/server.crt',
   },
 } : {
   port: 3600
 },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_BASE_URL
    }
  },

  // runtimeConfig: {
  //   // 服務器端專用
  //   apiSecret: 'test',
  //   // 客戶端用
  //   public: {
  //      baseURL: process.env.NODE_ENV === "production" ? process.env.BASE_URL : "http://sunline/local/",
  //   },
  // },

  app: {
    // buildAssetsDir:"2024/sunline/_nuxt",
    head: {
      title: "Sunline Shutters",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
      
    },
  },

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@fortawesome/fontawesome-free/css/all.css",
    "@/assets/scss/custom.scss",
    "@/assets/scss/order.scss",
    "@/assets/scss/login.scss",
  ],

  modules: ["@vee-validate/nuxt", '@pinia/nuxt', '@nuxtjs/i18n', "dayjs-nuxt", 'pinia-plugin-persistedstate/nuxt'],

  i18n: {
    lazy: true,
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        files: getLocaleFiles('en')
      },
      {
        code: 'zh_Hant',
        files: getLocaleFiles('zh_Hant')
      }
    ]
  },

  imports: {
    dirs: ['stores']
  },

  plugins: [
      "@/plugins/vee-validate.client",
      "@/plugins/custom.js",
      "@/plugins/bootstrap.js",
      '@/plugins/vue-recaptcha-v3.js',
      '@/plugins/jquery.client.js',
  ],

  veeValidate: {
    // 啟用 auto imports
    autoImports: true,
    // 更換 components 名稱
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },

  compatibilityDate: "2025-07-24"
});

// 自動化導入所有語言檔
function getLocaleFiles(localeDir: string) {
  return readdirSync(join(__dirname, 'locales', localeDir))
    .filter(file => file.endsWith('.yaml'))
    .map(file => `${localeDir}/${file}`)
}