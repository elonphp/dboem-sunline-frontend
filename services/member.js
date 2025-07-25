export default () => {
  return {
    getMemberInfo: (params) => {
      return useHttp.get('v2/members/info', {
        params,
      });
    },
    resetPasswordEmail: (body) => {
      return useHttp.post('v2/password/email', {
        body,
      });
    },
    passwordUpdate: (body) => {
      return useHttp.post('v2/password/update', {
        body,
      });
    },
    membersSave: (body) => {
      return useHttp.post('v2/members/save', {
        body,
      });
    },
  };
};
