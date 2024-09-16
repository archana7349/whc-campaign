import { Component,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { OTP_INTERVAL } from 'src/app/shared/constant/constant';
import * as moment from "moment";

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  otpButtonString: string = 'Send OTP';
  otpInterval: number = OTP_INTERVAL;
  otpIntervalAlternate: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  async ngOnInit() {
    // sessionStorage.setItem('authDetails',JSON.stringify({"status":200,"message":"User validated succeeded.","user_role":"user","token":"eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOiI5NjA2ODYyNDMwIiwiaXAiOiIwLjAuMC4wIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MjI1OTEyOTV9.YlVHOG3n3CU5c-C3yGijFDtNUkB0Tee3jMYHCfrTRO0","mobile_number":9606862430}))
    // sessionStorage.setItem('token',JSON.stringify("eyJhbGciOiJIUzI1NiJ9.eyJtb2JpbGUiOiI5NjA2ODYyNDMwIiwiaXAiOiIwLjAuMC4wIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MjI1OTEyOTV9.YlVHOG3n3CU5c-C3yGijFDtNUkB0Tee3jMYHCfrTRO0"))
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required]],
      otp: [null],
      // recaptcha: ["",[Validators.required]]
    });

    if (
      this.otpIntervalCustomFn('check') &&
      this.otpIntervalCustomFn('isRemaining')
    ) {
      this.otpInterval =
        this.otpInterval - this.otpIntervalCustomFn('getRemaining');
      this.otpIntervalAlternate = true;
      await this.countDown()
    }
  }

  otpIntervalCustomFn(type: string): any {
    if (type === 'check') {
      if (localStorage.getItem('otpTimeout')) return true;
      else false;
    }

    if (type === 'isRemaining') {
      if (moment().diff(localStorage.getItem('otpTimeout'), 'seconds') > 1 && moment().diff(localStorage.getItem('otpTimeout'), 'seconds') < OTP_INTERVAL)
        return true;
      else false;
    }

    if (type === 'getRemaining') {
      return moment()?.diff(localStorage.getItem('otpTimeout'), 'seconds') || 0;
    }

    if (type === 'setOtpTimeout') {
      localStorage.setItem('otpTimeout', String(moment().toISOString()));
    }

    if (type === 'clearOtpTimeout') {
      localStorage.removeItem('otpTimeout');
    }
  }

  send_otp() {
    console.log('number of time button click');
    if (
      this.loginForm.controls['mobile'].valid &&
      (this.otpIntervalAlternate || this.otpInterval === OTP_INTERVAL)
    ) {
      this.modifyValidators('otp', 'add');
      this.otpIntervalCustomFn('setOtpTimeout');
      this.apiService
        .send_otp(String(this.loginForm.get('mobile')?.value))
        .subscribe(async (res: any) => {
          if (res.status === 200) {
            this.snackbar.open(res.message,"close",{duration:5000})
            await this.countDown()
          }else{
            this.snackbar.open(res?.message || "Something went wrong, Please try again" ,"close",{
              duration: 3000
            })
          }
        },(err:any)=>{
          this.snackbar.open(err.error.message || "Internal server error, Please try again","close",{duration:3000})
        });
    }else{
      this.loginForm.controls['mobile'].valid && this.snackbar.open(`OTP resend activated in ${this.otpInterval}s. Please wait.`,"close",{duration:1000})
    }
  }

  async countDown(){
    await new Promise<void>((resolve) => {
      const countdownInterval = setInterval(() => {
        this.otpInterval--;
        this.otpButtonString = `Resend OTP(${this.otpInterval})`;
        if (this.otpInterval === 0) {
          clearInterval(countdownInterval);
          this.otpButtonString = `Send OTP`;
          this.otpInterval = OTP_INTERVAL;
          this.otpIntervalCustomFn('clearOtpTimeout');
          resolve();
        }
      }, 1000);
    });
  }

  modifyValidators(formControlName: string, type: string) {
    console.log('>>>>>>');
    if (formControlName === 'otp') {
      console.log('>>>>>>2');
      if (type === 'add') {
        this.loginForm.get('otp')?.setValidators([Validators.required]);
        this.loginForm.controls['otp'].setValue('');
      } else this.loginForm.get('otp')?.clearValidators();
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const body: any = {
        mobile: String(this.loginForm.value.mobile),
        otp: String(this.loginForm.value.otp),
      };
      this.apiService.userLogin(body).subscribe({
        next: (res: any) => {
          if (res.status) {
            res.mobile_number = this.loginForm.value.mobile;
            this.otpIntervalCustomFn('clearOtpTimeout');
            this.authService.setAuthStatus(res);
            if (res?.user_role == 'vg_admin') {
              this.router.navigate(['admin/reports']);
            } else {
              this.router.navigate(['']);
            }
            this.dialogRef.close();
          } else {
            this.snackbar.open(res.message, 'close', { duration: 3000 });
            this.loginForm.get('otp')?.setErrors({ incorrect: true });
          }
        },
        error:(err:any)=>{
          this.snackbar.open(err.error.message || "Incorrect OTP, Please try again","close",{duration:3000})
          this.loginForm.get("otp")?.setErrors({incorrect:true})
        }
      });
    }
  }
}
// old tested code which is deprecated.
/*
this.apiService.userLogin(body).subscribe((res: any) => {
  if (res.status) {
    res.mobile_number = this.loginForm.value.mobile;
    this.otpIntervalCustomFn('clearOtpTimeout');
    this.authService.setAuthStatus(res);
    if(res?.user_role == "vg_admin"){
      this.router.navigate(["admin/reports"])
    }else{
      this.router.navigate(['/']);
    }
    this.dialogRef.close();
  }else{
    this.snackbar.open(res.message,"close",{duration:3000})
    this.loginForm.get("otp")?.setErrors({incorrect:true})
  }
},(err:any)=>{ 
  this.snackbar.open(err.error.message || "Incorrect OTP, Please try again","close",{duration:3000})
  this.loginForm.get("otp")?.setErrors({incorrect:true})
});*/