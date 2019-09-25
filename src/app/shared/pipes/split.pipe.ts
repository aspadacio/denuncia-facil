import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform (input: any, separator: string = ' ', limit?: number): any {
    return input.split(separator, limit);
  }

}
