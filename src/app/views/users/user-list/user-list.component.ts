import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import {UserViewModel} from '../../../viewmodels/user-viewmodel.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private userViewModel: UserViewModel,
    private router: Router
  ) {
    this.users$ = this.userViewModel.users$;
    this.loading$ = this.userViewModel.loading$;
    this.error$ = this.userViewModel.error$;
  }

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
