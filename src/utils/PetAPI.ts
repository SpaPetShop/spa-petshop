import { PetResponse } from "../types/PetType/PetType";
import axiosClient from "./axiosClient";

const petAPI = {
  getDataBookingOfCustomer: (params: any) => {
    const url = "/";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getPetsByCustomerId: (customerId: string) => {
    const url = `/pet?CustomerId=${customerId}`;
    return axiosClient.get<any, PetResponse>(url);
  },
  createNewPet: (payload: any) => {
    const url = "/";
    return axiosClient.post(url, payload);
  },
  updatePet: (payload: any) => {
    const url = "/";
    return axiosClient.put(url, payload);
  },
  deletePet: (payload: any) => {
    const url = "/";
    return axiosClient.delete(url, payload);
  },
};
export default petAPI;
