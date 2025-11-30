import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import { User } from './Interfaces/user';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient){}

 registerUser(user: User): Observable<User>{
  console.log("Posting new user...")
return this.http.post<User>('http://localhost:4000/api/newUser', user)
 }
  
logInUser(user:User): Observable<User>{
  console.log("Logging new User")
  const payload = {
    email: user.email,
    password: user.password};
    
  return this.http.post<User>('http://localhost:4000/api/userLogIn', payload)
}

}
