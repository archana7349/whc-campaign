import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerOverlayComponent } from 'src/app/core/components/spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private overlayRef!: OverlayRef;

  isLoading = 0;

  constructor(private overlay: Overlay) {}

  public show() {
    if (!this.isLoading) {
      if (!this.overlayRef) {
        this.overlayRef = this.overlay.create();
      }
      const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);
      this.overlayRef.attach(spinnerOverlayPortal);
    }
    this.isLoading += 1;
  }

  public hide() {
    if (!!this.overlayRef && this.isLoading) {
      this.overlayRef.detach();
      this.isLoading -= 1;
    }
  }
}
