const fetch = $fetch.create({
  // 攔截request
  onRequest({ options }) {
    const {
      public: { apiUrl }
    } = useRuntimeConfig()
    
    options.baseURL = process.env.NODE_ENV === 'production' ? `${window.location.origin}/api/` : apiUrl
    // 取代 process.server
    const token = useCookie('token_data')
    if (token.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${token.value.access_token}`)
    }
    const store = useStore()
    store.show_loading(true)
  },
  onRequestError({ error }) {
    const store = useStore()
    store.show_loading(false)
    return error
  },
  async onResponse({ response, options }) {
    const store = useStore()
    store.show_loading(false)
    // 1. logout API 直接略過
    if (response.url && response.url.includes('/logout')) {
      return Promise.reject(response._data)
    }

    // 2. 只處理 401
    if (response.status === 401) {
      // 只允許 retry 一次
      if (options._retry) {
        store.logout()
        return
      }
      options._retry = true
      try {
        await store.refresh_token(true)
        // refresh 成功，重打原本的 API
        return fetch(response.url, options)
      } catch (error) {
        // refresh 失敗，直接登出
        store.logout()
        return
      }
    }

    // 3. 其他狀態照常處理
    if (response.status === 200) {
      if (response._data?.success === false || response._data?.error) {
        return Promise.reject(response._data)
      }
      return response
    }
    return Promise.reject(response._data)
  },
  onResponseError({ response }) {
    const store = useStore()
    store.show_loading(false)
    return Promise.reject(response?._data ?? null)
  }
})

export const useHttp = {
  get:(url, options = {}) => {
    const { params } = options
    return fetch(url, { method: 'get', params })
  },

  post:(url, options = {}) => {
    const { body } = options
    return fetch(url, { method: 'post', body })
  },

  put:(url, body) => {
    return fetch(url, { method: 'put', body })
  },

  delete:(url, body) => {
    return fetch(url, { method: 'delete', body })
  }
}