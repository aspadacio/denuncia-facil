import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'welcome-site',
  templateUrl: './welcome-site.component.html',
  styleUrls: ['./welcome-site.component.css']
})
export class WelcomeSiteComponent implements OnInit {

  public context: string;
  public userName: string;

  constructor() { }

  ngOnInit() {
  }

}
