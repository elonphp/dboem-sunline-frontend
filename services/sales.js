export default () => {
  return {
    getOrderList: (params) => {
      return useHttp.get('sales/orders/list', {
        params,
      });
    },
  };
};
