import { Injectable } from '@angular/core';
import { Observable,  catchError, throwError } from 'rxjs';
import { User } from './Interfaces/user';
import { HttpClient } from '@angular/common/http';
import { MainService } from './../main/main-service';
import { switchMap,} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://tracking-app-backend-g3al.onrender.com/api'; 
  private baseUrlLocalHost='http://localhost:4000/api'
token=''
  constructor(private http: HttpClient, private mainService: MainService) {}

  registerUser(user: User): Observable<User> {
    console.log("Posting new user...");
    return this.http.post<User>(`${this.baseUrl}/newUser`, user);
  }

  logInUser(user: User): Observable<User> {
    const payload = {
      email: user.email,
      password: user.password,
    };
    return this.http.post<User>(`${this.baseUrl}/userLogIn`, payload).pipe(
      catchError((error:any) => {
        console.error('Login error:', error);
        return throwError(error); 
      })
    );
  }

  signInUser(user: User): Observable<User> {
    const payload = {
      email: user.email,
      password: user.password,
    };
        return this.http.post<User>(`${this.baseUrl}/userLogIn`, payload);
    
  }
  
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
