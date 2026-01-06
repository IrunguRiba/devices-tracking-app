import { Component } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingSpinner} from '../loading-spinner/loading-spinner';
import { BackButton } from '../shared/back-button/back-button';


@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, LoadingSpinner, BackButton],
templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  googleLogo = '/google.png';
  isLoginMode = false;
  loading = false;
  signUpForm: FormGroup;
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, )  {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onCreateUser() {
    if (this.signUpForm.valid) {
      this.loading=true;
      const userData = this.signUpForm.value;

      this.authService.registerUser(userData).subscribe({
        next: (response: any) => { 
          this.isLoginMode = true;
          this.loginForm.patchValue({
            email: userData.email,
            password: userData.password,
          });
          Swal.fire({
            icon: 'success',
            title: 'Account Registered',
            text: `Redirecting to Log in`,
            confirmButtonColor: '#0a0a0d',
            background: 'rgba(31, 27, 107, 0.9)',
            color: '#E1D4C1'
          });
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          Swal.fire({
            title: 'Oops!',
            text: 'Email exists or Password is more than 12 characters',
            icon: 'error',
            background: 'rgba(31, 27, 107, 0.9)', 
            color: '#E1D4C1',               
            confirmButtonColor: '#ff3b3b',   
            iconColor: '#ff4d4d',            
          });
          this.loading=false;
        },
        complete: () => {
          this.loading=false;
        },
      });
    } else {
      console.warn('Something went wrong!');
     
    }
  }
  onLogInUser() {
    if (this.loginForm.valid) {

      const user = this.loginForm.value;
      this.loading=true;
      this.authService.logInUser(user).subscribe({
        next: (response: any) => {

          if (response && response.user && response.user._id) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user._id);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          this.loading=true;
          this.router.navigate(['/main']);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.loading=false;
        },
      });
    }
  }
}
