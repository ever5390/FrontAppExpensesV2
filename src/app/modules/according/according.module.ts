import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AccordingRoutingModule } from './according-routing.module';
import { DetailAccordingComponent } from './detail-according/detail-according.component';
import { ListAccordingComponent } from './list-according/list-according.component';

@NgModule({
  declarations: [
    DetailAccordingComponent,
    //ListAccordingComponent
  ],
  imports: [
    AccordingRoutingModule,
    SharedModule
  ]
})
export class AccordingModule { }
