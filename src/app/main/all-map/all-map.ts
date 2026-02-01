import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Leaflet from 'leaflet';
import { MainService } from '../main-service';
import { Location } from '../interfaces/location';
import { ManageDevices } from '../devices/manage-devices/manage-devices';
import  {CloseDevices} from './close-devices/close-devices';
import { SearchingLoader } from '../../shared/searching-loader/searching-loader';
import { DeviceInfoForChild } from '../interfaces/deviceInterfaceForNotification';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-all-map',
  imports: [CommonModule, ManageDevices,  CloseDevices, SearchingLoader],
templateUrl: './all-map.html',
  styleUrls: ['./all-map.css'] 
})
export class AllMap implements AfterViewInit {

 socket!: Socket;

 

  loading=true
  printIcon='/printer.png'
  showCloseDeviceInfo= false;
  closestDevice: any = null;
  minDistance: number = 0;
  closestDeviceLocation: any = null;
  lat: number = 0;
  long: number = 0;



  request: DeviceInfoForChild = {}
  requestReceiverId:any;
      senderId:any;
  




  handleClosestDevice(event: any) {
    this.loading = true; 
  

    setTimeout(() => {
      const payload = event as { closestDevice: any; distance: number };
      
 
      this.closestDevice = payload.closestDevice;
      this.closestDeviceLocation = payload.closestDevice.location[payload.closestDevice.location.length -1];
      this.lat = this.closestDeviceLocation.latitude;
      this.long = this.closestDeviceLocation.longitude;
      this.minDistance = payload.distance;
      this.showCloseDeviceInfo = true;
      console.log(this.requestReceiverId)

      this.requestReceiverId={
        id:  payload.closestDevice.userId
      }

 

  
  
      this.loading = false; 
    });
  }
  
  

  toggleCloseDeviceInfo() {
    this.showCloseDeviceInfo = !this.showCloseDeviceInfo;
    if (this.showCloseDeviceInfo) {
      console.log("DEVICE INFO OPENED");
    } else {
      console.log("DEVICE INFO CLOSED");
    }
  }
  
  deviceLocations: any[] = [];
  surroundingDevices: any[] = []; 

  latestLocation!: Location;
  devices: any[] = [];

  private map!: Leaflet.Map;
  private currentMarkers: (Leaflet.Marker | Leaflet.CircleMarker)[] = [];
  private currentPolyline!: Leaflet.Polyline;
  private surroundingMarkers: Leaflet.CircleMarker[] = [];

  constructor(private mainService: MainService) {}

  ngAfterViewInit(): void {
    this.getAllDevices();
  }
  updateDeviceLocations(devices: any[]) {
    this.surroundingDevices = devices.map(d => {
      const latestLoc = d.location[d.location.length - 1];
      return {
        latitude: latestLoc.latitude,
        longitude: latestLoc.longitude,
        name: d.name
      };
    });

    if (this.map) this.addAllDeviceMarkers();
  }

  private addAllDeviceMarkers() {
    if (!this.map) return;
    this.surroundingMarkers.forEach(marker => this.map.removeLayer(marker));
    this.surroundingMarkers = [];

    this.surroundingDevices.forEach(device => {
      const marker = Leaflet.circleMarker([device.latitude, device.longitude], {
        radius: 5,
        color: 'black',
        fillColor: 'red',
        fillOpacity: .5,
        
      })
        .bindPopup(`<b>${device.name}</b><br>Lat: ${device.latitude}, Lng: ${device.longitude}`)
        .addTo(this.map);

      this.surroundingMarkers.push(marker);
    });
  }

