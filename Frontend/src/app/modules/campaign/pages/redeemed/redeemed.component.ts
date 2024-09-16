import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { REDIRECT_INTERVAL } from 'src/app/shared/constant/constant';

@Component({
  selector: 'app-redeemed',
  templateUrl: './redeemed.component.html',
  styleUrls: ['./redeemed.component.scss']
})
export class RedeemedComponent {
  remainingSec: number = REDIRECT_INTERVAL;
  constructor(
    private router:Router
  ) {}

  async ngOnInit(){
    console.log(moment().diff(localStorage.getItem("timeInterval"),"seconds"))
    if(localStorage.getItem("timeInterval") && moment().diff(localStorage.getItem("timeInterval"),"seconds") >= 0 && moment().diff(localStorage.getItem("timeInterval"),"seconds") < REDIRECT_INTERVAL){
      this.remainingSec = this.remainingSec - moment().diff(localStorage.getItem("timeInterval"),"seconds")
      await this.countDown()
    }else{
      this.redirect()
    }
    
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
    this.router.navigate(["redeem"])
    localStorage.removeItem("timeInterval")
  }
 

}
