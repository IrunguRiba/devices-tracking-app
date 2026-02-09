import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Leaflet from 'leaflet';
import { Location } from '../../interfaces/location';

@Component({
  selector: 'app-tracked-device-map', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracked-device-map.html',  
  styleUrls: ['./tracked-device-map.css']
})
export class TrackedDeviceMap implements OnChanges {
  @Input() trackedUserLatestLocation: Location | null = null; 

  private map!: Leaflet.Map;
  private currentMarker!: Leaflet.Marker;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trackedUserLatestLocation'] && this.trackedUserLatestLocation) {
      const { latitude, longitude } = this.trackedUserLatestLocation;
      console.log(`Updated Lat: ${latitude}, Lng: ${longitude}`);
      if (!this.map) {
        this.initializeMap(latitude, longitude);
        this.addTileLayers();
      }
      this.showLatestLocation(latitude, longitude);
    }
  }

  private initializeMap(lat: number, lng: number) {
    this.map = Leaflet.map('map', {
      center: [lat, lng],
      zoom: 18,
      zoomControl: true
    });
  }

  private addTileLayers() {
    const osmLayer = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });
    osmLayer.addTo(this.map);
  }

  private showLatestLocation(lat: number, lng: number) {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    const icon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/location.png'  
    });

    this.currentMarker = Leaflet.marker([lat, lng], { icon })
      .bindPopup(`Last seen at:<br>Lat: ${lat}, Lng: ${lng}`)
      .addTo(this.map)
      .openPopup();

    Leaflet.circleMarker([lat, lng], {
      radius: 25,
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.5,
      className: 'blinking-circle'
    }).addTo(this.map);

    this.map.setView([lat, lng], 18);
  }
}
