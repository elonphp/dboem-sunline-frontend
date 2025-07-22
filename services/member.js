export default () => {
  return {
    getMemberInfo: (params) => {
      return useHttp.get('v2/members/info', {
        params,
      });
    },
  };
};
