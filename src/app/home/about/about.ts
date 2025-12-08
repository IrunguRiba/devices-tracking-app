import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../map/location-service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})

export class About implements OnInit {
  constructor(private router: Router, private locationService: LocationService) {}


  ngOnInit(){
this.locationService.onIdentifyButtonClick()
}

  goToAuth(){
    this.router.navigate(['/sign-in']);
    console.log('Home button clicked');
  }


  popUpAbout(){

  }

  popUpLocation(){

  }

  popUpManage(){

  }

  popUpLostDevice(){

  }

  popUpTrack(){

  }
  popUpPrivacy(){
    
  }
}
