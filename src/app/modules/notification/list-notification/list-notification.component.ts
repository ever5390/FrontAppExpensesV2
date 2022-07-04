import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.css']
})
export class ListNotificationComponent implements OnInit {

  @ViewChild("idTagContentNotification") idTagContentNotification : ElementRef | any;
  constructor(
    private _renderer: Renderer2
  ) { 
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.idTagContentNotification.nativeElement.clientHeight;
    if(heightForm = windowHeight -100) {
      this._renderer.setStyle(this.idTagContentNotification.nativeElement, "height",(windowHeight-120)+"px");
      this._renderer.setStyle(this.idTagContentNotification.nativeElement,"overflow-y", "scroll");
    }
  }


}
