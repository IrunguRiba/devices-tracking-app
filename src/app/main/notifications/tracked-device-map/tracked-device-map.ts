import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as Leaflet from 'leaflet';
import { Location } from '../../interfaces/location';
import { BackButton } from '../../../shared/back-button/back-button';



@Component({
  selector: 'app-tracked-device-map',
  standalone: true,
  imports: [CommonModule, BackButton],
  templateUrl: './tracked-device-map.html',
  styleUrls: ['./tracked-device-map.css']
})
export class TrackedDeviceMap implements OnInit {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef;

  private map!: Leaflet.Map;
  private currentMarker!: Leaflet.Marker;
  private location: Location | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.location = history.state?.location;

    console.log('Received location:', this.location);

    if (!this.location) {
      console.error('No location received');
      return;
    }

    this.initializeMap(this.location.latitude, this.location.longitude);
    this.addTileLayers();
    this.updateLocation(this.location);
  }

  private initializeMap(lat: number, lng: number): void {
    this.map = Leaflet.map(this.mapContainer.nativeElement, {
      center: [lat, lng],
      zoom: 18,
      zoomControl: true
    });

    setTimeout(() => this.map.invalidateSize(), 0);
  }

  private addTileLayers(): void {
    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }
    ).addTo(this.map);
  }

  private updateLocation(location: Location): void {
    const { latitude, longitude } = location;

    const icon = new Leaflet.Icon({
      iconSize: [50, 41],
      iconAnchor: [25, 41],
      iconUrl: '/location.png'
    });

    this.currentMarker = Leaflet.marker([latitude, longitude], { icon })
      .bindPopup(
        `Last seen at:<br>Lat: ${latitude}, Lng: ${longitude}`
      )
      .addTo(this.map)
      .openPopup();

    Leaflet.circleMarker([latitude, longitude], {
      radius: 25,
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.5,
    }).addTo(this.map);
  }
}
