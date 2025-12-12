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
    console.log("Logging in user...");
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
    console.log("Logging in user...");
  
    const payload = {
      email: user.email,
      password: user.password,
    };
    return this.http.post<{ token: string; message: string, userId: string }>(
      `${this.baseUrlLocalHost}/userByEmail`,
      { email: user.email }
    ).pipe(
      switchMap((tokenResponse:any) => {
        console.log('Token received:', tokenResponse.token);
        localStorage.setItem('token', tokenResponse.token);
        return this.http.post<User>(`${this.baseUrl}/signBack`, payload);
      }),
      catchError((error: any) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }
  

}
