import { Component, OnInit, OnDestroy } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { IExpenseReceivedShowHeaderExpense } from '@data/interfaces/iexpense-params-receive-header.interface';
import { IExpensesSendParams } from '@data/interfaces/iexpense-params-send.interface';
import { TypeSatusAccountOPC } from '@data/models/business/account.model';
import { OwnerModel } from '@data/models/business/owner.model';
import { Workspace } from '@data/models/business/workspace.model';
import { FilterExpensesModel } from '@data/models/Structures/data-object-filtering.model';
import { AccountService } from '@data/services/account/account.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { UtilService } from '@shared/services/util.service';
import { ExpenseModel, Tag } from 'app/data/models/business/expense.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { ExpensesService } from 'app/data/services/expenses/expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skeleton-expense',
  templateUrl: './skeleton-expense.component.html',
  styleUrls: ['./skeleton-expense.component.css']
})
export class SkeletonExpenseComponent implements OnInit, OnDestroy {

  sendHeightHeaderToBody: string = '';
  showBody: boolean = false;

  backUpListExpensesToBody: ExpenseModel[] = [];
  sendListExpensesToBody: ExpenseModel[] = [];
  totalGastadoSend: number = 0;

  dataSendToShowHeaderExpenses : IExpenseReceivedShowHeaderExpense = {
    total : 0,
    availableAmount : 0,
    dateBegin : "", 
    dateEnd : "",
    optionOrigin : "",
    flagIsPendingCollect : false,
    flagShowAvailableAmoount : false,
    flagIsPeriodFinalized : false
  }

  orderReceivedToShowExpenses : IExpensesSendParams = { 
    idPeriod :-1, 
    dateBegin: "",
    dateEnd: "",
    optionOrigin : ""
  };

  owner : OwnerModel = new OwnerModel();
  workspace: Workspace = new Workspace();
  period : PeriodModel = new PeriodModel();

  originComponent : string = "initial";

  listaSelcetedFilter: any[] = [];
  beforeItem: FilterExpensesModel = new FilterExpensesModel();
  listShowExpenses: ExpenseModel[] = [];

  amountPrincipalAccount : number = 0;

