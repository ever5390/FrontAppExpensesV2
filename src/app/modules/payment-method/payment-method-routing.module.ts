import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPaymentMethodComponent } from './detail-payment-method/detail-payment-method.component';
import { ListPaymentMethodComponent } from './list-payment-method/list-payment-method.component';

const routes: Routes = [
  {
    path:'payment-method-list',
    component: ListPaymentMethodComponent
  },
  {
    path:'payment-method-detail',
    component: DetailPaymentMethodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodRoutingModule { }
