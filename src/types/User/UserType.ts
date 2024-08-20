import { PaginationType } from "../CommonType";
export type UserType = {
  id: string;
  username: string;
  role: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  status: string;
  email: string;
  point: null | string;
  yearsOfExperience: null | number;
  image: string | null;
  rank: null | string;
};

export type FilterUserType = {
  Username?: string;
  FullName?: string;
  PhoneNumber?: string;
  Address?: string;
  Status?: string;
  Email?: string;
  Point?: string;
  Role?: string
  page: number;
  size: number;
};

export type UserResponse = PaginationType & { items: UserType[] };
