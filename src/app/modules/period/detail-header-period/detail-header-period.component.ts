import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { IExpensesSendParams } from '@data/interfaces/iexpense-params-send.interface';
import { PeriodModel } from '@data/models/business/period.model';
import { ExpensesService } from '@data/services/expenses/expenses.service';
import { PeriodService } from '@data/services/period/period.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import Swal from 'sweetalert2';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-detail-header-period',
  templateUrl: './detail-header-period.component.html',
  styleUrls: ['./detail-header-period.component.css']
})
export class DetailHeaderPeriodComponent implements OnInit {

  sendComponentParentToCalendar: string = CONSTANTES.CONST_COMPONENT_PERIOD;
  periodShow: PeriodModel = new PeriodModel();
  flagCalendarpPopUp: boolean = false;
  dateFinalAutomaticCatch: Date = new Date();

  @Input() periodDetailHeaderReceived: PeriodDetailHeader = new PeriodDetailHeader();

  constructor(
    private _periodService: PeriodService,
    private _expenseService: ExpensesService,
    private _loaderService: SLoaderService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this._loaderService.showSpinner();
    setTimeout(() => {
      this.periodShow = this.periodDetailHeaderReceived.period;
    }, 100);
    
  }

  viewExpenseByPeriod() {
      let objectSendExpenses :IExpensesSendParams = { 
        idPeriod : this.periodShow.id,
        dateBegin : this.periodShow.startDate.toString(),
        dateEnd : this.periodShow.finalDate.toString(),
        optionOrigin : CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_LAST_PERIODS
      };
      this._expenseService.saveObjectParamsToSendExpensesShowByOptions(objectSendExpenses);
      this._router.navigate(["/"]);
  }

  validExpensesStatusPayInPeriod(originAction: string) {
    this._loaderService.showSpinner();
    if(originAction == 'manual')
      this.periodDetailHeaderReceived.period.finalDate = new Date();

    this._expenseService.getAllExpensesWithStatusPayEqualsTrueByPeriodid(this.periodDetailHeaderReceived.period.id).subscribe(
      response => {
        if(response.length > 0) {
          this.confirmationExpensePendingPay();
          return;
        }
        this.closePeriod();
      },
      error => {
        Swal.fire("","Ocurrió un error inesperado al intentar validar gastos pendientes previo cierre de periodo","error");
      }
    );
  }

  closePeriod() {
    this._periodService.closePeriod(this.periodDetailHeaderReceived.period).subscribe(
      response => {
        this._loaderService.hideSpinner();
        Swal.fire(response.title, response.message,response.status);
        this._periodService.saveToLocalStorage(response.object);
        this._router.navigate(["/period"]);
      }, 
      error => {
        Swal.fire(error.error.title, error.error.message,error.error.status);
      }
    );
  }

  editingFinalDate() {
    this.flagCalendarpPopUp = true;
  }

  confirmationExpensePendingPay(){
    Swal.fire({
      title: '',
      text: " Se encontraron gasto pendientes de pago en este periodo ¿Desea continuar con el cierre?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closePeriod();
      }
      this._loaderService.hideSpinner();
    })
    
  }

  confirmationClosePeriod(originAction: string){
    Swal.fire({
      title: '',
      text: "Este procedimiento cerrará y aperturará un nuevo periodo, por favor confirmar acción.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.validExpensesStatusPayInPeriod(originAction);
      }
    })
  }

  receiveResponseFromCalendarToParent(data: any) {
    this.flagCalendarpPopUp = false;
    if(data.dateEnd == undefined) return;

    let dateSelectSingleOption = new Date();
    let timeMilisDateSelected = (new Date(data.dateEnd)).getTime();
    let timeMilisDateInitialPeriod = (new Date(this.periodDetailHeaderReceived.period.startDate)).getTime();
    
    if(timeMilisDateInitialPeriod >= timeMilisDateSelected) {
      if(data.action == null) {
        this._loaderService.hideSpinner();
        Swal.fire("","La fecha seleccionada debe ser mayor a la fecha inicial del periodo actual","info");
        return;
      }

      if(data.action == "quincenal") {
        dateSelectSingleOption = new Date(
          (data.dateEnd).getFullYear(),
          (data.dateEnd).getMonth()+1,
          15
        )
      }

      timeMilisDateSelected = (dateSelectSingleOption).getTime();
    }

    let dateShowConfirm = formatDate(data.dateEnd, 'dd MMM YYYY HH:mm:ss', 'es');

    let confirmationMessage = "La fecha se cambiará a " + dateShowConfirm + ", presione confirmar para ejecutar la orden de modificación.";
    if(data.action == null && data.dateEnd.getDate() >= 29) {
        confirmationMessage = "Recuerde que no todas los meses tienen esta cantidad de días, para estos casos se tomará los fines de mes.";
    }

    Swal.fire({
      title: '',
      text: confirmationMessage,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!'
    }).then((result) => {
      if (result.isConfirmed) {
        let dateFinalSend = timeMilisDateSelected;        
        this.updateFinalDatePeriod(new Date(dateFinalSend));
      } else {
        this._loaderService.hideSpinner();
      }
    })

  }

  updateFinalDatePeriod(newFinalDate: Date) {
    this._loaderService.showSpinner();
    //Seteo de fecha final y activación
    this.periodShow = this.periodDetailHeaderReceived.period;
    this.periodShow.activate = true;
    this.periodShow.finalDate = newFinalDate;
    this._periodService.updatePeriod(this.periodShow, 
        this.periodDetailHeaderReceived.period.id).subscribe(
      response => {
        this._loaderService.hideSpinner();
        Swal.fire("","Se realizó con éxito la modificación de la fecha de cierre.","success");
        if(response.object == null) return;

        this.periodShow = response.object;
        this._periodService.saveToLocalStorage(response.object);
      }, 
      error => {
        Swal.fire("","Ocurrió un error mientras se actualizaba la fecha de cierre, recargue la página e inténtelo nuevamente.","error");
        this._loaderService.hideSpinner();
        console.log(error.error);
      }
    );
  }

}
