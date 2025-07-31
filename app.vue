<template>
  <div :class="locale === 'en' ? 'en-main' : ''">
    <NuxtLayout name="head" />
    <main :key="store.pageKey" @click="store.method_nav = false" >
        <NuxtPage />
    </main>
    <NuxtLayout name="footer" />
  
    <NuxtLayout name="loading"/>
  </div>

</template>


<script setup>
const store = useStore()
const { locale } = useI18n()
const { $setValidationLocale } = useNuxtApp();
const lang = useCookie('i18n_redirected')

// 初始化時設定 vee-validate 語系
onMounted(() => {
  $setValidationLocale(lang.value);
})

// 監聽語系變化
watch(lang, (newLang) => {
  $setValidationLocale(newLang);
})
</script>
