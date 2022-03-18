import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {
  addAboutMe: FormControl;
  characters: string;

  constructor() { }

  ngOnInit(): void {
    this.addAboutMe = new FormControl('', [Validators.maxLength(2000)])
  }

  onSave() {
    // hide form
    // display about me
    // save to database

  }

  onCancel() {

  }

}
