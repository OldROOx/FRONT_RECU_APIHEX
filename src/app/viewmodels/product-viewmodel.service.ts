import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';


@Injectable({
  providedIn: 'root'
})
export class ProductViewmodelService {
  private _products = new BehaviorSubject<Product[]>([]);
  private _selectedProduct = new BehaviorSubject<Product | null>(null);
  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  products$ = this._products.asObservable();
  selectedProduct$ = this._selectedProduct.asObservable();
  loading$ = this._loading.asObservable();
  error$ = this._error.asObservable();

  constructor(private productService: ProductService) {}

  loadProducts(): void {
    this._loading.next(true);
    this._error.next(null);

    this.productService.getProducts().pipe(
      tap(products => this._products.next(products)),
      catchError(err => {
        this._error.next(`Error al cargar productos: ${err.message || 'Error desconocido'}`);
        return [];
      }),
      finalize(() => this._loading.next(false))
    ).subscribe();
  }

  loadProductsByUserId(userId: number): void {
    this._loading.next(true);
    this._error.next(null);

    this.productService.getProductsByUserId(userId).pipe(
      tap(products => this._products.next(products)),
      catchError(err => {
        this._error.next(`Error al cargar productos del usuario: ${err.message || 'Error desconocido'}`);
        return [];
      }),
      finalize(() => this._loading.next(false))
    ).subscribe();
  }

  loadProductById(id: number): void {
    this._loading.next(true);
    this._error.next(null);

    this.productService.getProductById(id).pipe(
      tap(product => this._selectedProduct.next(product)),
      catchError(err => {
        this._error.next(`Error al cargar producto: ${err.message || 'Error desconocido'}`);
        return [];
      }),
      finalize(() => this._loading.next(false))
    ).subscribe();
  }

  createProduct(product: Product): Observable<Product> {
    this._loading.next(true);
    this._error.next(null);

    return this.productService.createProduct(product).pipe(
      tap(newProduct => {
        const currentProducts = this._products.value;
        this._products.next([...currentProducts, newProduct]);
      }),
      catchError(err => {
        this._error.next(`Error al crear producto: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    this._loading.next(true);
    this._error.next(null);

    return this.productService.updateProduct(id, product).pipe(
      tap(updatedProduct => {
        const currentProducts = this._products.value;
        const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          currentProducts[index] = updatedProduct;
          this._products.next([...currentProducts]);
          if (this._selectedProduct.value?.id === updatedProduct.id) {
            this._selectedProduct.next(updatedProduct);
          }
        }
      }),
      catchError(err => {
        this._error.next(`Error al actualizar producto: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  deleteProduct(id: number): Observable<any> {
    this._loading.next(true);
    this._error.next(null);

    return this.productService.deleteProduct(id).pipe(
      tap(() => {
        const currentProducts = this._products.value;
        this._products.next(currentProducts.filter(product => product.id !== id));
        if (this._selectedProduct.value?.id === id) {
          this._selectedProduct.next(null);
        }
      }),
      catchError(err => {
        this._error.next(`Error al eliminar producto: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  selectProduct(product: Product | null): void {
    this._selectedProduct.next(product);
  }

  clearError(): void {
    this._error.next(null);
  }
}
