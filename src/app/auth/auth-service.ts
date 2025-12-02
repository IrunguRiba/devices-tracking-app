import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './Interfaces/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://tracking-app-backend-g3al.onrender.com/api'; 

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    console.log("Posting new user...");
    return this.http.post<User>(`${this.baseUrl}/newUser`, user);
  }

  logInUser(user: User): Observable<User> {
    console.log("Logging in user...");
    const payload = {
      email: user.email,
      password: user.password
    };
    return this.http.post<User>(`${this.baseUrl}/userLogIn`, payload);
  }
}
