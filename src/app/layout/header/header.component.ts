import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  show__popup: boolean = false;
  @Output() showMenuNow: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }


  showMenu() {
    this.showMenuNow.emit(true);
  }


}
