import { Component, Input, OnInit } from '@angular/core';
import { ExpenseModel } from 'app/data/models/business/expense.model';

@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.css']
})
export class ListExpenseComponent implements OnInit {

  expenseList : ExpenseModel[] = [];
  @Input("receivedListExpensesToBodyList") receivedListExpensesToBodyList:any[] = [];
  
  constructor() { }

  ngOnInit(): void {  
    this.expenseList = this.receivedListExpensesToBodyList;
  }

}
