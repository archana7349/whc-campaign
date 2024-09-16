import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import {
  AuthService,
  UserResFull,
} from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApiService } from '../../services/api/api.service';
import { register } from '../../services/apiRequestInterface';
import { TermsAndConditionsComponent } from '../popups/terms-and-conditions/terms-and-conditions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ADMIN, FORM_DATA, validCouponCode, validEmail, validPincode } from 'src/app/shared/constant/constant';
import { QrScannerComponent } from '../popups/qr-scanner/qr-scanner.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  loggedIn: UserResFull | null = this.authService.getAuthStatus();
  registerationEnable: boolean = false;
  registerForm!: FormGroup;
  remainingPoints: string = '0';
  maxDate: Date = new Date();
  qrFlag: boolean = true;
  cities: string[] = [];

  // @HostListener('window:beforeunload', ['$event'])
  // handleBeforeUnload(event: BeforeUnloadEvent) {
  //   const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave';
  //   event.preventDefault(); // 
  //   return confirmationMessage; 
  // }
  

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    // sessionStorage.setItem('authDetails',JSON.stringify({"status":200,"message":"User validated succeeded.","user_role":"user","token":"eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOiI5NjA2ODYyNDMwIiwiaXAiOiIwLjAuMC4wIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MjMxMTU5NTV9.T-7YVCHUY2oixUNVrmsg1_Ia7Ri8v-XO9-NtusgKscQ","mobile_number":9606862430}))
    // sessionStorage.setItem('token',JSON.stringify("eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOiI5NjA2ODYyNDMwIiwiaXAiOiIwLjAuMC4wIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MjMxMTU5NTV9.T-7YVCHUY2oixUNVrmsg1_Ia7Ri8v-XO9-NtusgKscQ"))
    if (!this.loggedIn) {
      this.getAuthenticate();
    } else if (this.loggedIn?.user_role === ADMIN) {
      this.router.navigate(['admin/reports']);
    } else {
      this.registerationEnable = true;
      this.user_details();
    }
    this.resetAll();
  }

  capitalize(event: any) {
    this.registerForm
      .get('scratch_code')
      ?.patchValue(event.value.toUpperCase());
  }
  resetAll() {
    const { customer_name, customer_email } = JSON.parse(
      sessionStorage.getItem(FORM_DATA) || '{}'
    );
    console.log('>>>>>', customer_name, customer_email);
    let { mobile_number } = this.authService.getAuthStatus() || {
      mobile_number: '',
    }; // getAuthStatus doesnot have mobile number, default mobile is empty

    this.registerForm = this.fb.group({
      qrCode: [''],
      customer_name: [''],
      customer_email: [''],
      customer_mobile: [mobile_number],
      pincode: [''],
      city: [''],
      scratch_code: [''],
    });
  }

  user_details() {
    this.apiService.user_details().subscribe((res: any) => {
      if (res.status === 200) {
        this.remainingPoints = res?.User?.points_balance || 0;
      }
    });
  }

  gotoRedeem() {
    this.router.navigate(['redeem']);
  }

  getAuthenticate() {
    this.dialog
      .open(LoginComponent, { disableClose: true, panelClass: 'login-popup' })
      .afterClosed()
      .subscribe((r: any) => {
        this.registerationEnable = this.authService.getAuthStatus()
          ? true
          : false;
        this.user_details();
        this.resetAll();
      });
  }

  // onSubmit() {
  //   if (this.registerForm.valid) {
  //     const body: register = {
  //       name: this.registerForm.value.customer_name,
  //       email: this.registerForm.value.customer_email,
  //       mobile: this.registerForm.value.customer_mobile,
  //       dateOfpuchase: moment(
  //         this.registerForm.value.purchase_date
  //       ).toISOString(),
  //       model: this.registerForm.value.purchase_model,
  //       purchasePrice: this.registerForm.value.purchase_price,
  //       scratchCode: this.registerForm.value.scratch_code,
  //       comment: this.registerForm.value.comment,
  //     };
  //     this.apiService.register(body).subscribe(
  //       (res: any) => {
  //         this.storage();
  //         this.registerForm.reset();
  //         Object.keys(this.registerForm.controls).forEach((key) => {
  //           this.registerForm.get(key)?.setErrors(null);
  // this.apiService.cashback(Number(res.redeemed_points));
  // this.router.navigate(['purchased']);
  //         });
  //       },
  //       (err: any) => {
  //         this.snackbar.open(
  //           err?.error?.message || 'Something went wrong, Please try again',
  //           'close',
  //           { duration: 3000 }
  //         );
  //       }
  //     );
  //   }
  // }

  onSubmit() {
    this.fieldValidators('all')
    if (this.registerForm.valid) {
      let payload = new FormData();
      payload.append("couponCode",this.registerForm.value.qrCode)
      
      // let payload = {
      //   couponCode: this.registerForm.value.qrCode,
      //   name: this.registerForm.value.customer_name,
      //   email: this.registerForm.value.customer_email,
      //   pincode: this.registerForm.value.pincode,
      //   city: this.registerForm.value.city,
      //   scratchCode: this.registerForm.value.scratch_code,
      // };
      this.apiService.formClaim(payload).subscribe({
        next: (res: any) => {
          if (res?.code === 200) {
            this.storage();
            this.registerForm.reset();
            this.apiService.cashback(Number(res?.redeemed_points));
            this.router.navigate(['purchased']);
          } else {
            this.snackbar.open(
              res?.message || 'Something went wrong, Please try again',
              'close',
              {
                duration: 3000,
              }
            );
          }
        },
        error: (err: any) => {},
      });
    }
  }

  storage() {
    localStorage.setItem('timeInterval', moment().toISOString());
    // sessionStorage.setItem(
    //   FORM_DATA,
    //   JSON.stringify({
    //     customer_name: this.registerForm.value.customer_name,
    //     customer_email: this.registerForm.value.customer_email,
    //   })
    // );
  }

  termsAndCondition() {
    this.registerationEnable && this.dialog.open(TermsAndConditionsComponent,{ panelClass: 'tnc-popup' });
  }

  openDialog() {
    this.dialog
      .open(QrScannerComponent, { autoFocus: false,  panelClass: 'qrcode-popup' })
      .afterClosed()
      .subscribe((res) => {
        if (!isNaN(res)) this.registerForm.get('qrCode')?.setValue(res);
        else {
          this.snackbar.open('Invalid Qr code', 'close', {
            duration: 3000,
          });
        }
      });
  }

  getCustomerDetails() {
    this.apiService.getCustomerDetails().subscribe({
      next: (res: any) => {
        console.log(res);
        this.qrFlag = true;
        if (res?.code === 200) {
          let result = res?.customerData;
          this.cities = [result?.city];
          this.registerForm.patchValue({
            customer_name: result?.name,
            customer_email: result?.email,
            pincode: result?.pincode,
            city: result?.city,
          });
        }
      },
      error: (error: any) => {},
    });
  }

  getCities(event: any) {
    if (event?.target?.value?.length > 5) {
      this.apiService.getCities(event?.target?.value).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res?.code === 200) {
            this.cities = res?.cityDetails?.cities;
            console.log(this.cities);
          }
        },
      });
    }
  }

  validateQr() {
    this.fieldValidators('qrCode');    
    if (this.registerForm.valid) {
      let payload = {
        couponCode: this.registerForm.get('qrCode')?.value?.toString(),
      };
      this.apiService.validateQr(payload).subscribe({
        next: (res: any) => {
          console.log(res, 'dcdcd');
          if (res?.code === 200) {
            this.getCustomerDetails();
            this.snackbar.open(res?.message, 'close', {
              duration: 3000,
            });
          } else {
            this.snackbar.open(res?.message, 'close', {
              duration: 3000,
            });
          }
        },
        error: (err: any) => {},
      });
    }
  }

  fieldValidators(fieldName: string) {
    this.registerForm.markAllAsTouched();
    if (fieldName == 'qrCode' || fieldName == 'all') {
      if (!this.registerForm.get('qrCode')?.value) {
        this.registerForm.controls['qrCode']?.setErrors({ required: true });
      } else if (!validCouponCode(this.registerForm.get('qrCode')?.value?.toString())) {
        this.registerForm.controls['qrCode']?.setErrors({ pattern: true });
      } else {
        this.registerForm.controls['qrCode']?.setErrors(null);
      }
    }

    if (fieldName == 'customer_name' || fieldName == 'all') {
      if (!this.registerForm.get('customer_name')?.value) {
        this.registerForm.controls['customer_name']?.setErrors({
          required: true,
        });
      } else {
        this.registerForm.controls['customer_name']?.setErrors(null);
      }
    }

    if (fieldName == 'customer_email' || fieldName == 'all') {
      if (!this.registerForm.get('customer_email')?.value) {
        this.registerForm.controls['customer_email']?.setErrors({
          required: true,
        });
      } else if (!validEmail(this.registerForm.get('customer_email')?.value)) {
        this.registerForm.controls['customer_email']?.setErrors({
          pattern: true,
        });
      } else {
        this.registerForm.controls['customer_email']?.setErrors(null);
      }
    }

    if (fieldName == 'pincode' || fieldName == 'all') {
      if (!this.registerForm.get('pincode')?.value) {
        this.registerForm.controls['pincode']?.setErrors({ required: true });
      } else if (!validPincode(this.registerForm.get('pincode')?.value)) {
        this.registerForm.controls['pincode']?.setErrors({ pattern: true });
      } else {
        this.registerForm.controls['pincode']?.setErrors(null);
      }
    }

    if (fieldName == 'city' || fieldName == 'all') {
      if (!this.registerForm.get('city')?.value) {
        this.registerForm.controls['city']?.setErrors({ required: true });
      } else {
        this.registerForm.controls['city']?.setErrors(null);
      }
    }

    if (fieldName == 'scratch_code' || fieldName == 'all') {
      if (!this.registerForm.get('scratch_code')?.value) {
        this.registerForm.controls['scratch_code']?.setErrors({
          required: true,
        });
      } else if (this.registerForm.get('scratch_code')?.value?.length != 6) {
        this.registerForm.controls['scratch_code']?.setErrors({
          pattern: true,
        });
      } else {
        this.registerForm.controls['scratch_code']?.setErrors(null);
      }
    }
  }
}
