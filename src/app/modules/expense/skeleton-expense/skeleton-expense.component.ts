import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { OwnerModel } from '@data/models/business/owner.model';
import { Workspace } from '@data/models/business/workspace.model';
import { FilterExpensesModel } from '@data/models/Structures/data-object-filtering.model';
import { UtilService } from '@shared/services/util.service';
import { ExpenseModel, Tag } from 'app/data/models/business/expense.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { ExpensesService } from 'app/data/services/expenses/expenses.service';
import { PeriodService } from 'app/data/services/period/period.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skeleton-expense',
  templateUrl: './skeleton-expense.component.html',
  styleUrls: ['./skeleton-expense.component.css']
})
export class SkeletonExpenseComponent implements OnInit {

  sendHeightHeaderToBody: string = '';
  showBody: boolean = false;

  // expense: Expense
  listExpensesToBody: ExpenseModel[] = [];
  sendListExpensesToBody: ExpenseModel[] = [];
  totalGastadoSend: number = 0;

  owner : OwnerModel = new OwnerModel();
  wrkspc: Workspace = new Workspace();
  period : PeriodModel = new PeriodModel();

  originComponent : string = "initial";

  constructor(
    private _expenseService: ExpensesService,
    private _periodService: PeriodService,
    private _utilitariesService: UtilService
  ) {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.wrkspc = JSON.parse(localStorage.getItem("lcstrg_worskpace")!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);

    this.receivingDataCalendar();
  }

  ngOnInit(): void {
    this.catchPeriodAndGetAllListExpenses();
  }

  receivingDataCalendar() {

    this._utilitariesService.receivingdDatesFromCalendarSelected().subscribe(
      response => {
        this.originComponent = "calendar";
        console.log("response recive cal");
        console.log(response);
        this.getAllExpensesByWorkspaceAndDateRangePeriod(
          this.wrkspc.id,
          this._utilitariesService.convertDateGMTToString(response.dateRange.startDate, "start"),
          this._utilitariesService.convertDateGMTToString(response.dateRange.finalDate, "final")
        );
      }, 
      error => {
        console.log(error.error);
        this.getAllExpensesByWorkspaceAndDateRangePeriod(
          this.wrkspc.id,
          this._utilitariesService.convertDateGMTToString(new Date(), "initial"),
          this._utilitariesService.convertDateGMTToString(new Date(), "final")
        );
      }
    );
  }

  getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc: number, dateBegin: string, dateEnd: string) {
    this.showBody = false;
    this._expenseService.getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc, dateBegin, dateEnd).subscribe(
      response => {
        this.showBody = true;
        this.sendListExpensesToBody = response;
        this.listExpensesToBody = response;
        this.totalGastadoSend = 0;
        this.sendListExpensesToBody.forEach(element => {
          this.totalGastadoSend = this.totalGastadoSend + parseFloat(element.amount);
        });

        this.createNewColumnWithDataBySearching();

        this._utilitariesService.sendTotalSpentToHeaderFromExpenseListMessage({"total":this.totalGastadoSend, "from":this.originComponent});
      },
      error => {
        console.log(error);
      }
    );
  }


  private createNewColumnWithDataBySearching() {
    this.sendListExpensesToBody.map(element => {
      element.strSearchAllJoin = this.getPayedOrPendingPay(element.pendingPayment) + " " + element.amountShow
        + " " + element.description + " " + element.category.name
        + " " + element.paymentMethod.name + " " + element.accordingType.name
        + " " + (element.account!=null?element.account.accountName:'') + " " + element.payer
        + " " + element.registerPerson.name + " " + this.concatTags(element.tag);
      
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

  receivedHeightHeader(e:number) {
    this.sendHeightHeaderToBody = e.toString();
    setTimeout(()=> {
    },50);
  }

  receivedSearchingEmitFromHeader(strSearch: string) {
    this.showBody = false;
    this.sendListExpensesToBody = this.listExpensesToBody;
    this.sendListExpensesToBody = this.sendListExpensesToBody.filter(item => {
        return item.strSearchAllJoin.toUpperCase().includes(strSearch.toUpperCase()) 
      }
    );
    
    this.getTotalSpentByFilterAndReloadListExpenses();
  }

  catchPeriodAndGetAllListExpenses() {
    if(this.period != null){
      this.originComponent = "initial";
      this.getAllExpensesByWorkspaceAndDateRangePeriod(
        this.wrkspc.id,
        this.period.startDate,
        this.period.finalDate
      );
    } else {
      this.getAllExpensesByWorkspaceAndDateRangePeriod(this.wrkspc.id,
        this._utilitariesService.convertDateToString(new Date()),
        this._utilitariesService.convertDateToString(new Date()));
    }
  }

  getPeriodIfNotExist() {
    this._periodService.getPeriodByWorkspaceIdAndSatusTrue(1).subscribe(
        response => {
          this.period = response;
          if(this.period != null && this.period.id != 0) {
            this._periodService.saveToLocalStorage(response);
            this.getAllExpensesByWorkspaceAndDateRangePeriod(
              this.wrkspc.id,
              this.period.startDate,
              this.period.finalDate
            );
          }
        }, error => {
          console.log(error);
        }
      );
  }





  listaSelcetedFilter: any[] = [];
  beforeItem: FilterExpensesModel = new FilterExpensesModel();
  listShowExpenses: ExpenseModel[] = [];
  receivedItemFilterSeleceted() {
    
   
    this._utilitariesService.receivingItemResumeSelected().subscribe(
      response => {
        let listActive = response.filter( (itemActive: { active: boolean; }) => itemActive.active === true);
      
        this.showBody = false;
        let cont = 0;
        this.sendListExpensesToBody = this.listExpensesToBody;
        if(listActive.length == 0) this.listShowExpenses = this.sendListExpensesToBody;

        listActive.forEach( (itemActive: FilterExpensesModel) => {
          cont++;
          if(cont == 1) {
            this.listShowExpenses = this.sendListExpensesToBody.filter( item => {
              return item.strFilterParamsJoin.includes(itemActive.name);
            });
          } else {
            let listaNew = this.sendListExpensesToBody.filter( item => {
              return item.strFilterParamsJoin.includes(itemActive.name);
            });
            this.listShowExpenses = this.listShowExpenses.concat(listaNew);
          }
          
        });
        console.log(this.listShowExpenses);

        this.sendListExpensesToBody =  this.listShowExpenses;

        this.getTotalSpentByFilterAndReloadListExpenses();

      }, 
      error =>{
        console.log(error.error);
      });

      
  }

  newListFiltered: ExpenseModel[] = [];

  filterByListParams(paramList : ExpenseModel[], paramFilter : FilterExpensesModel): ExpenseModel[] {
      let listReturn : ExpenseModel[] = [];
      listReturn =  paramList.filter( (row)=> {
          if(paramFilter.component == CONSTANTES.CONST_COMPONENT_CATEGORIAS)  {
            return row.category.name == paramFilter.name
          }

          if(paramFilter.component == CONSTANTES.CONST_COMPONENT_ACUERDOS)  {
            return row.accordingType.name == paramFilter.name;
          }

          if(paramFilter.component == CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO)  {
            return row.paymentMethod.name == paramFilter.name;
          }

          return row;
      });

      return listReturn;
  }

  receivedExpenseToUpdateStatausPay(idExpenseToUpdateStatusPayed: any){
    this.showBody = false;
    this._expenseService.updateStatusPayedExpense(idExpenseToUpdateStatusPayed).subscribe(
        response => {
          Swal.fire(response.title, response.message, response.status);
          this.showBody = true;
          if(response.status == "success"){
            this.catchPeriodAndGetAllListExpenses();
          }
        },
        error => {
          console.log(error.error);
        }
    );
  }

  private getTotalSpentByFilterAndReloadListExpenses() {
    this.getTotalSpentBySearching();
    setTimeout(() => {
      this.showBody = true;
    }, 100);
  }

  getTotalSpentBySearching() {
    this.originComponent = "byFilterExpenses";
    let totalGastadoSend = 0;
    this.sendListExpensesToBody.forEach(element => {                           
      totalGastadoSend = totalGastadoSend + parseFloat(element.amount);
    });
    this._utilitariesService.sendTotalSpentToHeaderFromExpenseListMessage({"total":totalGastadoSend, "from":this.originComponent});
  }

}


