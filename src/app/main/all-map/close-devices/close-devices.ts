import { Component, OnInit } from '@angular/core';
import {MainService} from '../../main-service'

@Component({
  selector: 'app-close-devices',
  imports: [],
  templateUrl: './close-devices.html',
  styleUrl: './close-devices.css'
})
export class CloseDevices implements OnInit{
  
 devices: any[]=[]
 myDevices: any[]=[]
 allDeviceLocations: any[]=[]
 myDeviceLocations: any[]=[]


  constructor(private mainService: MainService){}


ngOnInit():void{
  this.closeDevices()
  this.registeredDevices()
}

registeredDevices(){
  const userId = localStorage.getItem('userId') || '';
  if (!userId) {
    return;
  }

  this.mainService.getUserById(userId).subscribe({
    next: (data: any) => {
      this.myDevices=data.user.deviceInfo || []
    let location=this.myDevices.filter((device)=>device.location.length>0).map((devices)=>{
      return devices.location[devices.location.length-1]
    }).map((loc:any)=>{
      return {longitude: loc.longitude, latitude: loc.latitude}
    })
      this.myDeviceLocations=location
      console.log(this.myDeviceLocations)
    },
    error: (error: any) => {
      console.error('Error fetching user data:', error);
    },
    complete: () => {
      console.log('Completed fetching user devices');
    }
  });
}

  closeDevices(){
    this.mainService.getAllDevices().subscribe({

      next: (data:any)=>{
        
        this.devices=data.Devices
        let locationAvailableDevices=this.devices?.filter((device)=>{
          if(device.location.length>1){
              return device
          }
        }).map((device)=>{
        return device.location[device.location.length-1]
        }).map((loc:any)=>{
          return {longitude: loc.longitude, latitude: loc.latitude}
        })
       
       this.allDeviceLocations=locationAvailableDevices
       console.log(this.allDeviceLocations)
      },
      error: (error:any)=>{
        console.log("Something went wrong", error)
      },
      complete: ()=>{
        console.log('complete')
      }
    })
  }

}
