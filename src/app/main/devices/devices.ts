import { Component, OnInit } from '@angular/core';
import { MainService } from '../main-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewDevice } from '../interfaces/newDevice';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devices',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
  standalone: true,
})
export class Devices implements OnInit {
  isAddDeviceFormOpen: boolean = false;
  formSubmitted: boolean = false;
  sharePic = '/share.png';
  addPic = '/add.png';
  editPic = '/edit.png';
  phoneImage = '/phoneImage.png';
  upload = '/upload.png';
  hideButton: boolean = false;
  imageSrc: string | null = null;

  myDevices: [] = []; 

  registerNewDeviceForm: FormGroup;

  constructor(
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.imageSrc = localStorage.getItem('profilePic');

    this.registerNewDeviceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      userId: [''],
    });
  }



  ngOnInit(): void {
    this.existingDeviceCheck();
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.registerNewDeviceForm.patchValue({ userId });
    }
  
  }

existingDeviceCheck() {
  const userId = localStorage.getItem('userId') || '';
  if (!userId) return;

  this.mainService.getUserById(userId).subscribe({
    next: (data: any) => {

      console.log("User Data for Device Check: ", data);
      const visitorIdVerification=localStorage.getItem('visitorId')
      if (data.user.deviceInfo.visitorId === visitorIdVerification) {
        this.hideButton = true;
      } else {
        this.hideButton = false;
      }
    },
    error: (error: any) => {
      console.error('Error fetching user data:', error);
      this.hideButton = false;
    },
    complete: () => {
      console.log('Completed checking existing devices');
    }
  });
}


  onRegisterNewDevice() {
    if (this.registerNewDeviceForm.valid) {
      const deviceData = this.registerNewDeviceForm.value;

      const userId = localStorage.getItem('userId'); 

      if (!userId) {
        console.error('No user ID found in localStorage');
        return;
      }

      this.mainService.addNewDevice(deviceData, userId).subscribe({
        next: (device: NewDevice) => {
          Swal.fire({
            icon: 'success',
            title: 'Device Added',
            text: `Redirecting to Dashboard`,
            confirmButtonColor: '#0a0a0d',
            background: 'rgba(31, 27, 107)',
            color: '#E1D4C1'
          }).then(() => {
           setTimeout(()=>{
            this.router.navigate(['/main/dashboard']);
           }, 500)
   
          });
        
          console.log("Registed Device: ", device)
          this.registerNewDeviceForm.reset();
          const userId = localStorage.getItem('userId');
          if (userId) {
            this.registerNewDeviceForm.patchValue({ userId });
          }
          this.isAddDeviceFormOpen = false;
       
        },
        error: (error: any) => {
          console.error('Error registering device:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }


  goToMap() {
    this.router.navigate(['/map']);
  }

}
