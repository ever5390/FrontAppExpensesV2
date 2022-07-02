import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  active_menu_click: boolean = false;
  showAside: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }



  ReceivedshowMenuNow(event: boolean) {
    this.showAside = true;
    setTimeout(() => {
      this.active_menu_click = event;
    }, 50);
    
  }

  ReceivedgHiddenMenuNow(event: boolean) {
    this.active_menu_click = event;
    setTimeout(() => {
      this.showAside = false;
    }, 1000);
  }
}
