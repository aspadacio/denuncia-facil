import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from '../constants';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipeThis extends DatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    //console.log('convertendo', value);
    return super.transform(value, Constants.DATE_FORMAT);
  }
}
