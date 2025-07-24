export default () => {
  return {
    getOrderList: (params) => {
      return useHttp.get('v2/sales/orders/list', {
        params,
      });
    },
  };
};
