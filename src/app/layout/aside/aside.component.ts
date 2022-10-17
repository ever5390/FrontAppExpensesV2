import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { IExpensesSendParams } from '@data/interfaces/iexpense-params-send.interface';
import { ExpenseModel } from '@data/models/business/expense.model';
import { OwnerModel } from '@data/models/business/owner.model';
import { Workspace } from '@data/models/business/workspace.model';
import { ExpensesService } from '@data/services/expenses/expenses.service';
import { UserService } from '@data/services/user/user.service';
import { UtilService } from '@shared/services/util.service';
import { PeriodModel } from 'app/data/models/business/period.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {


  flagShowOptionPeriod: boolean = false;
  owner : OwnerModel = new OwnerModel();
  wrkspc: Workspace = new Workspace();
  period : PeriodModel = new PeriodModel();

  expensePendingPayList:ExpenseModel[] = [];
  totalExpensesPengingCollect: number = 0;

  @ViewChild('aside') aside: ElementRef | any;
  @Input("active_menu") active_menu: boolean = false;
  @Output() hiddenMenuNow: EventEmitter<boolean> = new EventEmitter();
  @Output() redirectToParentFromAside: EventEmitter<IExpensesSendParams> = new EventEmitter();
    
  constructor(
    private _renderer: Renderer2,
    private _routes: Router,
    private _userService: UserService,
    private _expenseService: ExpensesService,
    private _utilitariesService: UtilService
  ) {
    this.listenClickOut();
   }

  
  ngOnInit(): void {
    this.wrkspc = JSON.parse(localStorage.getItem('lcstrg_worskpace')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.owner = this.wrkspc.owner;
    
    if(this.period != null && this.period.id != 0) {
        this.flagShowOptionPeriod = true;
    }

    this.totalExpensesPengingCollect = Number(localStorage.getItem("totalExpensesPengingCollect")?localStorage.getItem("totalExpensesPengingCollect"):"0");

    this.getAllExpensesByWorkspaceAndDateRangePeriod(
      this.wrkspc.id,
      this._utilitariesService.convertDateGMTToString(new Date("2022-01-01"), "start"),
      this._utilitariesService.convertDateGMTToString(new Date(), "final"),
      "onlyPendingCollect"
    );

  }

  getAllExpensesByWorkspaceAndDateRangePeriod(idWorkspace: number, dateBegin: string, dateEnd: string, onlyPendingCollect : string) {
    this._expenseService.getAllExpensesByWorkspaceAndDateRange(idWorkspace, dateBegin, dateEnd).subscribe(
      response => {
        response = response.filter(item => item.pendingPayment == true);
        this.totalExpensesPengingCollect = response.length;
        localStorage.setItem("totalExpensesPengingCollect", this.totalExpensesPengingCollect.toString());
      },
      error => {
        console.log(error);
      }
    );
  }

  loggout() {
    Swal.fire("",`Hola ${this.owner.username}, nos vemos luego`,"info");
    this._userService.logoutSession();
    this._routes.navigate(["/login"]);
  }


  redirectRoutes(destiny: string){

    switch (destiny) {
      case 'workspace':
        this.sendOrderToExpenseShow(CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_EXPENSES_ACTUAL_PERIOD, this.period.id);
        break;
      case 'expensesCollect':
        this.sendOrderToExpenseShow(CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_PENDING_COLLECT, 0);
        break;
      case 'according':
        this._routes.navigate(['/according']);
        break;
      case 'category':
        this._routes.navigate(['/category']);
        break;
      case 'paymentmethod':
        this._routes.navigate(['/payment-method']);
        break;
      case 'period':
        this._routes.navigate(['/period']);
        break;
      default:
        break;
    }

    this.hiddenMenu();
  }

  sendOrderToExpenseShow(optionSend: string, idPeriod : number) { 
    let iExpensesSendParams :IExpensesSendParams = { 
      idPeriod : idPeriod,
      dateBegin : "2022-01-01",
      dateEnd : "",
      optionOrigin : optionSend
    };
    this._expenseService.saveObjectParamsToSendExpensesShowByOptions(iExpensesSendParams);
    this.redirectToParentFromAside.emit(iExpensesSendParams);
  }

  hiddenMenu() {
    this.active_menu = false;
    this.hiddenMenuNow.emit(false);
  }

  listenClickOut() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.aside && e.target === this.aside.nativeElement){
        this.hiddenMenu();
      }
    });
  }

}
