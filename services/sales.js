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
    productSave2: (body, locale) => {
      return useHttp.post(`v2/sales/orders/product/save2?locale=${locale}`, {
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
    ordersDestroy: (id) => {
      return useHttp.post(`v2/sales/orders/destroy/${id}`);
    },
    ordersCommentsAdd: (body, locale) => {
      return useHttp.post(`v2/sales/orders/comments/add?locale=${locale}`, {
        body
      });
    },
    getOrdersCommentsList: (params) => {
      return useHttp.get(`v2/sales/orders/comments/list`, {
        params
      });
    },
    getDealersOptionList: (locale) => {
      return useHttp.get(`v2/dealers/option/list?locale=${locale}`);
    },
    dealersSaveMany: (body) => {
      return useHttp.post(`v2/dealers/option/saveMany`, {
        body
      });
    },
    ordersCopyOrder: (id) => {
      return useHttp.post(`v2/sales/orders/copyOrder/${id}`);
    },
    ordersDeleteOrder: (id) => {
      return useHttp.post(`v2/sales/orders/deleteOrder/${id}`);
    },
    ordersStatusDealerApproveMany: (body) => {
      return useHttp.post(`v2/sales/orders/status/dealerApproveMany?locale=zh_Hant`, {
        body
      });
    },
    ordersResource: (locale) => {
      return useHttp.get(`v2/sales/orders/resource?locale${locale}`);
    },
  };
};
