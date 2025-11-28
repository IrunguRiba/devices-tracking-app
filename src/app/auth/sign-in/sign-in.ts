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
import { LoadingSpinner} from '../../loading-spinner/loading-spinner'

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule,  LoadingSpinner],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  googleLogo = '/google.png';

  loading = false;

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

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
          console.log('log in sucess', response);

          if (response && response.user && response.user._id) {
            localStorage.setItem('userId', response.user._id);
            localStorage.setItem('user', JSON.stringify(response.user));
      console.log('User stored successfully:', response.user);
          }
          this.router.navigate(['/main']);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.loading = false;
          console.log('Completed log in');
        },
      });
    }
  }

  goToAuth(){
    this.router.navigate(['/auth']);
    console.log('Sign in button clicked');
  }
}
