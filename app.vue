<template>
    <NuxtLayout name="head" :class="{'en-main':store.language == 'en'}"/>
    <main :key="store.pageKey" @click="store.method_nav = false" :class="{'en-main':store.language == 'en'}">
        <NuxtPage v-if="has_language_txt" />
    </main>
    <NuxtLayout name="footer" :class="{'en-main':store.language == 'en'}"/>

    <NuxtLayout name="loading"/>

</template>


<script setup>
const store = useStore()

const has_language_txt = ref(false)

onMounted(()=>{
    if (store.language_txt.hasOwnProperty('auth') &&
        store.language_txt.hasOwnProperty('member') &&
        store.language_txt.hasOwnProperty('order')) {
        has_language_txt.value = true
    } 
})

</script>
