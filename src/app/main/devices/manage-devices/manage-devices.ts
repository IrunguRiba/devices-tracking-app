import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from './../../main-service';
import { BackButton } from '../../../shared/back-button/back-button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-devices',
  imports: [ BackButton, CommonModule],
templateUrl: './manage-devices.html',
  styleUrl: './manage-devices.css'
})
export class ManageDevices implements OnInit {

  devices: any[] = [];
  devicesForManagement: any[] = [];
  deviceName: any[] = [];
  @Output() deviceWithLocations: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private mainService :MainService, private router:Router) { }

  ngOnInit():void{
    this.getAllDevicesForMap();
    this. existingDeviceCheck() 
  }

  existingDeviceCheck() {
    const userId = localStorage.getItem('userId') || '';
    if (!userId) return;

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log('User data fetched for device management:', data.user.firstName+" " +data.user.lastName);
        this.devicesForManagement=data.user.deviceInfo || []
        this.deviceName=this.devicesForManagement.map((names)=>names.name)


        console.log('Devices data fetched for device management:', this.devicesForManagement );
        console.log('Device names data fetched for device management:', this.deviceName );

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
          this.deviceWithLocations.emit(devicesWithLocation);
          console.log("Devices with locations for mapping: ", devicesWithLocation);
        },        
        error: (error: any) => {
          console.error('Error fetching Devices data for map:', error);
        },
        complete: () => {
          console.log('Completed fetching devices for map display');
        }
      });
}
goToAllDevicesMap(){
this.router.navigate(['/all-map'])
console.log("All devices mapped clicked")
}
}
