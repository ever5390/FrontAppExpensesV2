import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@shared/services/util.service';
import { CONSTANTES } from 'app/data/constantes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  sendComponentParentToCalendar: string = CONSTANTES.CONST_COMPONENT_HEADER;
  flagNotificationpPopUp: boolean= false;
  flagCalendarpPopUp: boolean = false;
  showFormRgister: boolean = false;
  
  @Output() showMenuNow: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private _router: Router,
    private _utilService: UtilService
  ) { }

  ngOnInit(): void {
  }


  showMenu() {
    this.showMenuNow.emit(true);
  }

  showFormRegisterExpense() {
    this.showFormRgister = true;
    this._router.navigate(['/dashboard/expense-detail']);
  }

  // receivedHiddenFormRegister() {
  //   this.showFormRgister = false;
  // }

  showNotificationpPopUp() {
    this.flagNotificationpPopUp = true;
  }

  receivedHiddenNotificationtoHeader(orderHidden: any) {
    console.log("RECEIVED NOTIF: " + orderHidden );
    this.flagNotificationpPopUp = false;
  }

  receiveResponseFromCalendarToParent(data: any) {
    this.flagCalendarpPopUp = false;
    if(data.dateRange == undefined) return;

    this._utilService.sendDatesFromCalendarSelected(data.dateRange);

  }
 

}
