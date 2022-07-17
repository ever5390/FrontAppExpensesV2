import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  flagNotificationpPopUp: boolean= false;
  showFormRgister: boolean = false;
  flagCalendarpPopUp: boolean = false;
  @Output() showMenuNow: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }


  showMenu() {
    this.showMenuNow.emit(true);
  }

  showFormRegisterExpense() {
    this.showFormRgister = true;
    this._router.navigate(['/expense-detail']);
  }

  receivedHiddenFormRegister() {
    this.showFormRgister = false;
  }

  showNotificationpPopUp() {
    this.flagNotificationpPopUp = !this.flagNotificationpPopUp;
  }

}
