import { OrderResponse, OrderType } from "../types/Order/OrderType";
import axiosClient from "./axiosClient";
const OrderAPI = {
  getAll: (params: any) => {
    const url = "/orders";
    return axiosClient.get<any, OrderResponse>(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDetail: (id: string) => {
    const url = `/orders/${id}`;
    return axiosClient.get<any, OrderType>(url);
  },
  create: (payload: any) => {
    const url = "/orders";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/orders/${id}`;
    return axiosClient.patch(url, payload);
  },
  delete: (id: string) => {
    const url = `/orders/${id}`;
    return axiosClient.delete(url);
  },
};
export default OrderAPI;
