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

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth', component: Auth },
  { path: 'map', component: Map },
  { path: 'about', component: About},
  {path: 'sign-in', component: SignIn},
  {path: 'main', component: Main,
  children: [
    { path: '', redirectTo: 'devices', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'devices', component: Devices },
    { path: 'add', component: Add },
    { path: 'notifications', component: Notifications },
  ]  
}
];
