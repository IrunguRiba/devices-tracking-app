import { Component, OnInit } from '@angular/core';
import { MainService } from './../../main-service';
import { BackButton } from '../../../shared/back-button/back-button';

@Component({
  selector: 'app-manage-devices',
  imports: [ BackButton],

templateUrl: './manage-devices.html',
  styleUrl: './manage-devices.css'
})
export class ManageDevices implements OnInit {


  constructor(private mainService :MainService) { }

  ngOnInit():void{
      this.existingDeviceCheck();
  }

  existingDeviceCheck() {
    const userId = localStorage.getItem('userId') || '';
    if (!userId) return;

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log('User data fetched for device management:', data);
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      },
      complete: () => {
        console.log('Completed fetching existing devices');
      }
    });
  }
}
