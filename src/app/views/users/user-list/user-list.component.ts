import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserViewModel } from '../../../viewmodels/user.viewmodel';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent  implements OnInit {
  users$ = this.userViewModel.users$;
  loading$ = this.userViewModel.loading$;
  error$ = this.userViewModel.error$;

  constructor(
    private userViewModel: UserViewModel,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userViewModel.loadUsers();
  }

  viewUserDetails(user: User): void {
    this.userViewModel.selectUser(user);
    this.router.navigate(['/users', user.id]);
  }

  viewUserProducts(user: User): void {
    this.router.navigate(['/products'], { queryParams: { user_id: user.id } });
  }

  editUser(user: User): void {
    this.userViewModel.selectUser(user);
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userViewModel.deleteUser(id).subscribe();
    }
  }

  createNewUser(): void {
    this.router.navigate(['/users/new']);
  }

}
