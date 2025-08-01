<template>
  <div :class="locale === 'en' ? 'en-main' : ''">
    <NuxtLayout name="head" />
    <main @click="store.method_nav = false" >
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

// 初始化時設定 vee-validate 語系
onMounted(() => {
  $setValidationLocale(locale.value);
})
</script>
