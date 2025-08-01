<template>
  <header class="header justify-content-between align-items-center d-flex">
    <nuxt-link :to="localePath('/home')">
      <img src="@/assets/images/logo.png" alt="sunline logo">
    </nuxt-link>
    <div class="d-flex align-items-center gap-3">
      <div class="flex-shrink-0 d-flex align-items-center gap-2">
        <label for="">{{ $t('default.language') }}：</label>
        <div class="d-flex">
          <select class="form-select me-4" @change="change_language" v-model="selectLang">
            <option value="en">English</option>
            <option value="zh_Hant">繁體中文</option>
          </select>
        </div>
      </div>
      <!-- <div style="font-size: 24px;">Cookie:{{ lang }}</div>
      <div style="font-size: 24px;">selectLang:{{ selectLang }}</div> -->
      <client-only>
        <div class="flex-shrink-0 d-flex align-items-center gap-2" v-if="isLogin && store.userData">
          <label class="w-100">{{ role }}：</label>
          <div class="method_nav form-select" @click="store.method_nav = !store.method_nav">
            <span>{{ store.userData.name }}</span>
            <ul v-show="store.method_nav ">
              <li @click="store.method_nav = !store.method_nav">
                <nuxt-link :to="localePath('/user-info')">{{ $t('default.text_basic_information') }}</nuxt-link>
              </li>
              <li @click="store.method_nav = !store.method_nav">
                <nuxt-link :to="localePath('/')">{{ $t('default.text_return_home') }}</nuxt-link>
              </li>
              <li @click="store.method_nav = !store.method_nav">
                <button type="button" @click="logout" v-show="isLogin">{{ $t('auth.text_logout') }}</button>
              </li>
            </ul>
          </div>
        </div>
      </client-only>
    </div>
  </header>
 

</template>


<script setup>

const { setLocale, locale } = useI18n()
const localePath = useLocalePath()
const isLogin = useCookie('token_data')
watch(locale, newVal => {
  selectLang.value = newVal
})
const selectLang = ref(locale.value)
const route = useRoute()
const store = useStore()

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

// 登出
const logout = ()=> {
  store.logout()
  // user_info.value = ""
  
}

// 換語言
const change_language = async()=>{
  // 設定驗證套件語言
  await setLocale(selectLang.value)
  $setValidationLocale(selectLang.value);
}




</script>