export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore()
  store.method_nav  = false
  const isLogin = useCookie('token_data').value
  
  // console.log(store.is_login, 'is_login', to);
  
  // 只要沒登入，且不是在登入頁，就導向首頁
  if (!isLogin && to.path !== '/') {
    return navigateTo('/')
  }
  // 已登入且在首頁，導向主頁
  if (isLogin && to.path === '/') {
    return navigateTo('/home')
  }
  // if (to.path === '/' && store.is_login) {
  //   return navigateTo('/home')
  // }
    
  // if (process.client) {
  //   store.method_nav  = false
    
  //   // 檢查是否已經加載過用戶數據
  //   if (!store.is_login) {
  //     console.log("開啟網頁");
  //     store.get_user();
  //     // await store.get_auth_language_txt('global')
  //     }

  //     // 執行 token 驗證
  //     await store.refresh_token();
  //     if (to.path === "/" && store.is_login) {
  //       // console.log("返回home");
  //       // 如果有登入則導向主頁
  //     return navigateTo("/home");
  //   }

  
    if (to.path !== "/" && to.path !== "/reset-password" && !isLogin){
      // console.log("返回首頁");
      // 如果頁面是登入頁跟忘記密碼頁然後沒有登入的情況下返回登入頁
      return navigateTo("/");
      
    }

    
  //   // 使用正則表達式來匹配所有 /order-setting 底下的路由
    // const orderSettingRegex = /^\/order-setting(\/|$)/;

  //   // 只有經銷商有權限進入
  //   if(orderSettingRegex.test(to.path)){
  //     // 如果權限還沒取得
  //     if(store.is_dealer == undefined){
  //       // 1秒後再檢查
  //       setTimeout(() => {
  //         if(!store.is_dealer && !!store.userData){
  //           return navigateTo("/error");
  //         }
  //       }, 1000);
  //     }
      
  //   }
  // }
  
  
});