<template>
  <header class="header justify-content-between align-items-center d-flex">
    <nuxt-link to="/home">
      <img src="@/assets/images/logo.png" alt="sunline logo">
    </nuxt-link>
    <div class="d-flex align-items-center gap-3">
      <!-- <button type="button" @click="logout" v-show="is_login">登出</button> -->
      <div class="flex-shrink-0 d-flex align-items-center gap-2">
        <label for="">{{header_txt}}：</label>
        <div class="d-flex">
          <select class="form-select me-4" @change="change_language" v-model="selectLang">
            <option value="en">English</option>
            <option value="zh_Hant">繁體中文</option>
          </select>
        </div>
      </div>
      <!-- <div style="font-size: 24px;">Cookie:{{ lang }}</div>
      <div style="font-size: 24px;">selectLang:{{ selectLang }}</div> -->
      <div class="flex-shrink-0 d-flex align-items-center gap-2" v-if="user_info">
        <label class="w-100">{{ role }}：</label>
        <div class="method_nav form-select" @click="store.method_nav = !store.method_nav">
          <span>{{ user_info.name }}</span>
          <ul v-show="store.method_nav ">
            <li @click="store.method_nav = !store.method_nav">
              <nuxt-link to="/user-info">{{ $t('default.text_basic_information') }}</nuxt-link>
            </li>
            <li @click="store.method_nav = !store.method_nav">
              <nuxt-link to="/">{{ $t('default.text_return_home') }}</nuxt-link>
            </li>
            <li @click="store.method_nav = !store.method_nav">
              <button type="button" @click="logout" v-show="store.is_login">{{ $t('auth.text_logout') }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
 

</template>


<script setup>

const lang = useCookie('i18n_redirected')
const selectLang = ref(lang.value)
const route = useRoute()
const store = useStore()
const { setLocale } = useI18n()
const changeLang = () => {
  setLocale(selectLang.value)
}
watch(lang, () => {
  selectLang.value = lang.value
})

const user_info = useCookie('token_data')
const { $setValidationLocale } = useNuxtApp();

// 首頁
const is_index = computed(()=>{
  return route.path === '/'
})

// 忘記密碼頁
const is_reset_password = computed(()=>{
  return route.path === '/reset-password'
})

// 角色
const role = computed(()=>{
  return Object.values(store.role)[0] || ""
})

// header語言切換的語言字
const header_txt = computed(()=>{
  return lang.value == 'en'? "Language":"語言"
})

// 登出
const logout = ()=> {
  store.logout()
  // user_info.value = ""
  
}

// 換語言
const change_language = async()=>{
  // store.show_loading(true)
  // 設定驗證套件語言
  $setValidationLocale(lang.value);
  // 語言檔
  changeLang()
  // await store.get_auth_language_txt('change_language')
  // 重新渲染主要頁面
  store.pageKey++
  // 重新獲取會員資料(右上角會員名字用)
  // if(store.is_login){
  //   user_info.value = await store.get_user_data()
  // }
  // store.show_loading(false)
}

// 重新登入的話重新獲取會員資料
// watchEffect(async()=>{
//   if(store.is_login){
//     user_info.value = await store.get_user_data()
//   }
// })




</script>