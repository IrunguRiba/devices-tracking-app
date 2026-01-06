import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from './../../main-service';
import { BackButton } from '../../../shared/back-button/back-button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {SpiningLoader} from '../../../shared/spining-loader/spining-loader'

@Component({
  selector: 'app-manage-devices',
  imports: [ BackButton, CommonModule, SpiningLoader],
templateUrl: './manage-devices.html',
  styleUrl: './manage-devices.css'
})
export class ManageDevices implements OnInit {
  loading=false;
  devices: any[] = [];
  devicesForManagement: any[] = [];
  deviceName: any[] = [];
  closestDevices: any[] = [];
  @Output() deviceWithLocations: EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(private mainService :MainService, private router:Router) { }

  ngOnInit():void{
    this.getAllDevicesForMap();
    this. existingDeviceCheck() 
  }

  existingDeviceCheck() {
    this.loading=true;
    const userId = localStorage.getItem('userId') || '';
    if (!userId) {
      this.loading=false;
      return
    };

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        
        this.devicesForManagement=data.user.deviceInfo || []
        this.deviceName=this.devicesForManagement.map((names)=>names.name)

      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      },
      complete: () => {
        this.loading=false;
        console.log('Completed fetching existing devices');
      }
    });
  }

getAllDevicesForMap(){
      this.mainService.getAllDevices().subscribe({
        next: (data: any) => { 
          this.devices = data.Devices;    
          const devicesWithLocation = this.devices.filter((device: any) => 
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

          //REturn the closest devices and the distance from the first device by mapping
          this.closestDevices = devicesWithLocation;
         
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
