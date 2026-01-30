export interface Product {
  id: number;
  _id?: string; // MongoDB ObjectId string from backend
  name: string;
  tags: string;
  price: number;
  rating: number;
  img: string;
  category?: string;
}
