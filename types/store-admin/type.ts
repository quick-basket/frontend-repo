export type StoreAdminListType = {
  id: string;
  userId: number;
  userName: string;
  newRole: string;
  storeId: number;
  storeName: string;
};

export type FormStoreAdminData = {
  userId: number;
  userName: string;
  newRole: string;
  storeId: number;
  storeName: string;
};

// export type FormDataStoreAdmin = Omit<StoreAdminListType, "">
