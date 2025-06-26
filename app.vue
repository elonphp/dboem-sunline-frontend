<template>
    <NuxtLayout name="head" :class="store.en_class" v-if="has_language_txt"/>
    <main :key="store.pageKey" @click="store.method_nav = false" :class="store.en_class" v-if="has_language_txt">
        <NuxtPage v-if="has_language_txt" />
    </main>
    <NuxtLayout name="footer" :class="store.en_class" v-if="has_language_txt"/>

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
    console.log(has_language_txt.value);
    
})

</script>
