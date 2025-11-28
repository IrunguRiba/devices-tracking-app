import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MainService } from './main-service';
import {CommonModule} from  '@angular/common';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { BackButton } from '../shared/back-button/back-button';



@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLinkActive, RouterLink, CommonModule, BackButton],
templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit{
  profilePic = '/user.png';
dashPic='/dashboard.png';
notificationPic='/message.png';
devicePic='/responsive.png';

user!:User
latestLocation: Location | null= null;

  constructor(private mainService: MainService, private router: Router){}


  ngOnInit():void{
    const userId = localStorage.getItem('userId')!; // ! used since The user id MUST be there after signin and that it will be passed
      this.onGetDashInformation(userId);
  }


  onGetDashInformation(_id: string):void{
  this.mainService.getUserById(_id).subscribe(
     (response:any)=>{
      console.log("User found for profile...", response)
      this.user = response.user;
      this.latestLocation = response.LatestLocation[0] || null;
    },
  
   (error:any)=>{console.log(error)},
    ()=>console.log("complete")
  )
  }
 

}
