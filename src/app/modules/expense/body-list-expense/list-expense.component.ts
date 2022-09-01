import { Component, Input, OnInit } from '@angular/core';
import { ExpensesService } from '@data/services/expenses/expenses.service';
import { ExpenseModel } from 'app/data/models/business/expense.model';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.css']
})
export class ListExpenseComponent implements OnInit {

  expenseList : ExpenseModel[] = [];
  @Input("receivedListExpensesToBodyList") receivedListExpensesToBodyList:any[] = [];
  
  constructor(
    private _expenserService: ExpensesService
  ) { }

  ngOnInit(): void {  
    this.expenseList = this.receivedListExpensesToBodyList;
  }

  // updatePayedExpense(expenseUpdate: number) {
  //   this._expenserService.updateStatusPayedExpense(expenseUpdate).subscribe(
  //     response => {

  //     },
  //     error => {

  //     }
  //   );
  // }

}
