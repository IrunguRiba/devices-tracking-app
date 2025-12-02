import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    console.log("Adding new device:", device);
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const addDeviceUrl = `https://tracking-app-backend-g3al.onrender.com/api/devices/registerMyDevice/${userId}`;
    return this.http.post<NewDevice>(addDeviceUrl, device, {headers});
  }
  
  getUserById(_id: string): Observable<User> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const getUserByIdUrl = `${this.globalUrl}/${_id}`;
    return this.http.get<User>(getUserByIdUrl, {headers});
  }

  getUserDataByPin(pin: string): Observable<User> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const getUserByPinUrl = `https://tracking-app-backend-g3al.onrender.com/api/getUserByPin/${pin}`;
    
    return this.http.get<User>(getUserByPinUrl, {headers});
  }

  editDeviceById(deviceId: string, updatedDevice: NewDevice): Observable<NewDevice> {
    const token= localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const editDeviceUrl = `https://tracking-app-backend-g3al.onrender.com/api/devices/editDevice/${deviceId}`;
    return this.http.put<NewDevice>(editDeviceUrl, updatedDevice, {headers});
  }


//   PUT: http://localhost:4000/api/devices/updateMyDevice/:_id
// eg: http://localhost:4000/api/devices/updateMyDevice/6918ea4bfae8516b93379e4c


}
