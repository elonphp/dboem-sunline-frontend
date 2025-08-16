const fetch = $fetch.create({
  // 攔截request
  onRequest({ options }) {
    const {
      public: { apiUrl }
    } = useRuntimeConfig()
    
    options.baseURL = process.env.NODE_ENV === 'production' 
      ? `${window.location.origin}/api/` 
      : apiUrl

    // token 帶入
    const token = useCookie('token_data')
    if (token.value) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${token.value.access_token}`)
    }

    // 🚩 判斷是否需要 loading
    if (!options.noLoading) {
      const store = useStore()
      store.show_loading(true)
    }
  },

  onRequestError({ error, options }) {
    if (!options.noLoading) {
      const store = useStore()
      store.show_loading(false)
    }
    return error
  },

  async onResponse({ response, options }) {
    if (!options.noLoading) {
      const store = useStore()
      store.show_loading(false)
    }

    // 1. logout API 直接略過
    if (response.url && response.url.includes('/logout')) {
      return Promise.reject(response._data)
    }

    // 2. 只處理 401
    if (response.status === 401) {
      if (options._retry) {
        useStore().logout()
        return
      }
      options._retry = true
      try {
        await useStore().refresh_token(true)
        return fetch(response.url, options)
      } catch (error) {
        useStore().logout()
        return
      }
    }

    // 3. 其他狀態
    if (response.status === 200) {
      if (response._data?.success === false || response._data?.error) {
        return Promise.reject(response._data)
      }
      return response
    }
    return Promise.reject(response._data)
  },

  onResponseError({ response, options }) {
    if (!options.noLoading) {
      const store = useStore()
      store.show_loading(false)
    }
    return Promise.reject(response?._data ?? null)
  }
})

export const useHttp = {
  get:(url, options = {}, extra = {}) => {
    const { params } = options
    return fetch(url, { method: 'get', params, ...extra })
  },

  post:(url, options = {}, extra = {}) => {
    const { body } = options
    return fetch(url, { method: 'post', body, ...extra })
  },

  put:(url, body, extra = {}) => {
    return fetch(url, { method: 'put', body, ...extra })
  },

  delete:(url, body, extra = {}) => {
    return fetch(url, { method: 'delete', body, ...extra })
  }
}
