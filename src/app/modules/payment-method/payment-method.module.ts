import { NgModule } from '@angular/core';
import { ListPaymentMethodComponent } from './list-payment-method/list-payment-method.component';
import { DetailPaymentMethodComponent } from './detail-payment-method/detail-payment-method.component';
import { PaymentMethodRoutingModule } from './payment-method-routing.module';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    //ListPaymentMethodComponent,
    DetailPaymentMethodComponent
  ],
  imports: [
    PaymentMethodRoutingModule,
    SharedModule

  ]
})
export class PaymentMethodModule { }
