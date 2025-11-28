import { Injectable, signal } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import {DeviceInfo } from '../main/interfaces/device';
import {Observable} from 'rxjs'
import { MainService } from './../main/main-service';



@Injectable({
  providedIn: 'root'
})
export class LocationService  {


  private socket: Socket;
  constructor(private http:HttpClient, private mainService: MainService) { 
    this.socket = io('https://tracking-app-3.onrender.com/');
  } 
  
  protected map=signal("Waiting for user Location");
  
 getLocation(device:DeviceInfo ):Observable<DeviceInfo>{
  console.log("Getting Location from Service",);
  return this.http.get<DeviceInfo>(`https://tracking-app-3.onrender.com/api/devices/getMyDeviceInfo/${device._id}`);
 }


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
 const userId=localStorage.getItem('userId')!


    this.mainService.getUserById(userId).subscribe(
      
      (user: any) => {
        console.log("User found for location",user);
        
  console.log("User ID for location tracking:", userId);
  const devices = user.user.deviceInfo || [];

  if (devices.length === 0) {
    console.warn('No devices found for this user. Please register a device.');
    return; 
  }
  const deviceId = devices[0]._id;
  
  console.log("Tracking Device ID:", deviceId);
  

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