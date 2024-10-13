export const queryKeys = {
  users: {
    GET_PROFILE: "GET_PROFILE",
  },
  userAddress: {
    GET_USER_ADDRESSES: "GET_USER_ADDRESSES",
  },
  stores: {
    GET_STORES: "GET_STORES",
  },
  product: {
    GET_PRODUCTS: "GET_PRODUCTS",
  },
  productList: {
    GET_PRODUCTS: "GET_PRODUCT_LIST",
  },
  productStoreList: {
    GET_PRODUCTS: "GET_PRODUCT_STORE_LIST",
  },
  location: {
    GET_LOCATION: "GET_LOCATION",
    GET_USER_ADDRESSES: "GET_USER_ADDRESSES",
  },
  discount: {
    GET_DISCOUNT: "GET_DISCOUNT",
  },
  journal: {
    GET_JOURNAL: "GET_JOURNAL",
  },
  carts: {
    GET_CARTS: "GET_CARTS",
  },
  checkout: {
    GET_CHECKOUT_SUMMARY: (storeId:any) =>  `GET_CHECKOUT_SUMMARY_STOREID_${storeId}`,
  },
  order: {
    GET_ORDER: "GET_ORDER",
    GET_ORDER_PENDING: "GET_ORDER_PENDING",
    GET_ORDER_STATUS: "GET_ORDER_STATUS",
    GET_USER_ORDERS: "GET_USER_ORDERS",
  },
  storesADmin: {
    GET_STORE_ADMIN: "GET_STORES_ADMIN",
  },
  payment: {
    GET_PAYMENT: "GET_PAYMENT",
  },
  voucher: {
    GET_VOUCHER: "GET_VOUCHER",
    GET_VOUCHER_BY_USER: "GET_VOUCHER_BY_USER",
  },
};
