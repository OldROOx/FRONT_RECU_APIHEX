import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserViewModel } from '../../../viewmodels/user.viewmodel';
import { ProductViewModel } from '../../../viewmodels/product.viewmodel';
import { Product } from '../../../models/product.model';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit  {

  products$ = this.productViewModel.products$;
  loading$ = this.productViewModel.loading$;
  error$ = this.productViewModel.error$;

  userId?: number;
  selectedUserName$ = this.userViewModel.selectedUser$.pipe(
    map(user => user ? user.name : null)
  );

  constructor(
    private productViewModel: ProductViewModel,
    private userViewModel: UserViewModel,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'] ? +params['user_id'] : undefined;

      if (this.userId) {
        this.userViewModel.loadUserById(this.userId);
        this.productViewModel.loadProductsByUserId(this.userId);
      } else {
        this.productViewModel.loadProducts();
      }
    });
  }

  viewProductDetails(product: Product): void {
    this.productViewModel.selectProduct(product);
    this.router.navigate(['/products', product.id]);
  }

  editProduct(product: Product): void {
    this.productViewModel.selectProduct(product);
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productViewModel.deleteProduct(id).subscribe();
    }
  }

  createNewProduct(): void {
    this.router.navigate(['/products/new'], {
      queryParams: this.userId ? { user_id: this.userId } : {}
    });
  }

  goBack(): void {
    if (this.userId) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.router.navigate(['/users']);
    }
  }

}
