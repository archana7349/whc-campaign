import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router,private authService:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(catchError((error:HttpErrorResponse)=>{
      if(error.status == 401 || error.status == 403 || error.status == 440  ){
        //When session timeout or unauthorized
        this.logout();
      }
      return throwError(()=>error)
    }));
  }

  logout(){
    this.authService.setAuthStatus(null);
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate([""]);
    window.location.reload();
  }
}
