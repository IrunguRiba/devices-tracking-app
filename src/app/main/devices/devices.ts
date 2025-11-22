import { Component, OnInit } from '@angular/core';
import { MainService } from '../main-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewDevice } from '../interfaces/newDevice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devices',
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './devices.html',
  styleUrl: './devices.css',
})
export class Devices implements OnInit {
  isAddDeviceFormOpen: boolean = false;
  formSubmitted: boolean = false;
  sharePic='/share.png';
  addPic='/add.png';
  editPic='/edit.png';
  hideButton: boolean = false;

  openAddDeviceForm() {
    this.isAddDeviceFormOpen = true;
  }
 

  
  device?: NewDevice;

  // name:        string;
  // type:        string;
  // model:       string;
  // description: string;
  // userId:      string;

  registerNewDeviceForm: FormGroup;
  constructor(private mainService: MainService, private formBuilder: FormBuilder) {
    this.registerNewDeviceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      userId: [''],
    });
  }

  ngOnInit(): void {
    console.log('Add component initialized');
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.registerNewDeviceForm.patchValue({ userId });
    }
  }

  onRegisterNewDevice() {
    if (this.registerNewDeviceForm.valid) {
      const deviceData = this.registerNewDeviceForm.value;

      this.mainService.addNewDevice(deviceData).subscribe({
        next: (device: NewDevice) => {
          console.log(' New device registered:', device);
          this.device = device;
          this.registerNewDeviceForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'New Device Added',
            text: `New Device registered successfully.`,
            confirmButtonColor: '#7e102c',
            background: 'rgba(43, 19, 25, 0.9)',
            color: '#E1D4C1',
          });
          this.formSubmitted = true; 
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


  openEditDeviceForm(){
    this.hideButton = true;
  }
}
