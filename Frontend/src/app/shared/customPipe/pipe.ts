import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";


@Pipe({
    name: 'currencyFormat'
  })
  export class CurrencyFormatPipe implements PipeTransform {
    transform(value: string, currencyCode: string = 'INR'): string {
      const formattedValue = value ? Number(value).toLocaleString('en-IN', {
        style: 'currency',
        currency: currencyCode
      }) : '0';
      return formattedValue;
    }
  }
  
  @Pipe({
    name: 'dateFormat'
  })
  export class DateFormatPipe implements PipeTransform {
    transform(value: string, format: string = "DD-MMM-YYYY hh:mm A"): string {
      return moment(value).locale('en').utc().utcOffset("+05:30").format(format);
    }
  }