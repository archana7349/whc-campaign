import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from '../../../shared/spinner/sprinner.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(public spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.headers.get('loader_flag') !== 'false'){
      this.spinnerService.show();
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    );
    // return next.handle(request);
  }
}
