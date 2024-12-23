export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore()
    
  if (process.client) {
    store.method_nav  = false
    store.set_baseUrl()
    
    // 檢查是否已經加載過用戶數據
    if (!store.is_login && !store.user_loaded) {
      // console.log("開啟網頁");
      store.get_user();
      await store.get_auth_language_txt()
       store.user_loaded = true
      }

      // 執行 token 驗證
      await store.token_validation();

    if (to.path === "/" && store.is_login) {
      // console.log("返回home");
      return navigateTo("/home");
    }

  
    if (to.path !== "/" && to.path !== "/reset-password" && !store.is_login){
      // console.log("返回首頁");
      store.set_baseUrl()
      return navigateTo("/");
      
    }

    
    // 使用正則表達式來匹配所有 /order-setting 底下的路由
    const orderSettingRegex = /^\/order-setting(\/|$)/;

    // 只有經銷商有權限進入
    if(orderSettingRegex.test(to.path)){
      if(!store.is_dealer){
        return navigateTo("/error");
      }
    }
  }
  
  
});