import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterExpenseComponent } from './filter-expense/filter-expense.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { SkeletonExpenseComponent } from './skeleton-expense/skeleton-expense.component';

const routes: Routes = [
  {
    path:'',
    component: SkeletonExpenseComponent
  },
  {
    path:'expense-detail',
    component: ManageExpenseComponent
  },
  {
    path:'expense-filter',
    component: FilterExpenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
