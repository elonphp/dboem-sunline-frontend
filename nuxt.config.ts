// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
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
  modules: ["@vee-validate/nuxt",'@pinia/nuxt'],
  imports: {
    dirs: ['stores']
  },
  plugins: [
      "@/plugins/vee-validate.client",
      "@/plugins/custom.js",
      "@/plugins/bootstrap.js",
      '@/plugins/vue-recaptcha-v3.js',
      { src: "~/plugins/jquery", mode: "client" },],
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
});

