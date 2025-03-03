import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.getById<User>(this.endpoint, id);
  }

  createUser(user: User): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.apiService.put<User>(this.endpoint, id, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.apiService.delete(this.endpoint, id);
  }
}
