import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationExpense, TypeStatusNotificationExpense } from '@data/models/business/notificationExpense.model';
import { OwnerModel } from '@data/models/business/owner.model';
import { PeriodModel } from '@data/models/business/period.model';
import { NotificationExpenseService } from '@data/services/notification/notification-expense.service';
import { UserService } from '@data/services/user/user.service';
import { UtilService } from '@shared/services/util.service';
import { CONSTANTES } from 'app/data/constantes';
import { interval, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  owner: OwnerModel = new OwnerModel();
  notificationExpenseList: NotificationExpense[] = [];
  countNotification : number = 0;
  notificationExpense: NotificationExpense = new NotificationExpense();

  sendComponentParentToCalendar: string = CONSTANTES.CONST_COMPONENT_HEADER;
  flagNotificationpPopUp: boolean= false;
  flagCalendarpPopUp: boolean = false;
  showFormRgister: boolean = false;
  showInfoByTypeUser: boolean = false; //FALSE: EMISOR, TRUE = RECEPTOR
  
  @Output() showMenuNow: EventEmitter<boolean> = new EventEmitter();
  period: PeriodModel = new PeriodModel();
  constructor(
    private _router: Router,
    private _utilService: UtilService,
    private _userService: UserService,
    private _notificationExpenseService: NotificationExpenseService
  ) {
    this.owner = JSON.parse(localStorage.getItem("lcstrg_owner")!);
    
    this._utilService.receivingCountNotifications().subscribe(
      response => {
        this.countNotification = response;
      },
      error => {
        console.log(error.error);
      }
    );
   }

  ngOnInit(): void {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.intervalNotify();
    
  }

  intervalNotify() {
    const numberNotification  = interval(1000);
    const subscribe = numberNotification.subscribe(
      (n) => {
          this.getNotificationRequest(numberNotification);
          if(this._userService.isTokenExpirado()) {
            subscribe.unsubscribe()
          }
      }
    );
  
  }

  getNotificationRequest(numberNotification: any) {
    this._notificationExpenseService.getAllNotificationByTypeUserAndUserId(this.owner.id).subscribe(
      response => {
        if(response != null) {
          this.notificationExpenseList = response.filter( item => {
            if(item.expenseShared.workspace.owner.id == this.owner.id) {
              return item.statusNotification.toString() != TypeStatusNotificationExpense.PENDIENTE_PAGO;
            }
            return item;
          });
        }

        this.notificationExpenseList = this.notificationExpenseList.map( item => {
          if(item.expenseShared.workspace.owner.id == this.owner.id) {
            item.isEmisorUser = true;
          }
          return item;
        });

        this.notificationExpenseList.forEach( item => {
          if(item.expenseShared.workspace.owner.id == this.owner.id){
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.POR_CONFIRMAR) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_EMISOR_NOTIF_PDTE_CONFIRMACION;
            }
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.RECLAMADO) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_EMISOR_NOTIF_RECLAMADO;
            }
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.RECHAZADO) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_EMISOR_NOTIF_RECHAZADO;
            }
          } else {
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.POR_CONFIRMAR) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_RECEPTOR_NOTIF_PDTE_CONFIRMACION;
            }
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.RECLAMADO) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_RECEPTOR_NOTIF_RECLAMADO;
            }
            if(item.statusNotification.toString() == TypeStatusNotificationExpense.RECHAZADO) {
              item.subtitleText = CONSTANTES.CONST_TEXT_SUBTITLE_RECEPTOR_NOTIF_RECHAZADO;
            }
          }
        });

        if(this.notificationExpenseList.length == 0) {
          this.flagNotificationpPopUp = false;
        }
      },
      error => {
        if(error.error.error_description != null && error.error.error_description.includes("token expired")) {
          Swal.fire("","Su sessión ha expirado, ingrese nuevamente","info");
          this._userService.logoutSession();
          this._router.navigate(["/login"]);
        }
        
      }
    );

  }

  showMenu() {
    this.showMenuNow.emit(true);
  }

  showFormRegisterExpense() {
    this.showFormRgister = true;
    if(this.period != null && (new Date().getTime() > new Date(this.period.finalDate).getTime()) &&
    this.period.activate == true  && this.period.statusPeriod == true) {
      console.log("period WERWERWER ADIOS");
      Swal.fire("","El periodo finalizo, modifique su fecha de cierre o hágalo manualmente para continuar","info");
      this._router.navigate(["/period/period-detail/"+ this.period.id]);
    }
    this._router.navigate(['/expense']);
  }

  showNotificationpPopUp() {
    if(this.notificationExpenseList.length != 0)
      this.flagNotificationpPopUp = true;
  }

  receivedHiddenNotificationtoHeader(orderHidden: any) {
    console.log("RECEIVED NOTIF: " + orderHidden );
    this.flagNotificationpPopUp = false;
  }

  receiveResponseFromCalendarToParent(data: any) {
    this.flagCalendarpPopUp = false;
    if(data.dateRange == undefined) return;

    this._utilService.sendDatesFromCalendarSelected(data);

  }
 

}
