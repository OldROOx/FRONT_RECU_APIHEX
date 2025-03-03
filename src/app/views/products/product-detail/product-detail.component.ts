import { Component , OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductViewModel } from '../../../viewmodels/product.viewmodel';
import { UserViewModel } from '../../../viewmodels/user.viewmodel';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product$ = this.productViewModel.selectedProduct$;
  loading$ = this.productViewModel.loading$;
  error$ = this.productViewModel.error$;
  ownerName$ = this.productViewModel.selectedProduct$.pipe(
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productViewModel: ProductViewModel,
    private userViewModel: UserViewModel
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productViewModel.loadProductById(productId);
    });
  }

  goToEdit(): void {
    this.product$.subscribe(product => {
      if (product) {
        this.router.navigate(['/products/edit', product.id]);
      }
    }).unsubscribe();
  }

  viewOwner(): void {
    this.product$.subscribe(product => {
      if (product) {
        this.router.navigate(['/users', product.user_id]);
      }
    }).unsubscribe();
  }

  goBack(): void {
    this.product$.subscribe(product => {
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
