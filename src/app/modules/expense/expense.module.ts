import { NgModule } from '@angular/core';
import { SkeletonExpenseComponent } from './skeleton-expense/skeleton-expense.component';
import { BodyExpenseComponent } from './body-expense/body-expense.component';
import { FilterExpenseComponent } from './filter-expense/filter-expense.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { HeaderExpenseComponent } from './header-expense/header-expense.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ListPaymentMethodComponent } from '@modules/payment-method/list-payment-method/list-payment-method.component';
import { ListAccordingComponent } from '@modules/according/list-according/list-according.component';
import { SearchingComponent } from './searching/searching.component';
import { FilterByItemSharedComponent } from './filter-by-item-shared/filter-by-item-shared.component';

@NgModule({
  declarations: [
    SkeletonExpenseComponent,
    BodyExpenseComponent,
    FilterExpenseComponent,
    ManageExpenseComponent,
    HeaderExpenseComponent,

    ListPaymentMethodComponent,
    ListAccordingComponent,
    SearchingComponent,
    FilterByItemSharedComponent
    
  ],
  imports: [
    SharedModule,
    ExpenseRoutingModule
  ]
})
export class ExpenseModule { }
