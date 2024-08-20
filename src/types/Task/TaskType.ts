export type TaskType = {
    id: string;
    name: string;
    stockPrice: number;
    sellingPrice: number;
    description: string;
    status: string;
    priority: string | null;
    category: {
      id: string;
      name: string;
    };
  };
  
  export type FilterTaskType = {
    Name?: string;
    Status?: string;
    StockPrice?: number;
    SellingPrice?: number;
    CategoryId?: string;
    page: number;
    size: number;
  };
  
  export type TaskResponse = {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: TaskType[];
  };
  