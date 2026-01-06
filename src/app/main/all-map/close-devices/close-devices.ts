import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from '../../main-service';

@Component({
  selector: 'app-close-devices',
  templateUrl: './close-devices.html',
  styleUrls: ['./close-devices.css']
})
export class CloseDevices implements OnInit {

  devices: any[] = [];
  myDevices: any[] = [];

  allDeviceLocations: any[] = [];
  myDeviceLocations: any[] = [];
  @Output() closeDevicesEvent = new EventEmitter<{ closestDevice: any; distance: number }>();


  private calculated = false; 

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.loadMyDevices();
    this.loadAllDevices();
  }
  loadMyDevices() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        this.myDevices = data?.user?.deviceInfo || [];

        this.myDeviceLocations = this.myDevices.filter(
          data => Array.isArray(data.location) && data.location.length > 0
        );
        this.tryCalculateClosest();
      },
      error: (err:any) => console.error('User devices error:', err)
    });
  }
  loadAllDevices() {
    this.mainService.getAllDevices().subscribe({
      next: (data: any) => {
        this.devices = data?.Devices || [];

        this.allDeviceLocations = this.devices.filter(
          data => Array.isArray(data.location) && data.location.length > 0
        );
        this.tryCalculateClosest();
      },
      error: (err:any) => console.error('All devices error:', err)
    });
  }
  tryCalculateClosest() {
    if (
      !this.calculated &&
      this.myDeviceLocations.length > 0 &&
      this.allDeviceLocations.length > 0
    ) {
      this.calculated = true;
      this.findClosestDevices();
    }
  }
  findClosestDevices() {
    for (const myDevice of this.myDeviceLocations) {

      const myLoc = this.getLatestLocation(myDevice);
      if (!myLoc) continue;

      let closestDevice: any = null;
      let minDistance = Infinity;

      for (const otherDevice of this.allDeviceLocations) {

        if (myDevice._id === otherDevice._id) continue;

        const otherLoc = this.getLatestLocation(otherDevice);
        if (!otherLoc) continue;

        const distance = this.calculateDistance(
          myLoc.latitude,
          myLoc.longitude,
          otherLoc.latitude,
          otherLoc.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestDevice = otherDevice;
        }
      }

      if (closestDevice) {
        console.log(
          this.closeDevicesEvent.emit({closestDevice, distance: minDistance}),

        );
      } else {
        console.log(`No nearby device found for ${myDevice.name}`);
      }
    }
  }
  getLatestLocation(device: any) {
    const loc = device.location?.[device.location.length - 1];
    if (!loc?.latitude || !loc?.longitude) return null;
    return loc;
  }

  //This formula is explained here https://www.movable-type.co.uk/scripts/latlong.html

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
}
