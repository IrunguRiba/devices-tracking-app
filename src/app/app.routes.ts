import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Auth } from './auth/auth';
import {Main} from './main/main'
import { Map } from './map/map';
import {Devices} from './main/devices/devices'
import {Dashboard} from './main/dashboard/dashboard'
import {Add} from './main/add/add'
import {Notifications} from './main/notifications/notifications'
import {About} from './home/about/about'
import {SignIn} from './auth/sign-in/sign-in';
import {ManageDevices} from './main/devices/manage-devices/manage-devices';
import {AllMap} from '../app/main/all-map/all-map'
import {CloseDevices} from '../app/main/all-map/close-devices/close-devices'

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth', component: Auth },
  { path: 'map', component: Map },
  { path: 'all-map', component: AllMap },
  { path: 'about', component: About},
  {path: 'sign-in', component: SignIn},
  {path: 'manage-devices', component: ManageDevices},
  {path: 'main', component: Main,
  children: [
    { path: '', redirectTo: 'devices', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'devices', component: Devices },
    { path: 'add', component: Add },
    { path: 'notifications', component: Notifications },
    {path: 'close-devices', component: CloseDevices}
    
  ]  
}
];
