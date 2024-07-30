export interface Product {
  id: number
  title: string
  description: string
  sku: string
  price: number
  weight: number
  createdAt: string
  modifiedAt: string
  imageUrls?: string[]
};

export interface UpdateProduct {
  title: string
  description: string
  sku: string
  price: number
  weight: number
};

export interface CreateProduct {
  title: string;
  description: string;
  sku: string;
  price: number;
  weight: number;
  images: File[];
}
