<template>
  <NuxtLayout name="head" :class="store.en_class"/>
  <main :key="store.pageKey" @click="store.method_nav = false" :class="store.en_class">
      <NuxtPage />
  </main>
  <NuxtLayout name="footer" :class="store.en_class"/>

  <NuxtLayout name="loading"/>

</template>


<script setup>
const store = useStore()
</script>
