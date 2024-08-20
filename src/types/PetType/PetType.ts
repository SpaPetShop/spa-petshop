export interface PetType {
  id: string;
  name: string;
  description: string;
}

export interface TypePet {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  fullName: string;
  role: string;
}

export interface Pet {
  id: string;
  name: string;
  weight: number;
  age: number;
  image: string | null;
  typePet: TypePet;
  customer: Customer;
}

export interface PetResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Pet[];
}
