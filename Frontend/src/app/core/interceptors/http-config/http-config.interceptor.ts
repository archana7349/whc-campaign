import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let _token = this.authService.getToken()
    let apiCall = request.clone({
      setHeaders: {
        authorization: `Bearer ${_token}`,
        platform:`Web_Admin_panel`,
      },
      // withCredentials: true,
    });
    return next.handle(apiCall);
  }
}
