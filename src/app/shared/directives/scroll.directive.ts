import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[scroller]'
})
export class ScrollDirective {

  constructor() { }

  @HostListener('window:scroll', ['$event']) onScroll($event: any) {
    console.log(event);
  }
}
