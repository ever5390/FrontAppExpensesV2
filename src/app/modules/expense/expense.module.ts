import { NgModule } from '@angular/core';
import { SkeletonExpenseComponent } from './skeleton-expense/skeleton-expense.component';
import { BodyExpenseComponent } from './body-expense/body-expense.component';
import { ListExpenseComponent } from './body-list-expense/list-expense.component';
import { FilterExpenseComponent } from './filter-expense/filter-expense.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { HeaderExpenseComponent } from './header-expense/header-expense.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { ListPaymentMethodComponent } from '@modules/payment-method/list-payment-method/list-payment-method.component';
import { ListCategoryComponent } from '@modules/category/list-category/list-category.component';
import { ListAccordingComponent } from '@modules/according/list-according/list-according.component';

@NgModule({
  declarations: [
    SkeletonExpenseComponent,
    BodyExpenseComponent,
    ListExpenseComponent,
    FilterExpenseComponent,
    ManageExpenseComponent,
    HeaderExpenseComponent,

    ListPaymentMethodComponent,
    ListCategoryComponent,
    ListAccordingComponent,
    
  ],
  imports: [
    SharedModule,
    ExpenseRoutingModule
  ]
})
export class ExpenseModule { }
