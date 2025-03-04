import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import {UserViewModel} from '../../../viewmodels/user-viewmodel.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: false
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId?: number;
  isEditMode = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userViewModel: UserViewModel
  ) {
    this.loading$ = this.userViewModel.loading$;
    this.error$ = this.userViewModel.error$;
  }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : undefined;
      this.isEditMode = !!this.userId;

      if (this.isEditMode) {
        this.userViewModel.loadUserById(this.userId!);
        this.userViewModel.selectedUser$.subscribe(user => {
          if (user) {
            this.userForm.patchValue({
              name: user.name,
              email: user.email
            });
          }
        });
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData: User = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userViewModel.updateUser(this.userId, userData).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => {} // Manejado por el ViewModel
      });
    } else {
      this.userViewModel.createUser(userData).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => {} // Manejado por el ViewModel
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
