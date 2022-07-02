import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailAccordingComponent } from './detail-according/detail-according.component';
import { ListAccordingComponent } from './list-according/list-according.component';

const routes: Routes = [
  {
    path:'according-list',
    component: ListAccordingComponent
  },
  {
    path:'according-detail',
    component: DetailAccordingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccordingRoutingModule { }
