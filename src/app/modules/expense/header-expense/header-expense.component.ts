import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { Workspace } from '@data/models/business/workspace.model';
import { AccountService } from '@data/services/account/account.service';
import { ExpensesService } from '@data/services/expenses/expenses.service';
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

  @Input() totalGastadoReceived: number = 0.00;
  // totalGastadoReceived: number = 0.00;

  //Catching & send height header component
  heightHeader: number = 0;
  availableAmount: number = 0.00;
  
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  @Output() emitterSearching= new EventEmitter();
  
  constructor(
    private _accountService: AccountService,
    private _utilitariesService: UtilService,
    private _expenseService: ExpensesService
  ) { 
    
    this.receivingTotalSpentBySearchingExpense();
    this.receivingDataCalendar();
  }

  receivingDataCalendar() {
    this._utilitariesService.receivingdDatesFromCalendarSelected().subscribe(
      response => {
        this.period.startDate = this._utilitariesService.convertDateGMTToString(new Date(response.startDate), "initial");
        this.period.finalDate = this._utilitariesService.convertDateGMTToString(new Date(response.finalDate), "final");
  
      }, 
      error => {
        console.log(error.error);
        this.period.startDate = this._utilitariesService.convertDateGMTToString(new Date(), "initial");
        this.period.finalDate = this._utilitariesService.convertDateGMTToString(new Date(), "final");
      }
    );
  }

  ngOnInit(): void {
    this.wrkspc = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    
    if(this.period == null) {
      this.period = new PeriodModel();
      this.validateHourIfExistPeriod();
      return;
    }    
  }
  
  showAvailableAmountFromAccountMain(originReceived: string) {
    this._accountService.findAccountByTypeAccountAndStatusAccountAndPeriodId(1, TypeSatusAccountOPC.PROCESS, this.period.id)
      .subscribe(
        response => {
          this.accountMain = response;
          if(this.accountMain != null && originReceived == "initial"){
            this.availableAmount =  parseFloat(this.accountMain.balance) - this.totalGastadoReceived;
          }
        },
        error => {
          console.error(error.error);
        }
      );
  }

  validateHourIfExistPeriod() {
    if(this.period.id != 0) {
      this.period.startDate = this._utilitariesService.getDateAddHoursOffset(this.period.startDate.toString(), "plus").toString();
      this.period.finalDate = this._utilitariesService.getDateAddHoursOffset(this.period.finalDate.toString(), "plus").toString();
      return;
    }

    this.period.startDate =new Date().toString();
    this.period.finalDate =new Date().toString();
  }

  receivingTotalSpentBySearchingExpense() {
    this.totalGastadoReceived = 0;
    this._utilitariesService.receivingTotalSpentToHeaderFromExpenseListMessage().subscribe(
      response => {
        this.totalGastadoReceived = response.total;
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
