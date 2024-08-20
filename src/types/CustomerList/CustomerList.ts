export type CustomereListType = {
    id: string;
    name: string;
    password: string;
    status: string;
    type: string;
    
  };
  
  export type FilterCustomerType = {
    Name?: string;
    Password?: string;
    Description?: string;
    Status?: string;
    Type?: string;
    page: number;
    size: number;
  };
  
  export type CategoryResponse = {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: CustomereListType[];
  };