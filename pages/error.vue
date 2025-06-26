<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box not-page">
                <div class=" position-absolute">
                    <p class="mb-5">{{ store.language_txt.default.error_url }}</p>
                    <nuxt-link to="/home" class="btn sent_go">{{ store.language_txt.default.text_return_home }}</nuxt-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>


const store = useStore()

onMounted(() => {
    store.show_loading(false)
    console.log(store.language_txt);
    
})
</script>