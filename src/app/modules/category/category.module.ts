import { NgModule } from '@angular/core';
import { CategoryRoutingModule } from './category-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    //ListCategoryComponent,
  ],
  imports: [
    CategoryRoutingModule,
    SharedModule,
    CommonModule
  ]
})
export class CategoryModule { }
