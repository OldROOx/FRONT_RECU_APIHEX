import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserViewModel} from '../../../viewmodels/user-viewmodel.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  standalone: false
})
export class UserDetailComponent implements OnInit {
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userViewModel: UserViewModel
  ) {
    this.user$ = this.userViewModel.selectedUser$;
    this.loading$ = this.userViewModel.loading$;
    this.error$ = this.userViewModel.error$;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.userViewModel.loadUserById(userId);
    });
  }

  goToEdit(): void {
    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.router.navigate(['/users/edit', user.id]);
      }
    }).unsubscribe();
  }

  viewProducts(): void {
    this.user$.subscribe((user: User | null) => {
      if (user) {
        this.router.navigate(['/products'], { queryParams: { user_id: user.id } });
      }
    }).unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
