import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { NotificationExpense, TypeStatusNotificationExpense } from '@data/models/business/notificationExpense.model';
import { OwnerModel } from '@data/models/business/owner.model';
import { PeriodModel } from '@data/models/business/period.model';
import { NotificationExpenseService } from '@data/services/notification/notification-expense.service';
import { UtilService } from '@shared/services/util.service';

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
  @Input() receivedNotificationExpenseList : NotificationExpense[] = [];
  
  owner: OwnerModel = new OwnerModel();
  period: PeriodModel = new PeriodModel();
  notificationExpenseList: NotificationExpense[] = [];
  textSubtitleByTypeUser: string = '';
  orderTypeUpdate: number = 0;
  
  //Voucher
  voucherSelectedToShow: string = '';
  flagShowVoucherPopUp : boolean = false;

  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _utilitariesService: UtilService,
    private _notificationExpenseService: NotificationExpenseService
  ) { 

    this.owner = JSON.parse(localStorage.getItem("lcstrg_owner")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.resizeHeight();
  }

  resizeHeight() {
    this._renderer.listen('window', 'click', (e: Event)=> {
      if(this.contentNotification && e.target === this.contentNotification.nativeElement){
        this.hiddenNotification();
      }
    })
  }

  ngOnInit(): void {
    this.receivedShowNotificationFromHeader = true;
    
  }

  updateItem(notificationSelected: NotificationExpense, orderUpdate: number) {

    // 1 = CANCELAR, :: STATUS = CANCELADO
    // 2 = PAGAR,  :: STATUS = PENDIENTE_PAGO
    // 3 = CONFIRMAR,  :: STATUS = PAGADO
    // 4 = RECHAZAR,  :: STATUS = RECHAZADO
    // 5 = RECLAMAR :: STATUS = RECLAMADO
    this.orderTypeUpdate = orderUpdate;
    switch (orderUpdate) {
      case 1://APROBAR
        notificationSelected.statusNotification = TypeStatusNotificationExpense.CANCELADO;
        //SEND RELOAD EXPENSE
        
        break;
      case 2://PAGAR
        notificationSelected.statusNotification = TypeStatusNotificationExpense.POR_CONFIRMAR;
        //SAVE EXPENSE RECEPTOR AND SEND RELOAD EXPENSE
        this.hiddenNotification();
        this._notificationExpenseService.guardarNotificationExpense(notificationSelected);
        this._router.navigate(['/expense/notification/'+notificationSelected.id]);
        break;
      case 3://CONFIRMAR PAGO
        notificationSelected.statusNotification = TypeStatusNotificationExpense.PAGADO;
        //SEND RELOAD EXPENSE
        
        break;
      case 4://RECHAZAR
        notificationSelected.statusNotification = TypeStatusNotificationExpense.RECHAZADO;
        
        break;
      case 5://RECLAMAR
        notificationSelected.statusNotification = TypeStatusNotificationExpense.RECLAMADO;
        
        break;
      default:
        break;
    }
    if(this.orderTypeUpdate==2)return;
    this.updateStatusFromService(notificationSelected);
    
  }

  private updateStatusFromService(notificationSelected: NotificationExpense) {
    this._notificationExpenseService.updateStatusNotificationExpense(notificationSelected).subscribe(
      response => {

        console.log("OK update notification");
        if(this.orderTypeUpdate == 1 || this.orderTypeUpdate == 3){
          let dataSend:any = [];
          dataSend.startDate = this.period.startDate;
          dataSend.finalDate = this.period.finalDate;
          dataSend.origin = "notification"

          this._utilitariesService.sendDatesFromCalendarSelected({
            "component": CONSTANTES.CONST_COMPONENT_NOTIFICATION,
            "action": "reset",
            "dateRange": dataSend
          });
        }
      },
      error => {
        console.log(error.error);
      }
    );
  }


  receivedResponseFromVoucherShowToParent(event: any) {
    this.flagShowVoucherPopUp = false;
  }

  showVoucherSelected(voucherSelected: string) {
    this.flagShowVoucherPopUp = true;
    this.voucherSelectedToShow = voucherSelected;
  }

  

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    var heightForm = this.idTagContentNotification.nativeElement.clientHeight;
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
