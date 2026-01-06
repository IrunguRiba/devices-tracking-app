import { Component, OnInit } from '@angular/core';
import {MainService} from '../main-service'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {SpiningLoader} from '../../shared/spining-loader/spining-loader'
@Component({
  selector: 'app-add',
  imports: [CommonModule, SpiningLoader],
templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class Add implements OnInit{

  loading=false;

  userInfo: any={}
 
  constructor(private mainService:MainService, private router: Router){}

ngOnInit():void{


this.getUserInfo()


}

getUserInfo(){
  this.loading=true
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      this.loading = false;
      return;
    }
    



    this.mainService.getUserById(userId).subscribe({
      
      next: (data: any) => {
        console.log("loading...")
       
        this.userInfo=data.user
      },
        error: (error: any)=>{
          this.loading = false;
console.log(error)
        }, 

      complete: ()=>{
        this.loading=false
        console.log("User profile retrieved")
      
    }
      
        });

}

logout(){
this.router.navigate(['/about'])
}
}
