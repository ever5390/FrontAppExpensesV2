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

  //Catching & send height header component
  heightHeader: number = 0;
  availableAmount: number = 0;
  
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  @Output() emitterSearching= new EventEmitter();
  
  constructor(
    private _accountService: AccountService,
    private _utilitariesService: UtilService,
    private _expenseService: ExpensesService
  ) { 
    
    this.receivingTotalSpentBySearchingExpense();
  }

  ngOnInit(): void {
    this.wrkspc = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);

    if(this.period == null) {
      this.period = new PeriodModel();
      return;
    }
    this.showAvailableAmountFromAccountMain();
    this.getAllExpensesByWorkspaceAndDateRangePeriod(
      this.wrkspc.id,
      this._utilitariesService.convertDateToString(this.period.startDate),
      this._utilitariesService.convertDateToString(this.period.finalDate));
  }

  showAvailableAmountFromAccountMain() {
    this._accountService.findAccountByTypeAccountAndStatusAccountAndPeriodId(1, TypeSatusAccountOPC.PROCESS, this.period.id)
      .subscribe(
        response => {
          this.accountMain = response;
        },
        error => {
          console.error(error.error);
        }
      );
  }

  getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc: number, dateBegin: string, dateEnd: string) {  
    
    this._expenseService.getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc, dateBegin, dateEnd).subscribe(
      response => {
        this.totalGastadoReceived = 0;
        response.forEach(element => {                           
          this.totalGastadoReceived = this.totalGastadoReceived + parseFloat(element.amount);
        });
        this.availableAmount =  parseFloat(this.accountMain.balance) - this.totalGastadoReceived;
      },
      error => {
        console.log(error);
      }
    );
  }

  receivingTotalSpentBySearchingExpense() {
    this.totalGastadoReceived = 0;
    this._utilitariesService.receivingTotalSpentToHeaderFromExpenseListMessage().subscribe(
      response => {
        this.totalGastadoReceived = response;
        //console.log(this.accountMain.balance);
        //this.availableAmount = parseFloat(this.accountMain.balance) - this.totalGastadoReceived;
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
