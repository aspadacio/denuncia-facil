import { Component } from '@angular/core';
import { RouterStateSnapshot, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Denúncia Fácil';

  public context: string;

  constructor(
    private location: Location
  ){
    this.context =  this.location.path().split('/')[2] ? this.location.path().split('/')[2] : "unknow";
   }
}
