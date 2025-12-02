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
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';
import { MainService } from '../../main/main-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, LoadingSpinner],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignIn {
  googleLogo = '/google.png';
  loading = false;

  loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private mainService: MainService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogInUser() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.loading = true;

      this.authService.logInUser(user).subscribe({
        next: (response: any) => {
          console.log('Log in success', response);
          if (response && response.token) {
            localStorage.setItem('jwtToken', response.token); 
          }
          if (response && response.user && response.user._id) {
            localStorage.setItem('userId', response.user._id);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('User stored successfully:', response.user);
          }
          if (!response.user.deviceInfo.location) {
            this.router.navigate(['/main']);
          } else {
            this.router.navigate(['/main/dashboard']);
          }
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.loading = false;
          console.log('Completed login');
        },
      });
    }
  }

  goToAuth() {
    this.router.navigate(['/auth']);
    console.log('Sign in button clicked');
  }
}
