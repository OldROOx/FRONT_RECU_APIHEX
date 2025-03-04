import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductViewModel} from '../../../viewmodels/product-viewmodel.service';
import {UserViewModel} from '../../../viewmodels/user-viewmodel.service';
import { switchMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  ownerName$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productViewModel: ProductViewModel,
    private userViewModel: UserViewModel
  ) {
    this.product$ = this.productViewModel.selectedProduct$;
    this.loading$ = this.productViewModel.loading$;
    this.error$ = this.productViewModel.error$;
    this.ownerName$ = this.productViewModel.selectedProduct$.pipe(
      switchMap(product => {
        if (product && product.user_id) {
          return this.userViewModel.users$.pipe(
            tap(users => {
              if (!users.length) {
                this.userViewModel.loadUserById(product.user_id);
              }
            }),
            switchMap(users => {
              const owner = users.find(u => u.id === product.user_id);
              return of(owner ? owner.name : 'Usuario desconocido');
            })
          );
        }
        return of('Usuario desconocido');
      })
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productViewModel.loadProductById(productId);
    });
  }

  goToEdit(): void {
    this.product$.subscribe((product: Product | null) => {
      if (product) {
        this.router.navigate(['/products/edit', product.id]);
      }
    }).unsubscribe();
  }

  viewOwner(): void {
    this.product$.subscribe((product: Product | null) => {
      if (product) {
        this.router.navigate(['/users', product.user_id]);
      }
    }).unsubscribe();
  }

  goBack(): void {
    this.product$.subscribe((product: Product | null) => {
      if (product) {
        this.router.navigate(['/products'], {
          queryParams: { user_id: product.user_id }
        });
      } else {
        this.router.navigate(['/products']);
      }
    }).unsubscribe();
  }
}
