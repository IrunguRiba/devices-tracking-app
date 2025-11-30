import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { User } from './interfaces/user';
import { DeviceInfo } from './interfaces/device';
import { NewDevice } from './interfaces/newDevice';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private globalUrl='http://localhost:4000/api/getUser';
  
  constructor(private http: HttpClient){}



  addNewDevice(device: NewDevice, userId: string): Observable<NewDevice> {
    console.log("Adding new device:", device);
  
    const addDeviceUrl = `http://localhost:4000/api/devices/registerMyDevice/${userId}`;
    return this.http.post<NewDevice>(addDeviceUrl, device);
  }
  
  getUserById(_id: string): Observable<User> {
    const getUserByIdUrl= `${this.globalUrl}/${_id}`;
    return this.http.get<User>(getUserByIdUrl)
   }

getUserDataByPin(pin: string): Observable<User> {
  const getUserByPinUrl = `http://localhost:4000/api/getUserByPin/${pin}`;
  return this.http.get<User>(getUserByPinUrl);
}

editDeviceById(deviceId: string, updatedDevice: NewDevice): Observable<NewDevice> {
  const editDeviceUrl = `http://localhost:4000/api/devices/editDevice/${deviceId}`;
  return this.http.put<NewDevice>(editDeviceUrl, updatedDevice);
}
}