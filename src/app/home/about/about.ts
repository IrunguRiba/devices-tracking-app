import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  constructor(private router: Router) {}

  goToAuth(){
    this.router.navigate(['/sign-in']);
    console.log('Home button clicked');
  }

}
