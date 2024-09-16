import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrScannerComponent } from '../popups/qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent {

  public scannerEnabled: boolean = true;
  public information: string = "";

  constructor(private dialog:MatDialog) {
  }

  ngOnInit() {
  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.information = "";

    /*const appointment = new Appointment($event);
    this.logService.logAppointment(appointment).subscribe(
      (result: OperationResponse) => {
        this.information = $event;
        this.transports = result.object;
        this.cd.markForCheck();
      },
      (error: any) => {
        this.information = "Ha ocurrido un error por favor intentalo nuevamente ... ";
        this.cd.markForCheck();
      }); */
    this.information = $event;
  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.information = "";
  }

  openDialog(){
    this.dialog.open(QrScannerComponent,{}).afterClosed().subscribe((res)=>{
      this.information = res
    })
  }
}