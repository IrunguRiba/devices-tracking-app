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
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.registerNewDeviceForm.patchValue({ userId });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string;
      localStorage.setItem('profilePic', this.imageSrc);
    };
    reader.readAsDataURL(file);
  }

  openAddDeviceForm() {
    this.isAddDeviceFormOpen = true;
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
            title: 'New Device Added',
            text: `Device registered successfully.`,
            confirmButtonColor: '#7e102c',
            background: 'rgba(43, 19, 25, 0.9)',
            color: '#E1D4C1',
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
