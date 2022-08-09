import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { AccountService } from '@data/services/account/account.service';
import { UtilService } from '@shared/services/util.service';
import { PeriodModel } from 'app/data/models/business/period.model';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {
 
  period: PeriodModel = new PeriodModel();
  accountMain: AccountModel =  new AccountModel();

  @Input() totalGastadoReceived: number = 0.00;

  //Catching & send height header component
  heightHeader: number = 0;
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  @Output() emitterSearching= new EventEmitter();
  
  constructor(
    private _accountService: AccountService,
    private _utilitariesService: UtilService
  ) { 
    this.receivingTotalSpentBySearchingExpense();
  }

  ngOnInit(): void {
   
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    if(this.period == null) {
      this.period = new PeriodModel();
      return;
    }
    this.showAvailableAmountFromAccountMain();
    
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

  receivingTotalSpentBySearchingExpense() {
    this.totalGastadoReceived = 0;
    this._utilitariesService.receivingTotalSpentToHeaderFromExpenseListMessage().subscribe(
      response => {
        this.totalGastadoReceived = response;  
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
