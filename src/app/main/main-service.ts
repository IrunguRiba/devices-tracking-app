import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { User } from './interfaces/user';
import { DeviceInfo } from './interfaces/device';
import { NewDevice } from './interfaces/newDevice';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private globalUrl = 'https://tracking-app-backend-g3al.onrender.com/api/getUser';
  constructor(private http: HttpClient) {}

  
  addNewDevice(device: NewDevice, userId: string): Observable<NewDevice> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const addDeviceUrl = `https://tracking-app-backend-g3al.onrender.com/api/devices/registerMyDevice/${userId}`;
    
    if (!token) {
      window.location.href = "https://multi-device-tracking-app-frontend.vercel.app/about";
   return EMPTY;
    }
    return this.http.post<NewDevice>(addDeviceUrl, device, {headers});
  }
  
  getUserById(_id: string): Observable<User> {
  const token= localStorage.getItem('token')
  if (!token) {
    console.log('Token not found');
  }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const getUserByIdUrl = `${this.globalUrl}/${_id}`;

    if (!token) {
      window.location.href = "https://multi-device-tracking-app-frontend.vercel.app/about";
   return EMPTY;
    }
    return this.http.get<User>(getUserByIdUrl, {headers});
  }

  getUserDataByPin(pin: string): Observable<User> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const getUserByPinUrl = `https://tracking-app-backend-g3al.onrender.com/api/getUserByPin/${pin}`;
    if (!token) {
      window.location.href = "https://multi-device-tracking-app-frontend.vercel.app/about";
   return EMPTY;
    }
    return this.http.get<User>(getUserByPinUrl, {headers});
  }

  editDeviceById(deviceId: string, updatedDevice: NewDevice): Observable<NewDevice> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const editDeviceUrl = `https://tracking-app-backend-g3al.onrender.com/api/devices/editDevice/${deviceId}`;
    if (!token) {
      window.location.href = "https://multi-device-tracking-app-frontend.vercel.app/about";
   return EMPTY;
    }
    return this.http.put<NewDevice>(editDeviceUrl, updatedDevice, {headers});
  }


//   PUT: http://localhost:4000/api/devices/updateMyDevice/:_id
// eg: http://localhost:4000/api/devices/updateMyDevice/6918ea4bfae8516b93379e4c


getAllDevices(): Observable<DeviceInfo[]> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const getAllDevicesUrl = `https://tracking-app-backend-g3al.onrender.com/api/devices/getAllDevices`;
    if (!token) {
      window.location.href = "https://multi-device-tracking-app-frontend.vercel.app/about";
   return EMPTY;
    }
    return this.http.get<DeviceInfo[]>(getAllDevicesUrl, {headers});
  }
}
