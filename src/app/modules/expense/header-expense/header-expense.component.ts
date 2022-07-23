import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { AccountService } from '@data/services/account/account.service';
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


  //Show component menu
  sendFlagShowMenuFilterMain: boolean = false;

  //Catching & send height header component
  heightHeader: number = 0;
  @ViewChild("container_header") container_header : ElementRef | any;
  @Output() emitterHeight= new EventEmitter();
  
  constructor(
    private _renderer: Renderer2,
    private _accountService: AccountService
  ) { 
  }

  ngOnInit(): void {
   
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    if(this.period == null) return;
    this.showAvailableAmountFromAccountMain();
  }

  showAvailableAmountFromAccountMain() {
    console.log(TypeSatusAccountOPC.PROCESS + "--" + this.period.id);
    this._accountService.findAccountByTypeAccountAndStatusAccountAndPeriodId(1, TypeSatusAccountOPC.PROCESS, this.period.id)
      .subscribe(
        response => {
          console.log(response);
          this.accountMain = response;
        },
        error => {
          console.error(error.error);
        }
      );
  }
  //Show and catching menu y height
  showMenuOptions() {
    this.sendFlagShowMenuFilterMain = true;
  }

  receivingFlagHiddenMenuFilterMain(hidden: boolean) {
    this.sendFlagShowMenuFilterMain = hidden;
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.container_header.nativeElement.clientHeight;
    this.heightHeader=windowHeight-heightForm;
    this.emitterHeight.emit(this.heightHeader);
  }

}
