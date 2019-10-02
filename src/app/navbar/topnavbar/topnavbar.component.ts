import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {

  @Input() context: string;

  public hasSite: boolean = true;

  constructor() { }

  ngOnInit() {
    if(!this.context){
      this.hasSite = false;
    }
  }

}
