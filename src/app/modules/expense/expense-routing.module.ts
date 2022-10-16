import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { SkeletonExpenseComponent } from './skeleton-expense/skeleton-expense.component';

const routes: Routes = [
  {
    path:'',
    component: SkeletonExpenseComponent
  },
  {
    path:'period/:idPeriod/expense',
    component: SkeletonExpenseComponent
  },
  {
    path:'workspace/:idWorskpace/expense',
    component: SkeletonExpenseComponent
  },
  {
    path:'expense',
    component: ManageExpenseComponent
  },
  {
    path:'expenses/pending-to-collect/:isPending',
    component: SkeletonExpenseComponent
  },
  {
    path:'expense/notification/:idNotification',
    component: ManageExpenseComponent
  },
  {
    path:'expense/:idExpense',
    component: ManageExpenseComponent
  },
  {
    path:'**',
    component: SkeletonExpenseComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
