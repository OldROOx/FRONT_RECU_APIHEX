import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private endpoint = 'products';

  constructor(private apiService: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.endpoint);
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.getById<Product>(this.endpoint, id);
  }

  getProductsByUserId(userId: number): Observable<Product[]> {
    // Adaptado al formato de query params de la API
    return this.apiService.get<Product[]>(`${this.endpoint}?user_id=${userId}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.apiService.post<Product>(this.endpoint, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.apiService.put<Product>(this.endpoint, id, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }
}
