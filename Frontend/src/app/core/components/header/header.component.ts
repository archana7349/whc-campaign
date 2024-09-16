import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ADMIN } from 'src/app/shared/constant/constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() toggleDrawerEvent = new EventEmitter<void>();
  Admin = ADMIN;
  loggedIn = this.authService.getAuthStatus();
  constructor(private router: Router, private authService: AuthService) {}
  openRedeemption() {
    this.router.navigate(['redeem']);
  }
  openHome() {
    this.router.navigate(['']);
  }

  logout() {
    this.authService.logout();
  }

  openOutlet() {
    this.router.navigate(['admin/upload-outlet']);
  }
  openBranch() {
    this.router.navigate(['admin/update-outlet']);
  }

  toggleDrawer(event: Event) {
    this.toggleDrawerEvent.emit();
    console.log(this.toggleDrawerEvent);
  }
}
