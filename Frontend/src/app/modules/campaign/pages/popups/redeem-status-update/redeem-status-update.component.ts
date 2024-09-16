import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-redeem-status-update',
  templateUrl: './redeem-status-update.component.html',
  styleUrls: ['./redeem-status-update.component.scss'],
})
export class RedeemStatusUpdateComponent {
  displayedColumns: string[] = [];
  confirmColumn: string[] = ['name', 'amount', 'upi', 'comment'];
  processedColumn: string[] = ['name', 'amount', 'upi', 'status'];
  activeTable = {
    confirmTable: true,
    processTable: false,
  };
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private RedeemCompRef: MatDialogRef<RedeemStatusUpdateComponent>,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.displayedColumns = this.data?.confirmTable
      ? this.confirmColumn
      : this.processedColumn;
    if (this.data?.confirmTable) {
      this.displayedColumns = this.confirmColumn;
      this.activeTable = { confirmTable: true, processTable: false };
    } else {
      this.displayedColumns = this.processedColumn;
      this.activeTable = { confirmTable: false, processTable: true };
    }
    this.dataSource = new MatTableDataSource([...this.data?.dialogData]);
  }

  addComment(i: number, e: any) {
    this.dataSource.data[i].comment = e?.target?.value;
  }
  closeDialog() {
    this.RedeemCompRef.close({ submit: false });
  }

  confirmProcess() {
    if(this.dataSource.data?.length < 1){
      this.snackbar.open("No transactions found to process","close",{
        duration: 3000
      })
      return
    }
    if(this.dataSource.data?.filter(ele=> (!ele?.comment && ele?.status == "Rejected"))?.length > 0){
      this.snackbar.open("Comment is mandatory","close",{
        duration: 3000
      })
      return
    }
    this.RedeemCompRef.close({ submit: true, data: this.dataSource.data });
  }
}
