import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Denúncia Fácil';

  public context: string;
  public hasSite: boolean;

  constructor(
    private location: Location
  ){
    this.context =  this.location.path().split('/')[2];
   }
}
