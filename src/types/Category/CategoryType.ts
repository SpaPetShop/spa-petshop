export type CategoryType = {
  id: string;
  name: string;
  description: string;
  status: string;
  type: string;
  masterCategoryId: string;
};

export type FilterCategoryType = {
  Name?: string;
  Description?: string;
  Status?: string;
  Type?: string;
  MasterCategoryId?: string;
  page: number;
  size: number;
};

export type CategoryResponse = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: CategoryType[];
};