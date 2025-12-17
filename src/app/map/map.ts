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
  deviceLocations: any[] = [];
  latestLocation!: Location;
  devices: any[] = [];

  private map!: Leaflet.Map;
  private currentMarkers: (Leaflet.Marker | Leaflet.CircleMarker)[] = [];
  private currentPolyline!: Leaflet.Polyline;

  constructor(private mainService: MainService) {}

  ngAfterViewInit(): void {
    this.getAllDevices();
  }

  updateDeviceLocations(devices: any[]) {
    this.deviceLocations = devices.map((d) => {
      const latestLoc = d.location[d.location.length - 1];
      return {
        latitude: latestLoc.latitude,
        longitude: latestLoc.longitude,
        name: d.name,
      };
    });

    console.log('All devices Mapped:', this.deviceLocations);
  }

  getAllDevices() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        console.log('API RESPONSE:', data);

        if (!data.user || !Array.isArray(data.user.deviceInfo)) {
          console.error('Invalid response: deviceInfo missing');
          return;
        }

        this.devices = data.user.deviceInfo.map((device: any) => {
          const location = Array.isArray(device.location) ? device.location : [];
          const firstSeen = location.length > 0 ? location[0].timestamp : null;
          const lastSeen = location.length > 0 ? location[location.length - 1].timestamp : null;

          return {
            name: device.model || device.name || 'Unknown Device',
            status: device.status || 'Unknown',
            firstSeen,
            lastSeen,
            lastUpdated: lastSeen,
            locations: location,
          };
        });

        const deviceWithLocation = this.devices.find((d) => d.locations.length > 0);
        if (deviceWithLocation) {
          this.deviceLocations = deviceWithLocation.locations;
          this.latestLocation =
            deviceWithLocation.locations[deviceWithLocation.locations.length - 1];

          this.initializeMap();
          this.addTileLayers();
          this.drawDeviceOnMap(deviceWithLocation);
        } else {
          console.warn('No device has location to show on the map.');
        }
      },
      error: (err: any) => console.log('Error fetching devices:', err),
    });
  }

  private initializeMap() {
    this.map = Leaflet.map('map', {
      center: [this.latestLocation.latitude, this.latestLocation.longitude],
      zoom: 18,
      zoomControl: true,
    });
  }

  private addTileLayers() {
    const mapTilerLayer = Leaflet.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=j5Ji1JRhCQUrFSHI1dq4',
      { attribution: '© MapTiler © OSM', tileSize: 512, zoomOffset: -1, maxZoom: 20 }
    );
    const osmLayer = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    });

    mapTilerLayer.addTo(this.map);
    Leaflet.control
      .layers({ 'MapTiler Streets': mapTilerLayer, OpenStreetMap: osmLayer })
      .addTo(this.map);
  }

  private drawDeviceOnMap(device: any) {
    if (!device.locations || device.locations.length === 0) return;

    this.currentMarkers.forEach((m) => this.map.removeLayer(m));
    this.currentMarkers = [];
    if (this.currentPolyline) this.map.removeLayer(this.currentPolyline);

    this.deviceLocations = device.locations;
    this.latestLocation = device.locations[device.locations.length - 1];
    const coordinates = device.locations.map(
      (loc: any) => [loc.latitude, loc.longitude] as [number, number]
    );
    this.currentPolyline = Leaflet.polyline(coordinates, {
      color: 'yellow',
      weight: 5,
      opacity: 0.8,
    }).addTo(this.map);
    this.map.fitBounds(this.currentPolyline.getBounds(), { padding: [40, 40] });

    const startIcon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/startLocation.png',
    });
    const startMarker = Leaflet.marker(
      [device.locations[0].latitude, device.locations[0].longitude],
      { icon: startIcon }
    )
      .bindPopup(
        `<b>${device.name}</b><br>At: ${device.locations[0].latitude}, ${device.locations[0].longitude}`
      )
      .addTo(this.map);
    this.currentMarkers.push(startMarker);
    const latestIcon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/location.png',
    });
    const latestMarker = Leaflet.marker(
      [this.latestLocation.latitude, this.latestLocation.longitude],
      { icon: latestIcon }
    )
      .bindPopup(
        `<b>${device.name}</b><br>At: ${this.latestLocation.latitude}, ${this.latestLocation.longitude}`
      )
      .addTo(this.map)
      .openPopup();
    this.currentMarkers.push(latestMarker);
    const circle = Leaflet.circleMarker(
      [this.latestLocation.latitude, this.latestLocation.longitude],
      {
        radius: 25,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        className: 'blinking-circle',
      }
    ).addTo(this.map);
    this.currentMarkers.push(circle);
    this.map.setView([this.latestLocation.latitude, this.latestLocation.longitude], 18);
  }

  goToLocation(device: any) {
    this.drawDeviceOnMap(device);
  }
}
