import { NgModule } from '@angular/core';
import { ListPeriodComponent } from './list-period/list-period.component';
import { DetailPeriodComponent } from './detail-period/detail-period.component';
import { PeriodRoutingModule } from './period-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { DetailHeaderPeriodComponent } from './detail-header-period/detail-header-period.component';
import { DetailBodyPeriodComponent } from './detail-body-period/detail-body-period.component';
import { AccountComponent } from './account/account.component';
import { ListCategoryComponent } from '@modules/category/list-category/list-category.component';

@NgModule({
  declarations: [
    ListPeriodComponent,
    DetailPeriodComponent,
    DetailHeaderPeriodComponent,
    DetailBodyPeriodComponent,
    AccountComponent
  ],
  imports: [
    SharedModule,
    PeriodRoutingModule
  ]
})
export class PeriodModule { }
