import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserViewModel } from '../../../viewmodels/user.viewmodel';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{

  user$ = this.userViewModel.selectedUser$;
  loading$ = this.userViewModel.loading$;
  error$ = this.userViewModel.error$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userViewModel: UserViewModel
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.userViewModel.loadUserById(userId);
    });
  }

  goToEdit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/users/edit', user.id]);
      }
    }).unsubscribe();
  }

  viewProducts(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/products'], { queryParams: { user_id: user.id } });
      }
    }).unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
