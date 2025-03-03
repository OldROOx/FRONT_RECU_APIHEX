import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductViewModel } from '../../../viewmodels/product.viewmodel';
import { UserViewModel } from '../../../viewmodels/user.viewmodel';


@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  productId?: number;
  userId?: number;
  isEditMode = false;
  loading$ = this.productViewModel.loading$;
  error$ = this.productViewModel.error$;
  users$ = this.userViewModel.users$;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productViewModel: ProductViewModel,
    private userViewModel: UserViewModel
  ) {}

  ngOnInit(): void {
    this.userViewModel.loadUsers();
    this.initForm();

    // Verificar si hay un user_id en los query params
    this.route.queryParams.subscribe(params => {
      if (params['user_id']) {
        this.userId = +params['user_id'];
        this.productForm.patchValue({
          user_id: this.userId
        });
      }
    });

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      this.productId = params['id'] ? +params['id'] : undefined;
      this.isEditMode = !!this.productId;

      if (this.isEditMode) {
        this.productViewModel.loadProductById(this.productId!);
        this.productViewModel.selectedProduct$.subscribe(product => {
          if (product) {
            this.productForm.patchValue({
              name: product.name,
              price: product.price,
              user_id: product.user_id
            });
          }
        });
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0)]],
      user_id: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productViewModel.updateProduct(this.productId, productData).subscribe({
        next: () => this.navigateAfterSave(productData.user_id),
        error: () => {} // Manejado por el ViewModel
      });
    } else {
      this.productViewModel.createProduct(productData).subscribe({
        next: () => this.navigateAfterSave(productData.user_id),
        error: () => {} // Manejado por el ViewModel
      });
    }
  }

  navigateAfterSave(userId: number): void {
    this.router.navigate(['/products'], {
      queryParams: { user_id: userId }
    });
  }

  onCancel(): void {
    if (this.userId) {
      this.router.navigate(['/products'], {
        queryParams: { user_id: this.userId }
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

}
