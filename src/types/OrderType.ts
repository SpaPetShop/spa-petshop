import { ServiceType } from "./ServiceType"

export type OrderType = {
    id: string,
    userName: string,
    phone: string,
    avatar: string,
    createdDate: string,
    status: string,
    service: ServiceType
}