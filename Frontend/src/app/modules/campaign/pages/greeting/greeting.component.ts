import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/shared/spinner/sprinner.service';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent {

  remainingSec: number = 10;
  cashback:Number = 0
  constructor(
    private router:Router,
    private spinnerSpinner:SpinnerService,
    private apiService:ApiService
  ) {}

  async ngOnInit(){
    this.updateCashback();
    console.log(moment().diff(localStorage.getItem("timeInterval"),"seconds"))
    if(localStorage.getItem("timeInterval") && moment().diff(localStorage.getItem("timeInterval"),"seconds") >= 0 && moment().diff(localStorage.getItem("timeInterval"),"seconds") < 10){
      this.remainingSec = this.remainingSec - moment().diff(localStorage.getItem("timeInterval"),"seconds")
      await this.countDown()
    }else{
      this.redirect()
    }
  }

  updateCashback(){
    this.apiService.redeemedValue$.subscribe({
      next:value => {
        this.cashback =
          value || JSON.parse(localStorage.getItem('redeem_points') || '0');
        
      }
    })
  }

  async countDown(){
    await new Promise<void>((resolve) => {
      const countdownInterval = setInterval(() => {
        this.remainingSec--;
        if (this.remainingSec === 0) {
          clearInterval(countdownInterval);
          this.redirect()  
          resolve();
        }
      }, 1000);
    });
  }

  redirect(){
    this.router.navigate([""]);
    localStorage.removeItem("timeInterval")
    localStorage.removeItem("redeem_points")
  }
 


  loader(){
    this.spinnerSpinner.show()
    setTimeout(()=>{
      this.spinnerSpinner.hide()
    },2000)
  }

}
