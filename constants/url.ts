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
      getProfile: "/users/profile",
      addImage: "/users/upload-profile-image",
    },
    userAddress: {
      base: "/user-address",
    },
    store: {
      base: "/stores",
      inventory: (storeId: any) => `/inventory/store/${storeId}`,
    },
    products: {
      base: "/products",
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
      cartWithStoreId: (storeId: string) => `/carts/cart-store/${storeId}`
    },
    order: {
      base: "/orders",
      update: (orderId: any) => `/orders/status/${orderId}`,
      updateAfterPayment: (orderId: any) => `/orders/status-payment/${orderId}`,
      getAll: (orderId: any) => `/orders/store/${orderId}`,
      checkout: "/orders/checkout",
      initiate: "/orders/initiate",
      createOrRetrievePendingOrder: "/orders/create-pending"
    },
  },
};
