import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
export interface UserResFull {
  id: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  active: boolean;
  mobile_number:string;
  user_role:string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authDetails = new BehaviorSubject<UserResFull | null>(null);
  
  constructor(private router : Router) { 
    if (!this.authDetails.value) {
      const detailsStr = sessionStorage.getItem("authDetails");
      if (detailsStr) {
        const details = JSON.parse(detailsStr) as UserResFull;
        this.authDetails.next(details);
      }
    }
    this.getToken();
  }

  getAuthStatus(): UserResFull | null {
    return this.authDetails.value;
  }

  setAuthStatus(details: UserResFull | null) {
    this.authDetails.next(details);
    if (details) {
      sessionStorage.setItem("authDetails", JSON.stringify(details));
      const detailsStr = sessionStorage.getItem("authDetails");
      if (detailsStr ) {
        const details = JSON.parse(detailsStr);
        const token = details.token;
        sessionStorage.setItem("token",JSON.stringify(token));
        sessionStorage.setItem("authDetails",JSON.stringify(details));
    } else {
      sessionStorage.removeItem("authDetails");
    }
  }
  }

  getToken(){
    let token = sessionStorage?.getItem('token');
    if (token) {
      token = JSON.parse(token);
    }
    return token
  }

  logout(){
    this.setAuthStatus(null);
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  }
}
