import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from '../constants';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipeThis extends DatePipe implements PipeTransform {

  /**
   * Format a Date form the pattern format
   * @param value - Date
   * @param args 0 - Pattern Format
   */
  transform(value: any, ...args: any[]): any {
    return super.transform(value, args[0] ? args[0] :Constants.DATE_TIME_FORMAT);
  }
}
