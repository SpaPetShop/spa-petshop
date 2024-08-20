export type OrderType = {
  orderId: string;
  invoiceCode: string;
  createdDate: string;
  completedDate: string;
  description: string;
  totalAmount: number;
  finalAmount: number;
  status: string;
  type: string;
  userInfo: {
    id: string;
    fullName: string;
    phoneNumber: string;
    image: string;
    role: string;
  };
  petInfor: {
    id: string;
    name: string;
    typePet: {
      id: string
      name: string
    };
  };
  note: {
    id: string;
    status: string;
    description: string;
    createDate: string;
  }[];
  staff: {
    id: string;
    fullName: string;
    role: string;
    phoneNumber: string;
    image: string;
  };
  productList: [
    {
      orderDetailId: string;
      productId: string;
      productName: string;
      supProductId: string;
      supProductName: string;
      quantity: number;
      sellingPrice: number;
      totalAmount: number;
    }
  ];
};

export type ComboType = {
  id: string;
  name: string;
  stockPrice: number;
  sellingPrice: number;
  description: string;
  status: string;
  priority: string | null;
  image: { imageURL: string }[];
  category: {
    id: string;
    name: string;
  };
  supProducts: {
    id: string;
    name: string;
    stockPrice: number;
    sellingPrice: number;
  }[];
};

export type FilterOrderType = {
  InvoiceCode?: string;
  CreateDate?: string;
  CompletedDate?: number;
  Status?: string;
  Type?: string
  PetId?: string;
  page: number;
  size: number;
};

export type OrderResponse = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: OrderType[];
};



