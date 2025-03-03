export interface Product {
  id?: number;
  name: string;
  price: number;
  user_id: number; // Adaptado a la estructura de la API hexagonal
}
