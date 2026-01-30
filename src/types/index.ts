export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface CategoryData {
  title: string;
  breadcrumb: string;
  products: Product[];
}

export interface CategoryDataMap {
  [key: string]: CategoryData;
}

export interface CartItem extends Product {
  quantity: number;
}
