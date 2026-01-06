import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainService } from './../main-service';
import { LocationService } from './../../map/location-service';
import {SpiningLoader} from '../../shared/spining-loader/spining-loader'

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SpiningLoader],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  loading=false;
  uploadPic = '/camera.png';
  name: any[] = [];
  model: any[] = [];
  devices: any[] = [];
  imageSrc: string | null = null;

  constructor(
    private router: Router,
    private mainService: MainService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.locationService.onIdentifyButtonClick()
    this.getAllDevices();
    this.locationService.watchLocationOnInit('');
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string;
      localStorage.setItem('profilePic', this.imageSrc);
    };
    reader.readAsDataURL(file);
  }

  getAllDevices() {
    this.loading=true
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      this.loading=false
      return;
    }

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        

        if (!data.user || !data.user.deviceInfo) {
          console.error('Invalid response: deviceInfo missing');
          return;
        }

        this.devices = data.user.deviceInfo.map((device: any) => {
          this.name.push(device.name || 'Unknown Device');
          this.model.push(device.model || 'Unknown Model');

          return {
            name: device.model || device.name || 'Unknown Device',
            model: device.model || 'Unknown Model',
          };
        });
      },
      error: (err: any) => {
        console.error('Error fetching devices:', err)
      
    },
    complete: ()=>{
this.loading=false
    }
    });
  }
}
