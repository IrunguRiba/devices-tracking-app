import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Leaflet from 'leaflet';
import { MainService } from './../main/main-service';
import { Location } from '../main/interfaces/location';

@Component({
  selector: 'map',
  templateUrl: './map.html',
  imports: [CommonModule],
  styleUrls: ['./map.css'],
  standalone: true,
})
export class Map implements AfterViewInit {

  deviceLocations: Location[] = [];
  latestLocation!: Location;
  devices: any[] = [];
  lastUpdated: any[] = [];
  name:[] = [];

  private map!: Leaflet.Map;

  constructor(private mainService: MainService) {}

  ngAfterViewInit(): void {
    this.getAllDevices();
  }

  getAllDevices() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log("API RESPONSE:", data);

        if (!data.user || !Array.isArray(data.user.deviceInfo)) {
          console.error("Invalid response: deviceInfo missing");
          return;
        }
        this.devices = data.user.deviceInfo.map((device: any) => {
          const location = Array.isArray(device.location) ? device.location : [];
          const firstSeen = location.length > 0 ? location[0].timestamp : null;
          const lastSeen = location.length > 0 ? location[location.length - 1].timestamp : null;

          return {
            name: device.model || device.name || "Unknown Device",
            status: device.status || "Unknown",
            firstSeen: firstSeen,
            lastSeen: lastSeen,
            lastUpdated: lastSeen,
            locations: location  
          };
        });
        const deviceWithLocation = this.devices.find(d => d.locations.length > 0);
        if (deviceWithLocation) {
          this.deviceLocations = deviceWithLocation.locations;
          this.latestLocation = deviceWithLocation.locations[deviceWithLocation.locations.length - 1];

          this.initializeMap();
          this.addTileLayers();
          this.addDeviceRoute();
          this.addStartLocationMarker();
          this.addLatestLocationMarker();
        } else {
          console.warn("No device has location to show on the map.");
        }
      },
      error: (err: any) => console.log("Error fetching devices:", err)
    });
  }

  private initializeMap() {
    this.map = Leaflet.map('map', {
      center: [this.latestLocation.latitude, this.latestLocation.longitude],
      zoom: 18,
      zoomControl: true
    });
  }

  private addTileLayers() {
    const mapTilerLayer = Leaflet.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=j5Ji1JRhCQUrFSHI1dq4',
      {
        attribution: '© MapTiler © OSM',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 20
      }
    );
    const osmLayer = Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }
    );
    mapTilerLayer.addTo(this.map);
    Leaflet.control.layers({
      "MapTiler Streets": mapTilerLayer,
      "OpenStreetMap": osmLayer
    }).addTo(this.map);
  }

  private addDeviceRoute() {
    const coordinates = this.deviceLocations.map(
      loc => [loc.latitude, loc.longitude] as [number, number]
    );

    const polyline = Leaflet.polyline(coordinates, {
      color: 'yellow',
      weight: 5,
      opacity: 0.8
    }).addTo(this.map);

    this.map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }

  private addStartLocationMarker() {
    const start = this.deviceLocations[0];
    const deviceName = this.devices.length > 0 ? this.devices[0].name : "Unknown Device";

    const startIcon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/startLocation.png'
    });

    Leaflet.marker([start.latitude, start.longitude], { icon: startIcon })
      .bindPopup(`<b>${deviceName}</b><br>At: ${start.latitude}, ${start.longitude}`)
      .addTo(this.map);
  }

  private addLatestLocationMarker() {
    const latest = this.latestLocation;
    const deviceName = this.devices.length > 0 ? this.devices[0].name : "Unknown Device";

    const icon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/location.png'
    });

    Leaflet.marker([latest.latitude, latest.longitude], { icon })
      .bindPopup(`<b>${deviceName}</b><br>At: ${latest.latitude}, ${latest.longitude}`)
      .addTo(this.map)
      .openPopup();

    Leaflet.circleMarker([latest.latitude, latest.longitude], {
      radius: 25,
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.5,
      className: 'blinking-circle'
    }).addTo(this.map);
  }

  goToLocation(device: any) {
    if (device.locations && device.locations.length > 0) {
      const latest = device.locations[device.locations.length - 1];
      this.map.setView([latest.latitude, latest.longitude], 18);
    }
  }
}
