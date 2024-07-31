export interface ProductModel {
  id: number
  title: string
  description: string
  sku: string
  price: number
  weight: number
  createdAt: string
  modifiedAt: string
  imageUrls: string[]
};

export interface UpdateProductModel {
  title: string
  description: string
  sku: string
  price: number
  weight: number
};

export interface CreateProductModel {
  title: string;
  description: string;
  sku: string;
  price: number;
  weight: number;
  images: File[];
}
