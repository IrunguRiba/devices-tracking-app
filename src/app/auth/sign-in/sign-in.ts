import { Component } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeviceInfo } from '../../main/interfaces/device';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingSpinner } from '../../loading-spinner/loading-spinner';
import { MainService } from '../../main/main-service';
import { HttpClient } from '@angular/common/http';
import { BackButton } from '../../shared/back-button/back-button';


@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, LoadingSpinner, BackButton],
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
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  onLogInUser() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;
      this.loading = true;
  
      this.authService.signInUser(user).subscribe({
        next: (response: any) => {
        
          if (response && response.user && response.user._id) {
          
          this.authService.setToken(response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.user._id);
          }
          const visitorIdVerification = localStorage.getItem('visitorId');
         
          const deviceHasMatchingVisitorId = response.user.deviceInfo?.some((device: DeviceInfo) => device.visitorId === visitorIdVerification);
        
        
  
          if (deviceHasMatchingVisitorId) {
            this.router.navigate(['/main/dashboard']);
          } else {
            this.router.navigate(['/main/devices']);
          }
        },
        error: (error: any) => {
          console.log('Error:', error);
          Swal.fire({
            title: 'Oops!',
            text: 'Email or Password is incorrect.',
            icon: 'error',
            background: 'rgba(31, 27, 107, 0.9)', 
            color: '#E1D4C1',               
            confirmButtonColor: '#ff3b3b',   
            iconColor: '#ff4d4d',            
          });
          this.loading = false;
        },        
        
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      Swal.fire('Validation error', 'Invalid email or password', 'warning');
    }
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }
}
