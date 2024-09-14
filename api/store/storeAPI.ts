import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {FormDataStore} from "@/types/store/type";

class StoreAPI {
    async getStoreList() {
        try {
            const response = await axiosInstance.get(config.endpoints.store.base)
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async getStoreById(id: string) {
        try {
            const response = await axiosInstance.get(`${config.endpoints.store.base}/${id}`)
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async createStore(storeData: FormDataStore){
        try {
            const response = await axiosInstance.post(config.endpoints.store.base, storeData);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async editStore(storeData: FormDataStore, id: string){
        try {
            const response = await axiosInstance.put(config.endpoints.store.base + `/${id}`, storeData);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async deleteStore(id: string){
        try {
            const response = await axiosInstance.delete(config.endpoints.store.base + `/${id}`);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }
}

const storeAPI = new StoreAPI();
export default storeAPI;