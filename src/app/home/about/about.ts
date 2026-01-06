import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../map/location-service';
import { BackButton } from '../../shared/back-button/back-button';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, BackButton],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About implements OnInit {

  trackbypin='/trackbypin.png';
  realtimetrack='/realtimetrack.png';
  privacy='/privacy.png';
  manage='/manage.png';
  livelocation='/livelocation.png';
  about='/about.png';

  activePopup: string | null = null;

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationService.onIdentifyButtonClick();
  }

  goToAuth(): void {
    this.router.navigate(['/sign-in']);
  }

  closePopup(): void {
    this.activePopup = null;
  }

  togglePopup(name: string): void {
    this.activePopup = this.activePopup === name ? null : name;
  }

  popUpAbout() { this.togglePopup('about'); }
  popUpLocation() { this.togglePopup('location'); }
  popUpManage() { this.togglePopup('manage'); }
  popUpLostDevice() { this.togglePopup('lost'); }
  popUpTrack() { this.togglePopup('track'); }
  popUpPrivacy() { this.togglePopup('privacy'); }
}
