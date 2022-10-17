import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { IExpenseReceivedShowHeaderExpense } from '@data/interfaces/iexpense-params-receive-header.interface';
import { IExpensesSendParams } from '@data/interfaces/iexpense-params-send.interface';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { UtilService } from '@shared/services/util.service';
import { PeriodModel } from 'app/data/models/business/period.model';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {
 
  period: PeriodModel = new PeriodModel();
  heightHeader: number = 0;

  @Input() dataReceivedToShowHeaderFromExpenseBody : IExpenseReceivedShowHeaderExpense = {
    total : 0,
    availableAmount : 0,
    dateBegin : "", 
    dateEnd : "",
    optionOrigin : "",
    flagIsPendingCollect : false,
    flagShowAvailableAmoount : false,
    flagIsPeriodFinalized : false
  }
  
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  @Output() redirectToParentFromHeader: EventEmitter<IExpensesSendParams> = new EventEmitter();
  
  constructor(private _utilitariesService: UtilService, private _loaderService : SLoaderService) { 
      this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
  }

  ngOnInit(): void {}

  sendOrderToExpenseShow() {
    this._loaderService.showSpinner();
    let iExpensesSendParams :IExpensesSendParams = { 
      idPeriod : this.period.id,
      dateBegin : this.period.startDate.toString(),
      dateEnd : this.period.finalDate.toString(),
      optionOrigin : CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_EXPENSES_ACTUAL_PERIOD
    };
    this._utilitariesService.sendDatesFromCalendarSelected(iExpensesSendParams);
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.container_header.nativeElement.clientHeight;
    this.heightHeader=windowHeight-heightForm;
    this.emitterHeight.emit(this.heightHeader);
  }

}
