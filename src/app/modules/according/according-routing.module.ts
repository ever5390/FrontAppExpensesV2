import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAccordingComponent } from './list-according/list-according.component';

const routes: Routes = [
  {
    path:'',
    component: ListAccordingComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccordingRoutingModule { }
