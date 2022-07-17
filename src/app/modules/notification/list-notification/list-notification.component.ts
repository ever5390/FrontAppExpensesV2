import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.css']
})
export class ListNotificationComponent implements OnInit {

  @ViewChild("idTagContentNotification") idTagContentNotification : ElementRef | any;
  @ViewChild("contentNotification") contentNotification : ElementRef | any;
  @Output() sendHiddenNotificationtoHeader: EventEmitter<boolean> = new EventEmitter();
  @Input() receivedShowNotificationFromHeader : boolean = false;

  constructor(
    private _renderer: Renderer2
  ) { 
      this._renderer.listen('window', 'click', (e: Event)=> {
        if(this.contentNotification && e.target === this.contentNotification.nativeElement){
          this.hiddenNotification();
        }
      })

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

  hiddenNotification() {
    this.receivedShowNotificationFromHeader = false;
    this.sendHiddenNotificationtoHeader.emit(false);
  }


}
