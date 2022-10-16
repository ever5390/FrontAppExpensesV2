import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { Workspace } from '@data/models/business/workspace.model';
import { AccountService } from '@data/services/account/account.service';
import { UtilService } from '@shared/services/util.service';
import { PeriodModel } from 'app/data/models/business/period.model';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {
 
  wrkspc: Workspace = new Workspace();
  period: PeriodModel = new PeriodModel();
  accountMain: AccountModel =  new AccountModel();
  
  @Input() dataReceivedFromExpenseBody =  {
    totalExpense : 0,
    showPendingCollect: false
  }

  //Catching & send height header component
  heightHeader: number = 0;
  availableAmount: number = 0.00;

  emisorComponent : string = "initial";
  
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  @Output() emitterSearching= new EventEmitter();
  
  constructor(
    private _accountService: AccountService,
    private _utilitariesService: UtilService) { 
    
    this.receivingTotalSpentBySearchingExpense();
    this.receivingDataCalendar();
  }

  ngOnInit(): void {
    this.wrkspc = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
  }

  receivingDataCalendar() {
    this._utilitariesService.receivingdDatesFromCalendarSelected().subscribe(
      response => {
        this.emisorComponent = "calendar";
        this.period.startDate = (response.action =='reset')?response.dateRange.startDate:this._utilitariesService.convertDateGMTToString(new Date(response.dateRange.startDate), "initial");
        this.period.finalDate = (response.action =='reset')?response.dateRange.finalDate:this._utilitariesService.convertDateGMTToString(new Date(response.dateRange.finalDate), "final");  
      },
      error => {
        this.period.startDate = new Date();
        this.period.finalDate = new Date();
      }
    );
  }

  showAvailableAmountFromAccountMain(originReceived: string) {
    this._accountService.findAccountByTypeAccountAndStatusAccountAndPeriodId(1, TypeSatusAccountOPC.PROCESS, this.period.id)
      .subscribe(
        response => {
          this.accountMain = response;
          if(this.accountMain != null && originReceived == "initial"){
            this.availableAmount =  parseFloat(this.accountMain.balance) - this.dataReceivedFromExpenseBody.totalExpense;
          }
        },
        error => {
          console.error(error.error);
        }
      );
  }

  resetExpenseByPeriodSelected(orden: string) {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    let dataSend:any = [];
    dataSend.startDate = this.period.startDate.toString();
    dataSend.finalDate = this.period.finalDate.toString();

    this._utilitariesService.sendDatesFromCalendarSelected({
      "component": CONSTANTES.CONST_COMPONENT_HEADER,
      "action": "reset",
      "dateRange": dataSend
    });
  }

  receivingTotalSpentBySearchingExpense() {
    this.dataReceivedFromExpenseBody.totalExpense = 0;
    this._utilitariesService.receivingTotalSpentToHeaderFromExpenseListMessage().subscribe(
      response => {
        this.dataReceivedFromExpenseBody.totalExpense = response.total;
        this.showAvailableAmountFromAccountMain(response.from);
      }, 
      error =>{
        console.log(error.error);
      });
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.container_header.nativeElement.clientHeight;
    this.heightHeader=windowHeight-heightForm;
    this.emitterHeight.emit(this.heightHeader);
  }

}
