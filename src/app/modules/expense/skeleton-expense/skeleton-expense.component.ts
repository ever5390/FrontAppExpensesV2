import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { OwnerModel } from '@data/models/business/owner.model';
import { Workspace } from '@data/models/business/workspace.model';
import { FilterExpensesModel } from '@data/models/Structures/data-object-filtering.model';
import { WorkspacesService } from '@data/services/workspace/workspaces.service';
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

  constructor(
    private _expenseService: ExpensesService,
    private _periodService: PeriodService,
    private _workspaceService: WorkspacesService,
    private _utilService: UtilService,
    private _router: Router
  ) {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
   }

  ngOnInit(): void {
    console.log("dd");
    this.receivedItemFilterSeleceted();
    this.getAllWorkspaceByOwnerId();
  }

  getAllWorkspaceByOwnerId() {
    this._workspaceService.getAllWorkspaceByOwnerId(this.owner.id).subscribe(
      response => {
        this.wrkspc = response.filter( item => item.active == true)[0];
        this.getAllPeriodsByWorskpaceId();

      }, error => {
        console.log(error);
      }
    );
  }

  getAllPeriodsByWorskpaceId() {
    //Obtiene lista de periodos.
    this._periodService.getAllPeriodaByWorkspace(this.wrkspc.id).subscribe(
      response => {
        if(response.length == 0){ 
          this.getAllExpensesByWorkspaceAndDateRangePeriod(this.wrkspc.id,
            this._utilService.convertDateToString(new Date()),
            this._utilService.convertDateToString(new Date()));
        } else {
          this.period = response.filter( item => item.activate == true)[0];
          if(this.period.id != null){
            this.getAllExpensesByWorkspaceAndDateRangePeriod(
              this.wrkspc.id,
              this._utilService.convertDateToString(this.period.startDate),
              this._utilService.convertDateToString(this.period.finalDate));
          } else {
            this._router.navigate(["/dashboard/period-list"]);
          }
        }
      },
      error => {
          console.log(error);
          Swal.fire("","Error al obtener la lista de periodos","error");
      }
    );
  }

  getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc: number, dateBegin: string, dateEnd: string) {  
    this._expenseService.getAllExpensesByWorkspaceAndDateRangePeriod(idWrkspc, dateBegin, dateEnd).subscribe(
      response => {
        
        this.showBody = true;
        this.sendListExpensesToBody = response;
        this.listExpensesToBody = response;

        this.sendListExpensesToBody.forEach(element => {                           
          this.totalGastadoSend = this.totalGastadoSend + parseFloat(element.amount);
        });

        this.createNewColumnWithDataBySearching();
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
        + " " + element.account.accountName + " " + element.payer
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
      strTagsAllJoin.concat(" ",tag.name);
    });
    return strTagsAllJoin;
  }

  receivedHeightHeader(e:number) {
    this.sendHeightHeaderToBody = e.toString();
    setTimeout(()=> {
      this.catchPeriodAndGetAllListExpenses();
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
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    //console.log(this.period);
    //Workspace Id : caprturarlo desde WORKSPACE inicial
    if(this.period == null) {
      this.getPeriodIfNotExist();
    } else {
      this.getAllExpensesByWorkspaceAndDateRangePeriod(
        this.wrkspc.id,
        this._utilService.convertDateToString(this.period.startDate),
        this._utilService.convertDateToString(this.period.finalDate));
    }
  }

  getPeriodIfNotExist() {
    this._periodService.getPeriodByWorkspaceIdAndSatusTrue(1).subscribe(
        response => {
          this.period = response;
          if(this.period != null && this.period.id != 0) {
            localStorage.setItem("lcstrg_periodo", JSON.stringify(this.period));
            this.getAllExpensesByWorkspaceAndDateRangePeriod(
              this.wrkspc.id,
              this._utilService.convertDateToString(this.period.startDate),
              this._utilService.convertDateToString(this.period.finalDate));
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
    
   
    this._utilService.receivingItemResumeSelected().subscribe(
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
      console.log("paramList");
      console.log(paramList);
      console.log("paramFilter");
      console.log(paramFilter);
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

  private getTotalSpentByFilterAndReloadListExpenses() {
    this.getTotalSpentBySearching();
    setTimeout(() => {
      this.showBody = true;
    }, 100);
  }

  getTotalSpentBySearching() {
    let totalSend = 0;
    this.sendListExpensesToBody.forEach(element => {                           
      totalSend = totalSend + parseFloat(element.amount);
    });
    this._utilService.sendTotalSpentToHeaderFromExpenseListMessage(totalSend);
  }

}


