import { Component, OnInit } from '@angular/core';
import { UtilService } from '@shared/services/util.service';
import { ExpenseModel } from 'app/data/models/business/expense.model';
import { PeriodModel } from 'app/data/models/business/period.model';
import { ExpensesService } from 'app/data/services/expenses/expenses.service';
import { PeriodService } from 'app/data/services/period/period.service';

@Component({
  selector: 'app-skeleton-expense',
  templateUrl: './skeleton-expense.component.html',
  styleUrls: ['./skeleton-expense.component.css']
})
export class SkeletonExpenseComponent implements OnInit {

  sendHeightHeaderToBody: string = '';
  showBody: boolean = false;

  // expense: Expense
  sendListExpensesToBody: ExpenseModel[] = [];
  period: PeriodModel = new PeriodModel();
  totalGastadoSend: number = 0;

  constructor(
    private _expenseService: ExpensesService,
    private _periodService: PeriodService,
    private _utilService: UtilService
  ) { }

  ngOnInit(): void {

    
  }

  getAll(dateBegin: string, dateEnd: string) {   
    this._expenseService.getAllExpenses(dateBegin, dateEnd).subscribe(
      response => {
        console.log(response);
        this.showBody = true;
        this.sendListExpensesToBody = response;
        this.sendListExpensesToBody.forEach(element => {
          this.totalGastadoSend = this.totalGastadoSend + parseFloat(element.amount);
        });
      },
      error => {
        console.log(error);
      }
    );
  }





  
  receivedHeightHeader(e:number) {
    this.sendHeightHeaderToBody = e.toString();
    setTimeout(()=> {
      this.catchPeriodAndGetAllListExpenses();
    },50);
  }

  catchPeriodAndGetAllListExpenses() {
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    //console.log(this.period);
    //Workspace Id : caprturarlo desde WORKSPACE inicial
    if(this.period == null) {
      this.getPeriodIfNotExist();
    } else {

      this.getAll(this._utilService.convertDateToString(this.period.startDate),
                       this._utilService.convertDateToString(this.period.finalDate));      
    }
  }

  getPeriodIfNotExist() {
    this._periodService.getPeriodByWorkspaceIdAndSatusTrue(1).subscribe(
        response => {
          this.period = response;
          if(this.period != null && this.period.id != 0) {
            localStorage.setItem("lcstrg_periodo", JSON.stringify(this.period));
            this.getAll(this._utilService.convertDateToString(this.period.startDate), this._utilService.convertDateToString(this.period.finalDate));      
          }
        }, error => {
          console.log(error);
        }
      );
  }

}
