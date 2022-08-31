import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guard/auth.guard';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';
import { UserComponent } from '@modules/user/user-login-register/user.component';

const routes: Routes = [
  {
      path:'login',
      component: UserComponent,
      children: [
        {
          path:'',
          loadChildren: ()=> import('@modules/user/user.module')
                  .then( m => m.UserModule)
        }
      ]
  },
  {
    path:'dashboard',
    component: SkeletonComponent,
    children: [
      {
        path:'',
        canActivate: [AuthGuard],
        loadChildren: ()=> import('@modules/expense/expense.module')
              .then( m => m.ExpenseModule)
      },
      {
        path:'',
        canActivate: [AuthGuard],
        loadChildren: ()=> import('@modules/period/period.module')
              .then( m => m.PeriodModule)
      },
      {
        path:'',
        canActivate: [AuthGuard],
        loadChildren: ()=> import('@modules/category/category.module')
              .then( m => m.CategoryModule)
      },
      {
        path:'',
        canActivate: [AuthGuard],
        loadChildren: ()=> import('@modules/according/according.module')
              .then( m => m.AccordingModule)
      },
      {
        path:'',
        canActivate: [AuthGuard],
        loadChildren: ()=> import('@modules/payment-method/payment-method.module')
              .then( m => m.PaymentMethodModule)
      }
    ]
  },
  {
    path:'**',
    component: SkeletonComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
