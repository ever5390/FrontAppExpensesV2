import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { PeriodModel } from '@data/models/business/period.model';
import { PeriodService } from '@data/services/period/period.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';
import Swal from 'sweetalert2';

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
    private _loadSpinnerService: SLoaderService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.periodShow = this.periodDetailHeaderReceived.period;
  }

  viewExpenseByPeriod() {
    this._periodService.saveToLocalStorage(this.periodShow);
    this._router.navigate(['/period/'+this.periodShow.id+"/expense"]);
  }

  closePeriodAtomatic(originAction: string) {
    this._loadSpinnerService.showSpinner();
    if(originAction == 'manual') {
      this.periodDetailHeaderReceived.period.finalDate = new Date();
    }

    this._periodService.closePeriod(this.periodDetailHeaderReceived.period).subscribe(
      response => {
        this._loadSpinnerService.hideSpinner();
        Swal.fire(response.title, response.message,response.status);
        this._periodService.saveToLocalStorage(response.object);
        this._router.navigate(["/period"]);
      }, 
      error => {
        this._loadSpinnerService.hideSpinner();
        console.log(error);
        Swal.fire(error.error.title, error.error.message,error.error.status);
      }
    );
  }

  editingFinalDate() {
    this.flagCalendarpPopUp = true;
  }

  closePeriod(originAction: string){
    Swal.fire({
      title: '',
      text: "Este procedimiento cerrará y aperturará un nuevo periodo, por favor confirmar acción.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closePeriodAtomatic(originAction);
      }
    })
    
  }

  receiveResponseFromCalendarToParent(data: any) {
    this.flagCalendarpPopUp = false;
    if(data.dateRange == undefined) return;

    let dateSelectSingleOption = new Date();
    let timeMilisDateSelected = (new Date(data.dateRange.finalDate)).getTime();
    let timeMilisDateInitialPeriod = (new Date(this.periodDetailHeaderReceived.period.startDate)).getTime();
    
    if(timeMilisDateInitialPeriod >= timeMilisDateSelected) {
      if(data.action == null) {
        Swal.fire("","La fecha seleccionada debe ser mayor a la fecha inicial del periodo actual","info");
        return;
      }

      if(data.action == "quincenal") {
        dateSelectSingleOption = new Date(
          (data.dateRange.finalDate).getFullYear(),
          (data.dateRange.finalDate).getMonth()+1,
          15
        )
      }

      timeMilisDateSelected = (dateSelectSingleOption).getTime();
    }

    if(data.action == null && data.dateRange.finalDate.getDate() >= 29) {
        Swal.fire({
          title: '',
          text: "Recuerde que no todas los meses tienen esta cantidad de días, para estos casos se tomará los fines de mes.",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK!'
        }).then((result) => {
          if (result.isConfirmed) {
            // let dateFinalSend = timeMilisDateSelected + 3600000*23 + 60000*59 + 59*1000; 
            let dateFinalSend = timeMilisDateSelected;        
            this.updateFinalDatePeriod(new Date(dateFinalSend));
          }
        })
      return;
    }

    // let dateFinalSend = timeMilisDateSelected + 3600000*23 + 60000*59 + 59*1000;
    let dateFinalSend = timeMilisDateSelected;

    this.updateFinalDatePeriod(new Date(dateFinalSend));
  }

  updateFinalDatePeriod(newFinalDate: Date) {
    this._loadSpinnerService.showSpinner();
    //Seteo de fecha final y activación
    this.periodShow = this.periodDetailHeaderReceived.period;
    this.periodShow.activate = true;
    //this.periodShow.finalDate = this._utilitariesService.convertDateGMTToString(newFinalDate, "final");
    this.periodShow.finalDate = newFinalDate;
    this._periodService.updatePeriod(this.periodShow, 
        this.periodDetailHeaderReceived.period.id).subscribe(
      response => {
        this._loadSpinnerService.hideSlow();
        Swal.fire("","Se realizó con éxito la modificación de la fecha de cierre.","info");
        if(response.object == null) return;

        this.periodShow = response.object;
        this._periodService.saveToLocalStorage(response.object);
      }, 
      error => {
        this._loadSpinnerService.hideSpinner();
        console.log(error.error);
      }
    );
  }

}
