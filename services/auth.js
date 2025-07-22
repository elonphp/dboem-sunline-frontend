export default () => {
  return {
    login: (body) => {
      return useHttp.post('v2/login', {
        body,
      });
    },
    logout: (body) => {
      return useHttp.post('v2/logout', {
        body,
      });
    },
    refresh_token: (body) => {
      return useHttp.post('v2/refresh', {
        body,
      });
    },
  };
};
