import { NgModule } from '@angular/core';
import { SkeletonExpenseComponent } from './skeleton-expense/skeleton-expense.component';
import { BodyExpenseComponent } from './body-expense/body-expense.component';
import { ListExpenseComponent } from './body-list-expense/list-expense.component';
import { FilterExpenseComponent } from './body-filter-expense/filter-expense.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { HeaderExpenseComponent } from './header-expense/header-expense.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    SkeletonExpenseComponent,
    BodyExpenseComponent,
    ListExpenseComponent,
    FilterExpenseComponent,
    ManageExpenseComponent,
    HeaderExpenseComponent
  ],
  imports: [
    SharedModule,
    ExpenseRoutingModule
  ]
})
export class ExpenseModule { }
