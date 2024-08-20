import axiosClient from "./axiosClient";
const CategoryAPI = {
  getAll: (params: any) => {
    const url = "/accounts";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, 
      },
    });
  },
  create: (payload: any) => {
    const url = "/";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = "/";
    return axiosClient.delete(url);
  },
};
export default CategoryAPI;
