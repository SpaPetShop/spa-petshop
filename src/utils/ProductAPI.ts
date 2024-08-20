
import { ComboResponse, ComboType } from "../types/Combo/ComboType";
import axiosClient from "./axiosClient";
const ProductAPI = {
  getAll: (params: any) => {
    const url = "/products";
    return axiosClient.get<any, ComboResponse>(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getDetail: (id: string) => {
    const url = `/products/${id}`;
    return axiosClient.get<any, ComboType>(url);
  },
  create: (payload: any) => {
    const url = "/products";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/products/${id}`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  },
};
export default ProductAPI;
