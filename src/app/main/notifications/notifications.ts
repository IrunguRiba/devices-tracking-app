import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainService } from '../main-service';
import { User } from '../interfaces/user';

import { Location } from '../interfaces/location';
import { LocationService } from './../../map/location-service';
import { Router } from '@angular/router';
import {Socket, io} from 'socket.io-client';
import { NgOtpInputComponent } from 'ng-otp-input';
import {TrackedDeviceMap} from './tracked-device-map/tracked-device-map'

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, NgOtpInputComponent, TrackedDeviceMap],

templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit{

  showNotification=false;
  notificationTimer: any;
  socket!: Socket;
  latestNotification: any=[];
  latestLocation:any | null=null;
userLatestLocation:Location | null=null;
  locationPic='/location.png';
  trackingDevices:any[]=[];
  profilePic = '/user.png';
  pin: string = '';
  expandProfile: boolean = false;
  numberOfDevices: Number = 0;
  user!: User;
  location: any;
sharePic='/share.png';
locationForChild:Location | null=null;
goToMapClosure: (() => void) | null = null;


showTrackSection = false;
  constructor(private mainService: MainService, private locationService: LocationService, private router:Router) {}
 
  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      width: '2.7rem',
      height: '2.7rem',
      color: 'white',
      background: 'transparent',
      border: '2px solid rgba(75, 167, 22, 0.5)',
      borderRadius: '0.75rem',
      fontSize: '1.6rem',
      fontWeight: '500',
      transition: 'all 0.25s ease'
    }
    
  };
  
 onOtpChange(otp: string) {
  this.pin = otp;
  console.log('OTP entered:', this.pin);
}
  
  ngOnInit(): void {
    this.receivedNotification()
    const userId = localStorage.getItem('userId')!; // ! used since The user id MUST be there after signin and that it will be passed

    this.locationService.watchLocationOnInit(userId)
  
  }


  
  
  onEnterPin() {
    if (this.pin.length !== 6) {
      console.warn('Please enter a valid 6-digit PIN');
      return;
    }
  
    this.mainService.getUserDataByPin(this.pin).subscribe({
      next: (user: any) => {
        if (!user?.User) {
          console.warn('No user found for this PIN');
          return;
        }
        this.trackingDevices = [user];
        console.log('Tracking device added:', user);
        if (user?.User?.deviceInfo?.length) {
          const device = user.User.deviceInfo[0]; 
          if (device.location?.length) {
            const latestLocation = device.location.reduce((latest:any, current:any) => {
              return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
            }, device.location[0]);
        
            const { latitude, longitude } = latestLocation;
          
            this.userLatestLocation = { latitude, longitude };      
            
           
            this.goToMapClosure = () => {
              if (!this.userLatestLocation) return;
              this.locationForChild = this.userLatestLocation;
              console.log("Location for child", this.locationForChild);
              setTimeout(()=>{
                this.router.navigate(['tracked-device-location'])
              }, 2000)
            };          
          
          }
        }
      },
      error: (err:any) => console.error(err),
      complete: () => console.log('Tracking device replaced')
    });
  }




openAdvancedTracking(){
  this.showTrackSection = !this.showTrackSection;
}
goToDevices(){
  this.router.navigate(['/main/devices']);
}


receivedNotification() {
  this.socket = io('https://tracking-app-backend-g3al.onrender.com');

  this.socket.on('receivedNotification', (data: any) => {
    this.latestNotification.push(data);
    this.showNotification = true;

    clearTimeout(this.notificationTimer);

    this.notificationTimer = setTimeout(() => {
      this.showNotification = false;
    }, 10000);
  });
}

}
