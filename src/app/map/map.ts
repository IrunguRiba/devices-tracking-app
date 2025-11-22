import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})
export class Map implements AfterViewInit {
  mapMakerPic = 'map-marker.png';
  nearestDevice: string = 'Not found yet';

  constructor(private router: Router) {}

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

    
  }

}
