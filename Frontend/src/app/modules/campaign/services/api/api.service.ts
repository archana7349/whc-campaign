import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { register } from '../apiRequestInterface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl:string = environment.baseUrl

  private redeemedValueSource = new BehaviorSubject<Number>(0);
  redeemedValue$ = this.redeemedValueSource.asObservable();
  
  constructor(private http: HttpClient) { }

  userLogin(body:any){
    return this.http.post(`${this.baseurl}auth/verify-otp`,body)
  }

  send_otp(mobile:string){
    return this.http.post(`${this.baseurl}auth/send-otp`,{mobile:mobile})
  }

  register(body:register){
    return this.http.post(`${this.baseurl}auth/submit-form`,body)
  }

  verify_upi_id(upi_id:string){
    return this.http.post(`${this.baseurl}auth/verify-upi`,{upi:upi_id})
  }

  redeem(amount:string){
    return this.http.post(`${this.baseurl}auth/redeem`,{amount})
  }

  user_details(){
    return this.http.get(`${this.baseurl}auth/user`)
  }

  cashback(value:Number){
    this.redeemedValueSource.next(value);
    localStorage.setItem('redeem_points',JSON.stringify(value))
  }

  getReport(pathParams:string,filterData:any){
    let url:string = this.baseurl + "auth/report/";
    let firstEle = true;

    if(pathParams){
      url += pathParams
    }
    if(filterData.max){
      url += firstEle ? "?" : "&";
      firstEle = false;
      url += 'max=true';
    }

    if(filterData.type){
      url += firstEle ? "?" : "&";
      firstEle = false;
      url += 'type='+filterData.type;
    }

    if(filterData.status){
      url += firstEle ? "?" : "&";
      firstEle = false;
      url += 'status='+filterData.status;
    }

    if(filterData.mobile){
      url += firstEle ? "?" : "&";
      firstEle = false;
      url += `mobileNo=${filterData.mobile}`;
    }

    if(filterData.pageSize && filterData.page){
      url += firstEle ? "?" : "&";
      firstEle = false;
      url += `pageSize=${filterData.pageSize}&page=${filterData.page}`;
    }


    return this.http.get(url)
  } 
  getReportDownload(table:string){
    return this.http.get(`${this.baseurl}auth/report/${table}?max=true&type=xlsx`,{ responseType: 'blob' })
  }

  getBookletSeries(){
    return this.http.get(`${this.baseurl}auth/get-booklet`)
  }

  updateForm(body:any){
    return this.http.patch(`${this.baseurl}auth/update-form`,body)
  }

  getCustomerDetails(){
    return this.http.get(`${this.baseurl}auth/get-customer-details`);
  }
  getCities(pincode:string){
    return this.http.get(`${this.baseurl}auth/${pincode}/get-cities`);
  }
  validateQr(payload:any){
    return this.http.post(`${this.baseurl}auth/validate-coupon`,payload);
  }
  formClaim(payload:any){
    return this.http.post(`${this.baseurl}auth/claim-coupon`,payload,{header});
  }
  raiseRedemption(amount:string){
    return this.http.post(`${this.baseurl}auth/raise-redemption-request`,{amount});
  }
  processRedemption(payload:any){
    return this.http.post(`${this.baseurl}auth/process-redemption-request`,payload);
  }
}
