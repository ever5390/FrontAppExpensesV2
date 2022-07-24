import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AccountModel, TypeSatusAccountOPC } from '@data/models/business/account.model';
import { AccountService } from '@data/services/account/account.service';
import { UtilService } from '@shared/services/util.service';
import { PeriodModel } from 'app/data/models/business/period.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header-expense',
  templateUrl: './header-expense.component.html',
  styleUrls: ['./header-expense.component.css']
})
export class HeaderExpenseComponent implements OnInit {

  subject = new Subject();
  
  period: PeriodModel = new PeriodModel();
  accountMain: AccountModel =  new AccountModel();

  @Input() totalGastadoReceived: number = 0.00;


  //Show component menu
  sendFlagShowMenuFilterMain: boolean = false;

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
    if(this.period == null) return;
    this.showAvailableAmountFromAccountMain();

    this.searchActivateFunction();
    
  }

  searchActivateFunction() {
    //Deprecated in v.6 , deleting in futures versions
    // this.search.valueChanges.pipe(
    //   debounceTime(200) // Cuando pare de escribir pasen 300 ms recíen enviará .
    // ).subscribe((value:string) => {
    //       this.listaShared = this.dataStructureListReceived.lista.filter(item => {
    //         return item.name.toUpperCase().includes(value.toUpperCase()) 
    //       }
    //       );                    
    //   }
    // )
      this.subject.pipe(
        debounceTime(200)
      ).subscribe((searchText:any) => {
          
          this.emitterSearching.emit(searchText);
        }
      )
  }

  searchMethod(evt:any) {
    const searchText = evt.target.value;
    this.subject.next(searchText)
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
