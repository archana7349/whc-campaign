import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import {
  ADMIN,
  ITEMS_PER_PAGE,
  PAGE_LIMIT,
  SKIP_PAGE,
} from 'src/app/shared/constant/constant';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RedeemStatusUpdateComponent } from '../popups/redeem-status-update/redeem-status-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
})
export class AdminReportsComponent {
  authDetails = this.authService.getAuthStatus();
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  otpSuccessDisplayedColumns: string[] = ['mobile', 'otp', 'createdAt'];
  otpFailerDisplayedColumns: string[] = ['mobile', 'otp', 'createdAt'];
  otpActiveDisplayedColumns: string[] = ['mobile', 'otp', 'createdAt'];
  payoutDisplayedColumns: string[] = [
    'amount',
    'status',
    'mobile',
    'createdAt',
    'updatedAt',
    'updatedBy',
    'comment'
  ];
  loginSuccessDisplayedColumns: string[] = [
    'mobile',
    'createdAt',
    'ip',
    'updatedAt',
  ];
  couponClaimedDisplayedColumns: string[] = [
    'series',
    'coupon',
    'iot',
    'amount',
    'model',
    'claimed',
    'createdAt',
    'updatedAt',
  ];
  usersDisplayedColumns: string[] = [
    'mobile',
    'role',
    'bonus',
    'point_redeemed',
    'points_earned',
    'createdAt',
    'ip',
    'updatedAt',
    'pointsBalace',
  ];

  sloganDisplayedColumns: string[] = [
    'booklet',
    'name',
    'email',
    'mobile',
    'branch',
    'outlet',
    'dateOfpuchase',
    'model',
    'purchasePrice',
    'invoiceUrl',
    'iot',
    'value',
    'comment',
    'ip',
  ];

  redeemRequestDisplayedColumns: string[] = [
    'action',
    'name',
    'mobile',
    'amount',
    'upiId',
    'createdAt',
    'email',
  ];

  activeTable: any = {
    'otp-success': true,
    'login-success': true,
    'otp-failure': true,
    'otp-active': true,
    slogan: true,
    users: true,
    payout: true,
    'redemption-request': true,
  };

  reportType: string = 'slogan';

  pageLimit: number = PAGE_LIMIT;

  skipPage: number = SKIP_PAGE;

  totalLength!: number;

  filterData: any = {
    max:true
  };

  reportData: any = [];

  selection = new SelectionModel<any>(true, []);

  transactionStatus:string = "All";


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _location: Location,
    private authService: AuthService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.setActiveTable();
  }

  changeStatus(){
    this.filterData.status = this.transactionStatus == 'All' ? null : this.transactionStatus
    this.getReports()
  }

  filteration(event:any,type:string,action:boolean = true){

    if(event?.target?.value?.length < 3 && type== 'mobile' && action){
      return
    } 

    this.filterData.mobile = action ? event?.target?.value : ''
    this.getReports()
  } 

  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach((row) => this.selection.select(row));
      console.log(this.selection);
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  setActiveTable() {
    this.resetActiveTable();
    this.activeTable[this.reportType] = true;
    this.getReports();
  }

  resetActiveTable() {
    for (let type in this.activeTable) {
      this.activeTable[type] = false;
    }
  }

  async actionBtn(action: string) {
    if(this.selection.selected?.length < 1){
      this.snackbar.open("Please select the transactions to process" ,"close",{
        duration: 3000
      })
      return 
    }
    let dialogData = [];
    if (action == 'approve') {
      dialogData = this.selection.selected.map((ele) => ({
        ...ele,
        transactionId: ele?._id,
        status: 'Approved',
        comment: '',
      }));
    } else {
      dialogData = this.selection.selected.map((ele) => ({
        ...ele,
        transactionId: ele?._id,
        status: 'Rejected',
        comment: '',
      }));
    }
    console.log(dialogData, 'testing data');
    this.openDialog(dialogData);
  }

  openDialog(dialogData: any) {
    this.dialog
      .open(RedeemStatusUpdateComponent, {
        data: { dialogData: dialogData || [], confirmTable: true },
        disableClose:true
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res?.submit) {
          this.updateRedemption(res?.data);
        }
      });
  }

  updateRedemption(payload: any) {
    this.apiService.processRedemption(payload).subscribe({
      next: (res: any) => {
        if (res?.code == 200) {
          this.snackbar.open(res?.message || "Something went wrong, Please try again" ,"close",{
            duration: 3000
          });

          this.dialog
            .open(RedeemStatusUpdateComponent, {
              data: { dialogData: res?.responseList || [], processTable: true },
              disableClose:true
            })
            .afterClosed()
            .subscribe((res) => {
              this.getReports()
            });
        }
      },
      error: (err: any) => {},
    });
  }

  openFile(fileUrl:string){
    if(fileUrl){
      window.open(fileUrl, "_blank");
    }
  }

  getReports() {
    this.apiService.getReport(this.getTableName(), this.filterData).subscribe({
      next: (res: any) => {
        if (res?.status == 200) {
          this.selection = new SelectionModel<any>(true, []);
          this.reportData = this.reportData.concat(res?.paginatedData);
          this.setTableRequirement();
          this.dataSource = new MatTableDataSource(res.paginatedData);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.setTableRequirement();
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  getTableName(): string {
    for (let type in this.activeTable) {
      if (this.activeTable[type]) {
        return type;
      }
    }
    return 'otp-success';
  }

  setTableRequirement() {
    switch (this.getTableName()) {
      case 'login-success':
        this.displayedColumns = this.loginSuccessDisplayedColumns;
        break;
      case 'otp-success':
        this.displayedColumns = this.otpSuccessDisplayedColumns;
        break;
      case 'otp-failure':
        this.displayedColumns = this.otpFailerDisplayedColumns;
        break;
      case 'otp-active':
        this.displayedColumns = this.otpActiveDisplayedColumns;
        break;
      case 'users':
        this.displayedColumns = this.usersDisplayedColumns;
        break;
      case 'payout':
        this.displayedColumns = this.payoutDisplayedColumns;
        break;
      case 'coupon-claimed':
        this.displayedColumns = this.couponClaimedDisplayedColumns;
        break;
      case 'slogan':
        this.displayedColumns = this.sloganDisplayedColumns;
        break;
      case 'redemption-request':
        this.displayedColumns = this.redeemRequestDisplayedColumns;
        break;
      default:
        this.displayedColumns = this.loginSuccessDisplayedColumns;
        break;
    }
  }

  pagination(data: any) {
    // this.reportData = this.reportData.concat(data);
    // this.dataSource =  new MatTableDataSource(this.reportData);
    // this.dataSource.paginator = this.paginator;
    // this.filterData.page += 1
  }

  onPaginator(pageData: any) {
    // this.getReports();
  }

  download(title?: String) {
    this.filterData.type = 'xlsx';
    this.filterData.max = true;
    this.getReportsDownload(title);
  }

  getReportsDownload(title?: String) {
    this.apiService.getReportDownload(this.getTableName()).subscribe((blob) => {
      // Create a blob URL and initiate download
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `${title}-${Date.now()}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(url);
    });
  }
}