  getAllDevices() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    this.mainService.getUserById(userId).subscribe({
      next: (data: any) => {
        if (!data.user || !Array.isArray(data.user.deviceInfo)) return;

        this.devices = data.user.deviceInfo.map((device: any) => {
          const locations = Array.isArray(device.location) ? device.location : [];
          return {
            description: device.description || 'No Description',
            name: device.model || device.name || 'Unknown Device',
            model: device.model || 'Unknown Model',
            status: device.status || 'Unknown',
          locations
          
          };
        });

        const firstDevice = this.devices.find(d => d.locations.length > 0);
        if (!firstDevice) return console.warn('No device has location');

        this.deviceLocations = firstDevice.locations;
        this.latestLocation = firstDevice.locations[firstDevice.locations.length - 1];

        this.initializeMap();
        this.addTileLayers();
        this.drawDeviceOnMap(firstDevice);
        this.addAllDeviceMarkers();
      },
      error: (err: any) => console.error('Error fetching devices:', err)
    });
  }

  private initializeMap() {
    this.map = Leaflet.map('map', {
      center: [this.latestLocation.latitude, this.latestLocation.longitude],
      zoom: 14,
      zoomControl: true
    });
  }

  private addTileLayers() {
    const mapTilerLayer = Leaflet.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=j5Ji1JRhCQUrFSHI1dq4',
      { attribution: '© MapTiler © OSM', tileSize: 512, zoomOffset: -1, maxZoom: 22 }
    );
    const osmLayer = Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '© OpenStreetMap contributors' }
    );
    mapTilerLayer.addTo(this.map);
    Leaflet.control.layers({ 'MapTiler Streets': mapTilerLayer, OpenStreetMap: osmLayer }).addTo(this.map);
  }

  private drawDeviceOnMap(device: any) {
    if (!device.locations || device.locations.length === 0) return;
    this.currentMarkers.forEach(m => this.map.removeLayer(m));
    this.currentMarkers = [];
    if (this.currentPolyline) this.map.removeLayer(this.currentPolyline);

    this.deviceLocations = device.locations;
    this.latestLocation = device.locations[device.locations.length - 1];

    const coords = device.locations.map((loc: any) => [loc.latitude, loc.longitude] as [number, number]);
    this.currentPolyline = Leaflet.polyline(coords, { color: 'yellow', weight: 5, opacity: 0.8 }).addTo(this.map);
    this.map.fitBounds(this.currentPolyline.getBounds(), { padding: [40, 40] });

    const startIcon = new Leaflet.Icon({ iconSize: [50, 41], iconAnchor: [25, 41], iconUrl: '/startLocation.png' });
    const startMarker = Leaflet.marker([device.locations[0].latitude, device.locations[0].longitude], { icon: startIcon })
      .bindPopup(`<b>${device.name}</b><br>Start: ${device.locations[0].latitude}, ${device.locations[0].longitude}`)
      .addTo(this.map);
    this.currentMarkers.push(startMarker);

    const latestIcon = new Leaflet.Icon({ iconSize: [50, 41], iconAnchor: [25, 41], iconUrl: '/location.png' });
    const latestMarker = Leaflet.marker([this.latestLocation.latitude, this.latestLocation.longitude], { icon: latestIcon })
      .bindPopup(`<b>${device.name}</b><br>Latest: ${this.latestLocation.latitude}, ${this.latestLocation.longitude}`)
      .addTo(this.map)
      .openPopup();
    this.currentMarkers.push(latestMarker);

    const circle = Leaflet.circleMarker([this.latestLocation.latitude, this.latestLocation.longitude], {
      radius: 25,
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.5,
    }).addTo(this.map);
    this.currentMarkers.push(circle);
  }

  goToLocation(device: any) {
    this.drawDeviceOnMap(device);
    console.log(` Device ${device.name} with Features: ${device.model}, ${device.description}  Last seen at Lat: ${this.latestLocation.latitude}, Lng: ${this.latestLocation.longitude} Request for help to find it` );


    this.socket = io('http://localhost:4000');
   
    this.request={
      name: device.name,
      model: device.model,
      description: device.description,
      latitude: this.latestLocation.latitude,
      longitude: this.latestLocation.longitude

    };
    
    this.socket.emit('send-request',  {requestSender: this.request, requestReceiver:this.requestReceiverId} );
    console.log(this.request);
    console.log(this.requestReceiverId)
    console.log("Help request sent to server via socket.io");
  }



}
