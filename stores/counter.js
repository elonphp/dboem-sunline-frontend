import { defineStore } from 'pinia'
import  XLSX  from 'xlsx-js-style'
import { useDayjs } from '#imports'

export const useStore = defineStore('counter', () => {
    const dayjs = useDayjs()
    const config = useRuntimeConfig()
    const router = useRouter()
    const userData = ref('')
    const role = ref({})
    const baseUrl = config.public.apiUrl
    const loading = ref(false)
    const language_txt = ref({})
    const method_nav = ref(false)
    
    // 判斷token是否過期
    const isExpire = () => {
        // const expTime = userData.value.expire_at        
        const expTime = useCookie('token_data').expire_at
        return dayjs().isAfter(dayjs(expTime))
    }
    const logoutHandle = async () => {
      useCookie('token_data').value = null           
      userData.value = ''
      role.value = {}
      await nextTick()
      // 等待資料都清空再跳轉
      router.push('/')  // 返回登入頁
    }
    const logout = async () => {
        // 取得目前使用者 JWT（JSON Web Token）過期時間
        // 沒過期透過api(登出)消除 過期則直接刪除
        const tokenData = useCookie('token_data').value
        if (!isExpire()) {
            try {
              await $api.auth.logout({
                device_id: tokenData.device_id
              })
            } catch (err) {
                console.log(err)
            } finally {
              logoutHandle()
            }
        }
        logoutHandle()
    }

    const get_user_data = async () => {
        const params = {
            equal_id: useCookie('token_data').value?.member_id
        }
        try {
            const res = await $api.member.getMemberInfo(params)
            //  更新公司
            //  角色
            role.value = res.response.roles
            userData.value = res.response

            //  上級
            return res
            
        } catch (err) {
            console.log(err)
        }
    }

    // 刷新 access token
    const refresh_token = async (is401 = false) => {
      if (!isExpire() && !is401) return
      // if (!refresh_token) return
      const tokenData = useCookie('token_data')
      try {
        const res = await $api.auth.refresh_token({
          refresh_token: tokenData.value.refresh_token
        })
        
        useCookie('token_data', {
          expires: dayjs(res.expires_at).toDate()
        }).value = JSON.stringify({
          ...tokenData.value,
          ...res
        })
      } catch (error) {
        logout()
      }
    }
    // 表單 轉formData
    const jsonToFormData = (data, formData = new FormData(), parentKey = '') => {
        // 檢查 data 是否是一個物件，並且不是 Date 或 File 的實例。
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach((key) => {
                jsonToFormData(
                    // 帶入data的key值、formData、(如果沒有父key則帶入原本key否則帶入父key)
                    data[key],
                    formData,
                    parentKey ? `${parentKey}[${key}]` : key
                )
            })
            // 如果都不是則加進formData
        } else {
            formData.append(parentKey, data)
        }
        return formData
    }

    // tag狀態顏色
    const status_colors = (status) => {
        switch (status) {
            case 'Draft': //草稿
                return 'tag tag-org'
            case 'Pending': //申請中
                return 'tag tag-yellow'
            case 'DealerApproved': // 經銷商已確認
                return 'tag tag-yellow'
            case 'Confirmed': //  已確認
                return 'tag tag-green'
            case 'Processing': // 處理中
                return 'tag tag-green'
            default: //作廢、刪除
                return 'tag tag-gray'
        }
    }

    // loading
    const show_loading = (val) => {
        loading.value = val
    }

    // computed
    // 是經銷商?
    const is_dealer = computed(() => {
        console.log(role.value);
        
        return !!role.value.dealer || role.value.sunline
    })
    // 是翔特
    const is_sunline = computed(() => {
        return !!role.value.sunline
    })

    return {
        role,
        method_nav,
        baseUrl,
        userData,
        logout,
        get_user_data,
        refresh_token,
        show_loading,
        loading,
        jsonToFormData,
        status_colors,
        is_dealer,
        language_txt,
        is_sunline,
    }
}, {
  persist: [
    {
      pick: ['userData', 'role'],
      storage: piniaPluginPersistedstate.localStorage()
    }
  ]
})
