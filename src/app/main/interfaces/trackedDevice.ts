
import { DeviceInfo } from './device';
export interface TrackedDevice {
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
    deviceInfo: DeviceInfo;
    trackedDevices: TrackedDevice[];
    __v?: number;
  }