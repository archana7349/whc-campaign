import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-upi-verification',
  templateUrl: './upi-verification.component.html',
  styleUrls: ['./upi-verification.component.scss']
})
export class UpiVerificationComponent {
  isButtonDisabled: boolean = true; 
  redeemForm!:FormGroup;
  remainingPoints: string = '0';
  verifiedFlag:boolean = false;
  constructor(private fb:FormBuilder,private apiService:ApiService,private router:Router,private snackbar:MatSnackBar){}

  

  ngOnInit(){
    this.isButtonDisabled = false
    this.redeemForm = this.fb.group({
      upi_id:["",[Validators.required]],
      points:["",[Validators.required]]
    })

    this.user_details()
  }
  
  user_details() {
    this.apiService.user_details().subscribe((res: any) => {
      if (res.status === 200) {
        this.remainingPoints = res?.User?.points_balance || 0;
        if(res.User.upi){
          this.redeemForm.get("upi_id")?.setValue(res.User.upi);
          this.verifiedFlag = true;
        }
        
      }
    });
  }

  verifyUpi(){
    if(this.verifiedFlag) return
    this.apiService.verify_upi_id(this.redeemForm.value.upi_id).subscribe((res:any)=>{
      if(res.code === 200){
        this.snackbar.open(res.message,"close",{duration: 3000})
        this.verifiedFlag = true
        this.redeemForm.get('upi_id')?.setErrors(null)
      }else{
        this.snackbar.open(res.message,"close",{duration: 3000})
      }
    },(error:any)=>this.snackbar.open("Invalid UPI ID, Please enter valid UPI ID","close",{duration:3000}))
  }

  pointsValidation(){
    this.redeemForm.value.points > this.remainingPoints && this.redeemForm.get('points')?.setErrors({'exceeded':true})
    this.redeemForm.value.points == 0 && this.redeemForm.get('points')?.setErrors({'required':true})
  }

  // onSubmit(){
    
  //   if (this.redeemForm.valid) {
  //     this.isButtonDisabled = true
  //     this.apiService.redeem(this.redeemForm.value.points).subscribe({
  //       next: (res: any) => {
  //         this.isButtonDisabled = false
  //         if (res.code === 200) {
  //           this.redeemForm.reset();
  //           Object.keys(this.redeemForm.controls).forEach((key) => {
  //             this.redeemForm.get(key)?.setErrors(null);
  //           });
  //           localStorage.setItem('timeInterval', moment().toISOString());
  //           this.router.navigate(['redeemed']);
  //         }
  //       },
  //       error: (err: any) => {
  //         this.isButtonDisabled = false
  //         this.snackbar.open(err.error.message, 'close', { duration: 3000 });
  //       },
  //       complete: () => { this.isButtonDisabled = false}
  //     });
  //   }
  // }

  onSubmit(){
    
    if (this.redeemForm.valid) {
      this.isButtonDisabled = true
      this.apiService.raiseRedemption(this.redeemForm.value.points).subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.redeemForm.reset();
            Object.keys(this.redeemForm.controls).forEach((key) => {
              this.redeemForm.get(key)?.setErrors(null);
            });
            localStorage.setItem('timeInterval', moment().toISOString());
            this.router.navigate(['redeemed']);
          }
        },
        error: (err: any) => {
          this.snackbar.open(err.error.message, 'close', { duration: 3000 });
        },
        complete: () => { this.isButtonDisabled = false}
      });
    }
  }
}
