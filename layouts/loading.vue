<template>

    <div class="loading" v-show="store.loading">
        <img src="@/assets/images/loading.svg" alt="loading">
    </div>


</template>


<script setup>
const store = useStore()


</script>