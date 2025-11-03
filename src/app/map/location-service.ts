import { Injectable, signal } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { User } from '../main/interfaces/user';
import {Observable} from 'rxjs'
import { MainService } from './../main/main-service';



@Injectable({
  providedIn: 'root'
})
export class LocationService  {

 

  private socket: Socket;
  constructor(private mainService: MainService) { 
    this.socket = io('https://tracking-app-3.onrender.com/');
  } 
  
  protected map=signal("Waiting for user Location");


 


// getCurrentLocation():void{
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       const userId='68ee531c68129af1a7b5fa27'; 
//       const deviceId='68f3ffc0e2ad681f848d748b'
//       this.map.set(`Latitude: ${latitude}, Longitude: ${longitude}`);
//       console.log(this.map());

//       if(this.socket){
//         this.socket.emit('coordinates', { latitude, longitude, userId, deviceId });
//        console.log(`Emitted coordinates: Latitude: ${latitude}, Longitude: ${longitude}, UserId: ${userId}, DeviceId: ${deviceId}`);
//       }
//     }, (error) => {
//       console.error('Error getting location:', error);
//     });
//   } else {
//     console.error('Geolocation is not supported by this browser.');
//   }
// }




watchLocationOnInit(_id:string):void{

  
 const storedUser=localStorage.getItem('user')!
 console.log(localStorage.getItem('user'));

 if (!storedUser) {
  console.error("No user stored in localStorage");
  return;
}

    this.mainService.getUserById(_id).subscribe(
      
      (user: any) => {

        
        console.log("User found for location",user);
        
  const userId = user.user._id;
  console.log("User ID for location tracking:", userId);

  const deviceId = user.user.deviceInfo?._id || 'No Device Found! Register a Device';


  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this device.');
    return;
  }
    navigator.geolocation.watchPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.map.set(`Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log(this.map());

      if(this.socket){
        this.socket.emit('coordinates', { latitude, longitude, userId, deviceId });
       console.log(`Emitted coordinates: Latitude: ${latitude}, Longitude: ${longitude}, UserId: ${userId}, DeviceId: ${deviceId}`);
      }
    }, (error) => {
      console.error('Error watching location changes:', error);
    },
    
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
},

      (error: any) => {
        console.log(error);
      },
      () => console.log('complete')
    );
}
}