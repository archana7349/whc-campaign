import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {

  public scannerEnabled: boolean = true;
  constructor(public dialogRef: MatDialogRef<QrScannerComponent>) { }

  closeDialog(data:string) {
    this.dialogRef.close(data);
  }
  
  public scanSuccessHandler(event: any) {
    this.scannerEnabled = false;
    this.closeDialog(event);
  }

}
