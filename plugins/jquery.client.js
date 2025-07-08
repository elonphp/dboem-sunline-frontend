// ~/plugins/jquery.client.js
import jquery from 'jquery'

export default defineNuxtPlugin((nuxtApp) => {
  // 提供 $jquery 給全局使用
  nuxtApp.provide('j', jquery)

})