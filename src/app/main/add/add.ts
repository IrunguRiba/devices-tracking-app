import { Component, OnInit } from '@angular/core';
import {MainService} from '../main-service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  imports: [CommonModule],
templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class Add implements OnInit{

  userInfo: any={}
 
  constructor(private mainService:MainService){}

ngOnInit(){
this.getUserInfo()
}

getUserInfo(){
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log("User Profile:", data);

        this.userInfo=data.user
      },
        error: (error: any)=>{
console.log(error)
        }, 

      complete: ()=>{console.log("User profile retrieved")}
        });

}
}
