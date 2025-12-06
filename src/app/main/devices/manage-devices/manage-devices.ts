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

  devices: any[] = [];

  constructor(private mainService :MainService) { }

  ngOnInit():void{
    this.getAllDevicesForMap();
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

getAllDevicesForMap(){
      this.mainService.getAllDevices().subscribe({
        next: (data: any) => { 
          this.devices = data.Devices;    
          const devicesWithLocation = this.devices
          .filter((device: any) => 
            device.location && 
            Array.isArray(device.location) && 
            device.location.length > 0 
          )
          .filter((device: any) => 
            device.location.every((loc: any) => loc.latitude != null && loc.longitude != null) 
          )
          .map((device: any) => {
            device.location.forEach((loc: any) => {              
            });
            return {
              name: device.name,  
              location: device.location.map((loc: any) => ({
                latitude: loc.latitude,  
                longitude: loc.longitude 
              }))
            };
          });
        
        console.log("Devices with location: ", devicesWithLocation);
        },        
        error: (error: any) => {
          console.error('Error fetching Devices data for map:', error);
        },
        complete: () => {
          console.log('Completed fetching devices for map display');
        }
      });
}

}
