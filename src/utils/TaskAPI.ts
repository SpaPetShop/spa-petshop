import { TaskResponse } from "../types/Task/TaskType";
import axiosClient from "./axiosClient";
const TaskAPI = {
  getAll: (params: any) => {
    const url = "/accounts";
    return axiosClient.get<any, TaskResponse>(url, {
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
    const url = `/accounts/${id}`;
    return axiosClient.put(url, payload);
  },
  delete: (id: string) => {
    const url = `/accounts/${id}`;
    return axiosClient.delete(url);
  },
};
export default TaskAPI;
