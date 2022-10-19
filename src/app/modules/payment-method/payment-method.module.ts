import { NgModule } from '@angular/core';
import { PaymentMethodRoutingModule } from './payment-method-routing.module';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
  ],
  imports: [
    PaymentMethodRoutingModule,
    SharedModule,
    CommonModule

  ]
})
export class PaymentMethodModule { }
