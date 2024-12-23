<template>
    <footer>
        <div>Copyright ©Sunline 2024</div>
    </footer>
</template>

<script setup>

    onMounted(()=>{
  // 高度
    const footer_Height = $('footer').innerHeight()
    
    // 設定CSS變數
    document.documentElement.style.setProperty('--footer-height', footer_Height + 'px');
  
    })


</script>