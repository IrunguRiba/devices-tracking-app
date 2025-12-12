import { DeviceInfo } from './device';
import {TrackedDevice} from './trackedDevice'

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    createdAt: string;
    role: string;
    isAdmin: boolean;
    pin?: string;
    token?:string;
    deviceInfo: DeviceInfo[];
    trackedDevices: TrackedDevice[];
    __v?: number;
  }
