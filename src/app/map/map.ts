import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { LocationService } from '../map/location-service';
import {Device } from '../main/interfaces/device';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})
export class Map implements AfterViewInit {
  mapMakerPic = 'map-marker.png';
  nearestDevice: string = 'Not found yet';
  deviceLocation: any; // store location info here if needed

  constructor(private router: Router, private locationService: LocationService) {}

  getDeviceLocation(device: Device) {
    this.locationService.getLocation(device).subscribe(
      (deviceData:any) => {
        console.log("Device Location from Map Component", deviceData);
        this.deviceLocation = deviceData.location; // save location array
      },
      (error:any) => {
        console.error("Error getting device location in Map Component", error);
      },
      () => {
        console.log("Completed getting device location in Map Component");
      }
    );
  }

  ngAfterViewInit(): void {
    const map = L.map('map').setView([0.0236, 37.9062], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: this.mapMakerPic,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });

    // Example of adding a marker if you have deviceLocation
    // You would call getDeviceLocation first to fetch it
    // if (this.deviceLocation) {
    //   this.deviceLocation.forEach(loc => {
    //     L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
    //   });
    // }
  }
}
