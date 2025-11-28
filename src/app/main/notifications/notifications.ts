import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainService } from '../main-service';
import { User } from '../interfaces/user';
import { Devices } from '../devices/devices';
import { Location } from '../interfaces/location';
import { LocationService } from './../../map/location-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit{
  
  latestLocation:any | null=null;
userLatestLocation:Location | null=null;
  locationPic='/location.png';
  trackingDevices:any[]=[];
  profilePic = '/user.png';
  pin: string = '';
  pinBoxes: string[] = ['', '', '', '', '', ''];
  expandProfile: boolean = false;
  numberOfDevices: Number = 0;
  user!: User;
  location: any;
sharePic='/share.png';
showTrackSection = false;
  constructor(private mainService: MainService, private locationService: LocationService, private router:Router) {}
 

  ngOnInit(): void {
    const userId = localStorage.getItem('userId')!; // ! used since The user id MUST be there after signin and that it will be passed

    this.onGetDashInformation(userId);

    this.locationService.watchLocationOnInit(userId)
  }
  
  onGetDashInformation(_id: string): void {
    this.mainService.getUserById(_id).subscribe(
      (response: any) => {
        console.log("User found AFTER SIGN IN",response);
        this.user = response.user;
        if (response.LatestLocation && response.LatestLocation.length > 0) {
          const latest = response.LatestLocation[0];
          this.latestLocation = `Lat: ${latest.latitude}, Lon: ${latest.longitude}`;
        } else {
          this.latestLocation = 'No location available';
        }
  
        console.log('Latest Location:', this.latestLocation);
      },

      (error: any) => {
        console.log(error);
      },
      () => console.log('complete')
    );
  }
  showPinInput = false;

  moveNext(event: any, index: number) {
  const input = event.target as HTMLInputElement;
  const next = input.nextElementSibling as HTMLInputElement | null;
  if (input.value && next) {
    next.focus();
  }
}

movePrev(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const prev = input.previousElementSibling as HTMLInputElement | null;
  if (event.key === 'Backspace' && !input.value && prev) {
    prev.focus();
  }
}


  updatePin(event: any, index: number) {
    const value = event.target.value;
      this.pinBoxes[index] = value;
    this.pin = this.pinBoxes.join('');
    console.log('PIN:', this.pin);
  
    const next = event.target.nextElementSibling as HTMLInputElement | null;
    if (value && next) next.focus();
  }

  onEnterPin(){
    if (this.pin.length !== 6) {
      console.warn('Please enter a valid 6-digit PIN');
    
      return;
    }
  this.mainService.getUserDataByPin(this.pin).subscribe({

    next: (user:any)=>{
      console.log('User found by PIN:', user);

      if (!user.User || !user.User) {
        console.warn('No user found for this PIN');
        return;
      }
      const existingUser = this.trackingDevices.some(
        (alreadyAddedUser: any) => alreadyAddedUser.User._id === user.User._id
      );
      if (existingUser) {
        console.log(`User ${user.User.userName} already tracked:, `);
        return;
        
      } else {
        this.trackingDevices.push(user);
        const userLatestLocation = user.LatestLocation || null;
        console.log('User Latest Location:', userLatestLocation);
        console.log('Tracking Devices:', this.trackingDevices);
        localStorage.setItem('trackingDevices', JSON.stringify(this.trackingDevices));
      }
          },
   error: (error:any)=>{
    console.log("Error fetching user", error)

  
  },
  complete: () =>{
     console.log('Request complete')
     
    }

})
 
}

openAdvancedTracking(){
  this.showTrackSection = !this.showTrackSection;
}
goToDevices(){
  this.router.navigate(['/main/devices']);
}

}
