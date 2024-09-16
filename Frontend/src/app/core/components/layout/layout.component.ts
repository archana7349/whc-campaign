import { Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebar:boolean=true;
  @ViewChild("drawer") drawer!:MatDrawer
  @Input() showFooter:boolean = true
  constructor(private router:Router,private authService :AuthService){}
  openRedeemption() {
    this.router.navigate(['redeem']);
  }
  openHome() {
    this.router.navigate(['']);
  }

  logout(){
    this.authService.logout()
  }

}
