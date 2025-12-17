import { Injectable, signal } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { DeviceInfo } from '../main/interfaces/device';
import { Observable } from 'rxjs';
import { MainService } from './../main/main-service';
import { ExtendedGetResult, FingerprintjsProAngularService, GetResult } from '@fingerprintjs/fingerprintjs-pro-angular';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private socket: Socket;
  protected map = signal("Waiting for user Location");

  visitorId: string | null = null; 
  extendedResult: null | ExtendedGetResult | GetResult = null;

  constructor(
    private http: HttpClient, 
    private mainService: MainService,  
    private fingerprintService: FingerprintjsProAngularService
  ) { 
    this.fingerprintService.getVisitorData().catch((error: any) => {
      console.error('Error initializing FingerprintJS Pro:', error);
    });

    const token = localStorage.getItem('token');
    this.socket = io('https://tracking-app-backend-g3al.onrender.com/',{
      auth: { token }
    });
  } 
  async onIdentifyButtonClick(): Promise<void> {
    try {
      const data = await this.fingerprintService.getVisitorData();
      this.visitorId = data.visitorId;
      this.extendedResult = data;

      if (!this.visitorId) {
        window.alert("Please disable your ad blocker to continue.");
        return; 
      }

      console.log('Visitor ID saved:', this.visitorId);
      localStorage.setItem('visitorId', this.visitorId);

    } catch (error) {
      console.error('Error fetching visitor data:', error);
    }
  }
  getLocation(device: DeviceInfo): Observable<DeviceInfo> {
    console.log("Getting Location from Service");
    const token = localStorage.getItem('token');
    return this.http.get<DeviceInfo>(
      `https://tracking-app-3.onrender.com/api/devices/getMyDeviceInfo/${device._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
  watchLocationOnInit(_id: string): void {
    const userId = localStorage.getItem('userId')!;
    
    this.mainService.getUserById(userId).subscribe({
      next: (user: any) => {
        console.log("User found for location", user);

        const devices = user.user.deviceInfo || [];
        if (devices.length === 0) {
          console.warn('No devices found for this user. Please register a device.');
          return;
        }

        if (!navigator.geolocation) {
          console.error('Geolocation is not supported by this device');
          return;
        }
        devices.forEach((device: any) => {
          const deviceId = device._id;

          navigator.geolocation.watchPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              this.map.set(`Latitude: ${latitude}, Longitude: ${longitude}`);
              console.log(this.map());

              if (this.socket) {
                this.socket.emit('coordinates', { 
                  latitude, 
                  longitude, 
                  userId, 
                  deviceId, 
                  visitorId: this.visitorId || localStorage.getItem('visitorId') 
                });
                console.log(`Emitted coordinates: Latitude: ${latitude}, Longitude: ${longitude}, UserId: ${userId}, DeviceId: ${deviceId}, visitorId: ${this.visitorId}`);
              }
            },
            (error) => console.error('Error watching location changes:', error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
          );
        });
      },
      error: (err: any) => console.error(err),
      complete: () => console.log('Location tracking initialized')
    });
  }
}
