import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';

const routes: Routes = [
  {
    path:'',
    component: SkeletonComponent,
    children: [
      {
        path:'',
        loadChildren: ()=> import('@modules/expense/expense.module')
              .then( m => m.ExpenseModule)
      },
      {
        path:'',
        loadChildren: ()=> import('@modules/period/period.module')
              .then( m => m.PeriodModule)
      },
      {
        path:'',
        loadChildren: ()=> import('@modules/category/category.module')
              .then( m => m.CategoryModule)
      },
      {
        path:'',
        loadChildren: ()=> import('@modules/according/according.module')
              .then( m => m.AccordingModule)
      },
      {
        path:'',
        loadChildren: ()=> import('@modules/payment-method/payment-method.module')
              .then( m => m.PaymentMethodModule)
      }
      // ,
      // {
      //   path:'',
      //   loadChildren: ()=> import('@shared/shared.module')
      //         .then( m => m.SharedModule)
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
