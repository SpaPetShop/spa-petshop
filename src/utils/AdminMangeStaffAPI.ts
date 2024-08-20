import axiosClient from "./axiosClient";
const AdminManageStaffAPI = {
  getAll: (params :any ) => {
    const url = "/accounts";
    return axiosClient.get<any >(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  create: (payload: any) => {
    const url = "/staff";
    return axiosClient.post(url, payload);
  },
  update: (id: string, payload: any) => {
    const url = `/staff/${id}`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = `/staff/${id}`;
    return axiosClient.delete(url);
  },
};
export default AdminManageStaffAPI;
