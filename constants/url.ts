export const config = {
  BASE_URL: process.env.BASE_URL || "http://localhost:8080/api/v1",
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      logout: "/auth/logout",
      checkEmail: "/auth/check-email",
      generateToken: "/auth/generate-token",
      loginGoogle: "/auth/google-signin",
      verifyCode: "/auth/verify/registration",
      verifyResetPassword: "/auth/password-reset/verify",
      setPassword: "/auth/set-password",
      requestReset: "/auth/password-reset/request",
      resetPassword: "/auth/password-reset",
    },
    user: {
      base: "/users",
      storeAdmin: "/users/create-role",
      updateStoreAdmin: (storeAdminId: any) =>
        `/users/update-role/${storeAdminId}`,
      getProfile: "/users/profile",
      addImage: "/users/upload-profile-image",
      notStoreAdmin: "/users/not-store-admins",
    },
    userAddress: {
      base: "/user-address",
    },
    store: {
      base: "/stores",
      inventory: (storeId: any) => `/inventory/store/${storeId}`,
      inventoryNotInDiscount: (storeId: any) =>
        `/inventory/store/without-discount/${storeId}`,
      storeAdmin: "/stores/store-admins",
      notStoreAdmin: "/stores/not-store-admins",
      deleteStoreAdmin: (storeAdminId: any) =>
        `/stores/store-admin/${storeAdminId}`,
    },
    products: {
      base: "/products",
      notInInventory: (storeId: any) =>
        `/products/not-in-inventory?storeId=${storeId}`,
      create: "/products/create",
      update: (productId: any) => `/products/${productId}`,
      getAllProducts: (storeId: string) => `/products/stores/${storeId}`,
      getProductDetail: (id: any) => `/inventory/${id}`,
    },
    category: {
      base: "/category",
    },
    location: {
      getNearestStore: "/location/nearest-store",
    },
    inventory: {
      base: "inventory",
      getAllInventoryByStoreId: (storeId: string) =>
        `/inventory/store/${storeId}`,
      create: "inventory/create",
      update: (inventoryId: any) => `inventory/${inventoryId}`,
    },
    discount: {
      base: (storeId: any) => `/discounts/store/${storeId}`,
      create: "discounts/create",
      update: (discountId: any) => `discounts/${discountId}`,
    },
    journal: {
      base: (storeId: any) => `/inventory-journals/${storeId}`,
    },
    cart: {
      base: "/carts",
      summary: (storeId: string) => `/carts/summary/${storeId}`,
      create: "/carts/create",
      update: (cartId: any) => `carts/${cartId}`,
      cartWithStoreId: (storeId: string) => `/carts/cart-store/${storeId}`,
      deleteAllCart: (storeId: string) => `carts/carts/${storeId}`,
      delete: "/carts",
    },
    order: {
      base: "/orders",
      update: (orderId: any) => `/orders/status/${orderId}`,
      updateAfterPayment: (orderId: any) => `/orders/status-payment/${orderId}`,
      getAll: (orderId: any) => `/orders/store/${orderId}`,
      checkout: "/orders/checkout",
      initiate: "/orders/initiate",
      pending: "/orders/pending",
      status: (orderCode: string) => `/orders/status/${orderCode}`,
    },
    sales: {
      totalAmountAllStore: "orders/total-amounts-all-store",
      totalAmountLastWeek: "orders/total-amount-last-week",
      totalAmountLastMonth: "orders/total-amount-last-month",
      totalAmountWithStoreId: "orders/total-amounts-storeid",
      totalAmountWithStoreIdAndCategoryId:
        "orders/total-amount-storeid-categoryid",
      totalAmountWithStoreIdAndProductId:
        "orders/total-amount-storeid-productId",
    },
    payment: {
      base: (storeId: any) => `/payment/store/${storeId}`,
      update: (id: any) => `payment/${id}`,
    },
    inventoryJournal: {
      totalIn: (inventoryId: any) => `inventory-journals/${inventoryId}/in`,
      totalOut: (inventoryId: any) => `inventory-journals/${inventoryId}/out`,
    },
    voucher: {
      base: "/vouchers",
      create: "vouchers/create",
      update: (voucerId: any) => `vouchers/${voucerId}`,
    },
  },
};
