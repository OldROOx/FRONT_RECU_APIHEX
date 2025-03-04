import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserViewModel {
  private _users = new BehaviorSubject<User[]>([]);
  private _selectedUser = new BehaviorSubject<User | null>(null);
  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  users$ = this._users.asObservable();
  selectedUser$ = this._selectedUser.asObservable();
  loading$ = this._loading.asObservable();
  error$ = this._error.asObservable();

  constructor(private userService: UserService) {}

  loadUsers(): void {
    this._loading.next(true);
    this._error.next(null);

    this.userService.getUsers().pipe(
      tap(users => this._users.next(users)),
      catchError(err => {
        this._error.next(`Error al cargar usuarios: ${err.message || 'Error desconocido'}`);
        return [];
      }),
      finalize(() => this._loading.next(false))
    ).subscribe();
  }

  loadUserById(id: number): void {
    this._loading.next(true);
    this._error.next(null);

    this.userService.getUserById(id).pipe(
      tap(user => this._selectedUser.next(user)),
      catchError(err => {
        this._error.next(`Error al cargar usuario: ${err.message || 'Error desconocido'}`);
        return [];
      }),
      finalize(() => this._loading.next(false))
    ).subscribe();
  }

  createUser(user: User): Observable<User> {
    this._loading.next(true);
    this._error.next(null);

    return this.userService.createUser(user).pipe(
      tap(newUser => {
        const currentUsers = this._users.value;
        this._users.next([...currentUsers, newUser]);
      }),
      catchError(err => {
        this._error.next(`Error al crear usuario: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    this._loading.next(true);
    this._error.next(null);

    return this.userService.updateUser(id, user).pipe(
      tap(updatedUser => {
        const currentUsers = this._users.value;
        const index = currentUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this._users.next([...currentUsers]);
          if (this._selectedUser.value?.id === updatedUser.id) {
            this._selectedUser.next(updatedUser);
          }
        }
      }),
      catchError(err => {
        this._error.next(`Error al actualizar usuario: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  deleteUser(id: number): Observable<any> {
    this._loading.next(true);
    this._error.next(null);

    return this.userService.deleteUser(id).pipe(
      tap(() => {
        const currentUsers = this._users.value;
        this._users.next(currentUsers.filter(user => user.id !== id));
        if (this._selectedUser.value?.id === id) {
          this._selectedUser.next(null);
        }
      }),
      catchError(err => {
        this._error.next(`Error al eliminar usuario: ${err.message || 'Error desconocido'}`);
        throw err;
      }),
      finalize(() => this._loading.next(false))
    );
  }

  selectUser(user: User | null): void {
    this._selectedUser.next(user);
  }

  clearError(): void {
    this._error.next(null);
  }
}
