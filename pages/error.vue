<template>
    <section class="bg-block">
        <div class="container">
            <div class="table-box not-page">
                <div class=" position-absolute">
                    <p class="mb-5">{{$t('default.error_url')}}</p>
                    <nuxt-link to="/home" class="btn sent_go">{{$t('default.text_return_home')}}</nuxt-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>


const store = useStore()

onMounted(() => {
    store.show_loading(false)
    
})
</script>