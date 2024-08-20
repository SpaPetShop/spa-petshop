
import { ProductResponse } from "../types/Product/ProductType";
import axiosClient from "./axiosClient";
const SubProductAPI = {
  getAll: (params: any) => {
    const url = "/supProducts";
    return axiosClient.get<any, ProductResponse>(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getOne: (id: string) => {
    const url = `/supProducts/${id}`;
    return axiosClient.get(url);
  },
  create: (payload: any) => {
    const url = "/supProducts";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/supProducts?id=${id}`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = `/supProducts/${id}`;
    return axiosClient.delete(url);
  },
};
export default SubProductAPI;
