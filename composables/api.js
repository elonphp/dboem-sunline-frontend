const fetch = $fetch.create({
  // 攔截request
  onRequest({ request, options }) {
    const {
      public: { apiUrl }
    } = useRuntimeConfig()

    options.baseURL = apiUrl
    // 取代 process.server
    const token = useCookie('token_data')
    console.log(token.value);
    
    if (token.value) {
      options.headers = new Headers(options.headers)
      // options.headers.set('Authorization', `Bearer ${token.value.access_token}`)
    }
  },
  onRequestError({ error }) {
    return error
  },
  async onResponse({
    response,
    options
  }) {
    if (response.status === 200) {
      return response
    } else {
      switch (response.status) {
        case 401:
          console.log('401囉');          
          // useCookie('token_data').value = null
          await navigateTo('/')
          break
        default:
          break
      }
      return Promise.reject(response._data)
    }
  },
  onResponseError({ response }) {
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