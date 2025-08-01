export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const store = useStore()
    const localePath = useLocalePath()
    store.method_nav  = false
    const isLogin = useCookie('token_data').value
    
    // 檢查是否為登入頁（根據 prefix_except_default 策略調整）
    const isLoginPage = to.path === '/' || to.path === '/zh_Hant'
    const isResetPasswordPage = to.path === '/reset-password' || to.path === '/zh_Hant/reset-password'
    
    // 如果已登入且訪問登入頁或重置密碼頁，導向主頁
    if (isLogin && (isLoginPage || isResetPasswordPage)) {
      return navigateTo(localePath('/home'), { redirectCode: 301 })
    }
    
    // 如果未登入且訪問需要登入的頁面，導向登入頁
    if (!isLogin && !isLoginPage && !isResetPasswordPage) {
      return navigateTo('/')
    }
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