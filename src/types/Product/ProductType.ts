export type ProductType = {
  id: string;
  name: string;
  stockPrice: number;
  sellingPrice: number;
  description: string;
  status: string;
  timeWork: number;
  priority: number | null;
  image:{imageURL: string}[]
  category: {
    id: string;
    name: string;
  };
};

export type FilterProductType = {
  Name?: string;
  Status?: string;
  StockPrice?: number;
  SellingPrice?: number;
  CategoryId?: string;
  page: number;
  size: number;
};

export type ProductResponse = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: ProductType[];
};
