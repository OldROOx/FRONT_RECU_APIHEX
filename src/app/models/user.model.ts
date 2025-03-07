import { Product } from './product.model';

export interface User {
  id?: number;
  name: string;
  email: string;
  products?: Product[];
}
