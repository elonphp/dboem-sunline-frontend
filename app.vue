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
$setValidationLocale(locale.value);
</script>
