import { CategoryResponse } from "../types/Category/CategoryType";
import axiosClient from "./axiosClient";
const CategoryAPI = {
  getAll: (params: any) => {
    const url = "/categories";
    return axiosClient.get<any, CategoryResponse>(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  create: (payload: any) => {
    const url = "/categories";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/categories/${id}`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = `/categories/${id}`;
    return axiosClient.delete(url);
  },
};
export default CategoryAPI;