  constructor(
    private _expenseService: ExpensesService,
    private _loadSpinnerService: SLoaderService,
    private _utilitariesService: UtilService,
    private _accountService: AccountService
  ) {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.workspace = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
  }
  
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this._loadSpinnerService.showSpinner();
    this.receivingDataCalendar();
    this.getDataObjectExpenseToShowFromServiceExpenses();
  }

  receivingDataCalendar() {
    this._utilitariesService.receivingdDatesFromCalendarSelected().subscribe(
      response => {
        this.filterToSendExpenses(response.idPeriod, response.dateBegin, response.dateEnd, response.optionOrigin);
      });
  }

  getDataObjectExpenseToShowFromServiceExpenses() {
    this.orderReceivedToShowExpenses = this._expenseService.expenseReciveAndSend;
    this.filterToSendExpenses(this.orderReceivedToShowExpenses.idPeriod, this.orderReceivedToShowExpenses.dateBegin, 
                                  this.orderReceivedToShowExpenses.dateEnd, this.orderReceivedToShowExpenses.optionOrigin );
  }

  filterToSendExpenses(idPeriod : number, dateBegin: string, dateEnd: string, optionOrigin: string) {
    this.showBody = false;
    this.dataSendToShowHeaderExpenses.flagIsPeriodFinalized = false;
    let accountIsNecessary =  false;
    switch (optionOrigin) {
      case CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_EXPENSES_ACTUAL_PERIOD:
        accountIsNecessary = true;
        this.dataSendToShowHeaderExpenses.flagShowAvailableAmoount = true;
        break;
      case CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_CALENDAR:
        this.dataSendToShowHeaderExpenses.flagShowAvailableAmoount = false;
        this.dataSendToShowHeaderExpenses.flagIsPendingCollect = false;
        dateBegin = this._utilitariesService.convertDateGMTToString(new Date(dateBegin), "start");
        dateEnd = this._utilitariesService.convertDateGMTToString(new Date(dateEnd), "final");
        break;
      case CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_PENDING_COLLECT:
        console.log("PCOLECT" + dateBegin);
        this.dataSendToShowHeaderExpenses.flagIsPendingCollect = true;
        dateBegin = this._utilitariesService.convertDateGMTToString(new Date(dateBegin), "start");
        dateEnd = this._utilitariesService.convertDateGMTToString(new Date(), "final");
        break;
      case CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_LAST_PERIODS:
        this.dataSendToShowHeaderExpenses.flagIsPeriodFinalized = true;
        //El periodo pasado por parámetro.
        // dateBegin = this._utilitariesService.convertDateGMTToString(new Date(dateBegin), "start");
        // dateEnd = this._utilitariesService.convertDateGMTToString(new Date(), "final");
        break;
      default:
        //carga inicial
        idPeriod = this.period.id;
        accountIsNecessary = true;
        this.dataSendToShowHeaderExpenses.flagShowAvailableAmoount = true;
        break;
    }

    if(accountIsNecessary) {
      this.getAmountPrincipalAccountIfExist();
    } else if(idPeriod == 0) {
      this.getAllExpensesByWorkspaceAndDateRangePeriod(this.workspace.id, dateBegin, dateEnd, optionOrigin);
    } else {
      this.getAllExpensesByWorkspaceAndPeriodId(idPeriod, dateBegin, dateEnd, optionOrigin);
    }
  }

  //Obtiene el monto de la cuenta principal en estado PROCESS para luego usarlo con el 
  //total gastado y devolver el monto disponible que se enviará al Header Expense
  getAmountPrincipalAccountIfExist() {
    this._accountService.findAccountByTypeAccountAndStatusAccountAndPeriodId(1, TypeSatusAccountOPC.PROCESS, this.period.id)
      .subscribe(
        accountResponse => {
          if(accountResponse != null) this.amountPrincipalAccount = Number(accountResponse.balance);
          this.getAllExpensesByWorkspaceAndPeriodId(this.period.id, 
                                                  this.period.startDate.toString(), 
                                                  this.period.finalDate.toString(), 
                                                  CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_EXPENSES_ACTUAL_PERIOD );
        },
        error => {
          console.log("error" + error);
          this.getAllExpensesByWorkspaceAndPeriodId(this.period.id, 
            this.period.startDate.toString(), 
            this.period.finalDate.toString(), 
            CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_EXPENSES_ACTUAL_PERIOD );
        }
      );
  }

  getAllExpensesByWorkspaceAndPeriodId(idPeriod: number, dateBegin: string, dateEnd: string, optionOrigin : string) {
    this._expenseService.getAllExpensesByWorkspaceAndByPeriodId(this.workspace.id, idPeriod).subscribe(
      response => {
        this.showBody = true;
        this.totalGastadoSend = 0;
        this.sendListExpensesToBody = response;
        this.backUpListExpensesToBody = response;    
        this.sendListExpensesToBody.forEach(element => {
          element.editable = false;
          if(element.payer == "") element.payer = element.registerPerson.name
          if(element.pendingPayment == false && element.payer != element.registerPerson.name) element.editable = true;
          this.totalGastadoSend = this.totalGastadoSend + parseFloat(element.amount);
        });

        //By options ::
        this.dataSendToShowHeaderExpenses.total = this.totalGastadoSend;
        this.dataSendToShowHeaderExpenses.availableAmount = this.amountPrincipalAccount - this.totalGastadoSend;
        this.dataSendToShowHeaderExpenses.dateBegin = dateBegin;
        this.dataSendToShowHeaderExpenses.dateEnd = dateEnd;
        this.dataSendToShowHeaderExpenses.optionOrigin = optionOrigin;
        this.createNewColumnWithDataBySearching();
      },
      error => {
        console.log(error);
        if(error.status == null) {
          Swal.fire("Error","Se generó un error desconocido, revise su conexión e inténtelo más tarde.","error");
        }
      }
    );
  }

  getAllExpensesByWorkspaceAndDateRangePeriod(idworkspace: number, dateBegin: string, dateEnd: string, optionOrigin : string) {
    
    this._expenseService.getAllExpensesByWorkspaceAndDateRange(idworkspace, dateBegin, dateEnd).subscribe(
      response => {
        this.showBody = true;
        if(optionOrigin == CONSTANTES.CONST_TYPE_REQUEST_EXPENSES_SHOW_PENDING_COLLECT) response = response.filter(item => item.pendingPayment == true);

        this.totalGastadoSend = 0;
        this.sendListExpensesToBody = response;
        this.backUpListExpensesToBody = response;    
        this.sendListExpensesToBody.forEach(element => {
          element.editable = false;
          if(element.payer == "") element.payer = element.registerPerson.name
          if(element.pendingPayment == false && element.payer != element.registerPerson.name) element.editable = true;
          this.totalGastadoSend = this.totalGastadoSend + parseFloat(element.amount);
        });

        //By options ::
        this.dataSendToShowHeaderExpenses.total = this.totalGastadoSend;
        this.dataSendToShowHeaderExpenses.availableAmount = 0;
        this.dataSendToShowHeaderExpenses.dateBegin = dateBegin;
        this.dataSendToShowHeaderExpenses.dateEnd = this._utilitariesService.sustractFiveHoursOnlyShowDataBySeachCalendar(new Date(dateEnd));
        this.dataSendToShowHeaderExpenses.optionOrigin = optionOrigin;
        this.createNewColumnWithDataBySearching();
      },
      error => {
        console.log(error);
        if(error.status == null) {
          Swal.fire("Error","Se generó un error desconocido, revise su conexión e inténtelo más tarde.","error");
        }
      }
    );
  }

  private createNewColumnWithDataBySearching() {
    this.sendListExpensesToBody.map(element => {
      element.strSearchAllJoin = this.getPayedOrPendingPay(element.pendingPayment) + " " + element.amountShow
        + " " + element.description + " " + element.category.name
        + " " + element.paymentMethod.name + " " + element.accordingType.name
        + " " + (element.account!=null?element.account.accountName:'') + " pagado por " + element.payer
        // + " " + element.registerPerson.name 
        + " " + this.concatTags(element.tag);
      
      element.strFilterParamsJoin = element.paymentMethod.name + " " + element.accordingType.name
        + " " + element.category.name;
    });
  }

  getPayedOrPendingPay(pendingPayment: boolean): string {
    return pendingPayment?'Pendiente de pago':'Pagado';
  }

  concatTags(tagLis: Tag[]): string {
    let strTagsAllJoin = "";
    tagLis.forEach( tag => {
      strTagsAllJoin.concat(" ",tag.tagName);
    });
    return strTagsAllJoin;
  }

  receivedExpenseToUpdateStatausPay(objectReceived: any){
    this.showBody = false;
    this._loadSpinnerService.showSpinner();
    if(objectReceived.action =="updateStatusPay"){
      this.updateStatusPayExpense(objectReceived.idExpense);
    } else {
      this.deletExpenseById(objectReceived.idExpense);
    }
  }

  private updateStatusPayExpense(idExpense: number) {
    this._expenseService.updateStatusPayedExpense(idExpense).subscribe(
      response => {
        Swal.fire(response.title, response.message, response.status);
        this.showBody = true;
        if(response.status == "success"){
          this.getDataObjectExpenseToShowFromServiceExpenses();
        }
      },
      error => {
        if(error.status == null) {
          Swal.fire("Error","Se generó un error desconocido, revise su conexión e inténtelo más tarde.","error");
          return;
        }
        console.log(error.error);
        Swal.fire(error.error.title, error.error.message, error.error.status);
        this.getDataObjectExpenseToShowFromServiceExpenses();
      }
    );
  }

  private deletExpenseById(idExpense: number) {
    this._expenseService.deleteExpenseById(idExpense).subscribe(
      response => {
        Swal.fire(response.title, response.message, response.status);
        this.showBody = true;
        if(response.status == "success"){
          this.getDataObjectExpenseToShowFromServiceExpenses();
        }
      },
      error => {
        console.log(error.error);
        Swal.fire(error.error.title, error.error.message, error.error.status);
        this.getDataObjectExpenseToShowFromServiceExpenses();
      }
    );
  }

  receivedSearchingEmitFromHeader(strSearch: string) {
    console.log();
    this.showBody = false;
    this.sendListExpensesToBody = this.backUpListExpensesToBody.filter(item =>  item.strSearchAllJoin.toUpperCase().includes(strSearch.toUpperCase()) );
    this.getTotalAndSendHeaderExpense();
  }

  private getTotalAndSendHeaderExpense() {
    setTimeout(() => {
      let totalGastadoSend = 0;
      this.showBody = true;
      this.sendListExpensesToBody.forEach(element => {
        totalGastadoSend = totalGastadoSend + parseFloat(element.amount);
      });
      //Este objeto ya tiene el resto de parámetros llenado al momento de cada carga.
      this.dataSendToShowHeaderExpenses.total = totalGastadoSend;
    }, 100);
  }

  receivedHeightHeader(e:number) {
    this.sendHeightHeaderToBody = e.toString();
    setTimeout(()=> {
    },50);
  }
}


