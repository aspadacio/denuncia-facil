import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'debug-form',
  templateUrl: './debug-form.component.html',
  styleUrls: ['./debug-form.component.css']
})
export class DebugFormComponent implements OnInit {

  @Input() form: NgForm;

  constructor() { }

  ngOnInit() {
  }

}
