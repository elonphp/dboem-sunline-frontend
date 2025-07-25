export default () => {
  return {
    getOrderList: (params) => {
      return useHttp.get('v2/sales/orders/list', {
        params,
      });
    },
    saveOrderHeader: (body, locale) => {
      return useHttp.post(`v2/sales/orders/header/save?locale=${locale}`, {
        body,
      });
    },
    ordersInfo: (params) => {
      return useHttp.get(`v2/sales/orders/info`, {
        params,
      });
    },
    ordersInfoById: (id, locale) => {
      return useHttp.get(`v2/sales/orders/info/${id}?locale=${locale}`);
    },
    getCatalogOptions: (params) => {
      return useHttp.get(`v2/catalog/options/list`, {
        params,
      });
    },
    getCatalogOptionGroups: (params) => {
      return useHttp.get(`v2/catalog/option_groups/info`, {
        params,
      });
    },
    getCatalogOptionsInfo: (params) => {
      return useHttp.get(`v2/catalog/options/info`, {
        params,
      });
    },
    productSave: (body) => {
      return useHttp.post(`v2/sales/orders/product/save`, {
        body,
      });
    },
    ordersCommentsClearCommentCount: (order_id) => {
      return useHttp.get(`v2/sales/orders/comments/clearCommentCount?order_id=${order_id}`);
    },
    ordersCopyOrderProduct: (id) => {
      return useHttp.post(`v2/sales/orders/copyOrderProduct/${id}`);
    },
    ordersDeleteOrderProduct: (order_id, id) => {
      return useHttp.post(`v2/sales/orders/deleteOrderProduct/${order_id}/${id}`);
    },
    ordersApply: (body, locale) => {
      return useHttp.post(`v2/sales/orders/apply?locale=${locale}`, {
        body
      });
    },
    ordersStatusDealerReturn: (body,order_id,locale) => {
      return useHttp.post(`v2/sales/orders/status/dealerReturn/${order_id}?locale=${locale}`, {
        body
      });
    },
    ordersStatusDealerApprove: (body,order_id,locale) => {
      return useHttp.post(`v2/sales/orders/status/dealerApprove/${order_id}?locale=${locale.value}`, {
        body
      });
    },
    ordersSaveExcel: (body,locale) => {
      return useHttp.post(`v2/sales/orders/saveExcel?locale=${locale.value}`, {
        body
      });
    },
    ordersDestroyMany: (body) => {
      return useHttp.post(`v2/sales/orders/destroyMany`, {
        body
      });
    },
  };
};
